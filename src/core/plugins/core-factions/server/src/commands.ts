import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { PLAYER_SYNCED_META } from '../../../../shared/enums/playerSynced';
import { View_Events_Chat } from '../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { RoleplayCmdsConfig } from '../../../core-commands/server/config/commandsConfig';
import { DefaultRanks } from '../../shared/defaultData';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FACTION_PFUNC } from '../../shared/funcNames';
import { RankPermissionNames } from '../../shared/interfaces';
import { factionFuncs } from './exports';
import { FactionFuncs } from './funcs';
import { FactionHandler, FACTION_COLLECTION } from './handler';
import { FactionPlayerFuncs } from './playerFuncs';
import { VehicleSystem } from '../../../../server/systems/vehicle';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';
import { VEHICLE_OWNERSHIP } from '../../../../shared/flags/vehicleOwnershipFlags';


const lastInvite: { [character: string]: string } = {};

export class FactionCommands {
    static init() {
        // leave empty
    }

    /**
     * It creates a new faction.
     * @param player - alt.Player - The player who created the faction.
     * @param {string[]} name - The name of the faction.
     * @param {string} shortname - The shortname of the faction
     * @param {string} type - The type of the faction
     * @returns The result of the add function.
     */

    @command('fcreate', '/fcreate [abreviacion] [tipo: police, medic, legal, ilegal] [nombre] - Open faction panel if in faction.', PERMISSIONS.ADMIN)
    private static async handleFactionCreate(player: alt.Player, shortname: string, type: string, ...name: string[]) {
        const factionName = name.join(' ');
        const factionShortname = shortname
        const factionType = type
        if (type === "police" || type === "medic" || type === "legal" || type === "ilegal" ){
            const result = await FactionHandler.add(player.data._id.toString(), {
                bank: 0,
                canDisband: true,
                name: factionName,
                shortname: factionShortname,
                type: factionType
            });
    
            if (!result.status) {
                Athena.player.emit.message(player, result.response);
                return;
            }
    
            const id = result.response;
            Athena.player.emit.message(player, `Created Faction with ID: ${id}`);
        } else {
            Athena.player.emit.message(player, "No seleccionaste un tipo valido de faccion, debes elegir entre (police, medic, legal, ilegal) ")
        }
    }
        

    @command('borrarfaccion', '/borrarfaccion [nombre]', PERMISSIONS.ADMIN)
    private static async handleFactionErrase(player: alt.Player, id: string){
        await FactionHandler.remove(id)

        Athena.player.emit.message(player, `Se borro la faccion con la id: ${id}`);
    }

    @command('infofaccion', '/infofaccion',PERMISSIONS.ADMIN)
    private static async factionInformation(player: alt.Player){

        let factionName = FactionHandler.get(player.data.faction)
        Athena.player.emit.message(player, `La ID de la faccion es: ${player.data.faction}`);
        Athena.player.emit.message(player, `Nombre de la faccion es: ${factionName.name}`)
        Athena.player.emit.message(player, `El abreviativo de la faccion es: ${factionName.shortname}`)
        Athena.player.emit.message(player, `Dinero en el banco: ${factionName.bank}`)
        Athena.player.emit.message(player, `El tipo de la faccion es: ${factionName.type}`)

    }

    @command('fopen', '/fopen - Open faction panel if in faction.', PERMISSIONS.NONE)
    private static async handleOpenFactionPanel(player: alt.Player) {
        if (!player.data.faction) {
            Athena.player.emit.message(player, 'You are not in a faction.');
            return;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, 'You are not in a faction.');
            return;
        }

        alt.emitClient(player, FACTION_EVENTS.PROTOCOL.OPEN, faction);
    }

    @command('fjoin', '/fjoin [uid] - Quits Current Faction & Joins Another', PERMISSIONS.ADMIN)
    private static async handleForceJoinFaction(player: alt.Player, uid: string) {
        if (!uid) {
            Athena.player.emit.message(player, `You must specify a faction UID to join.`);
            return;
        }

        const faction = FactionHandler.get(uid);
        if (!faction) {
            Athena.player.emit.message(player, `That faction does not exist.`);
            return;
        }

        if (player.data.faction) {
            const currentFaction = FactionHandler.get(player.data.faction);
            if (currentFaction) {
                await FactionFuncs.kickMember(currentFaction, player.data._id);
            }
        }

        FactionFuncs.addMember(faction, player.data._id);
        Athena.player.emit.message(player, `Moved to Faction: ${faction.name}`);
    }

    @command('finvite', '/finvite [id_or_first_last] - Invite to faction', PERMISSIONS.NONE)
    private static async handleFactionInvite(player: alt.Player, idOrName: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `You are not in a faction.`);
            return;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player);
        if (!rank) {
            Athena.player.emit.message(player, `You have no rank in the faction?`);
            return;
        }

        if (!rank.rankPermissions.addMembers) {
            Athena.player.emit.message(player, `No permission to invite members to faction.`);
            return;
        }

        let target: alt.Player;

        if (isNaN(parseInt(idOrName))) {
            target = alt.Player.all.find(
                (x) => x && x.data && x.data.name.toLowerCase().includes(idOrName.toLowerCase()),
            );
        } else {
            target = Athena.systems.identifier.getPlayer(idOrName);
        }

        if (!target || !target.data || !target.valid || !idOrName || target === player) {
            Athena.player.emit.message(player, `/finvite [id_or_first_last]`);
            return;
        }

        if (target.data.faction) {
            Athena.player.emit.message(player, `${target.data.name} is already in a faction.`);
            return;
        }

        lastInvite[target.data._id] = player.data.faction;
        Athena.player.emit.message(player, `${target.data.name} was invited to the faction.`);
        Athena.player.emit.message(target, `${player.data.name} invited you to faction ${faction.name}.`);
        Athena.player.emit.message(target, `Type '/faccept' to join`);
    }

    @command('faccept', '/faccept - Join last invited to faction', PERMISSIONS.NONE)
    private static async handleFactionAccept(player: alt.Player) {
        if (player.data.faction) {
            Athena.player.emit.message(player, `Already in a faction.`);
            delete lastInvite[player.data._id];
            return;
        }

        if (!lastInvite[player.data._id]) {
            Athena.player.emit.message(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        const faction = FactionHandler.get(lastInvite[player.data._id]);
        if (!faction) {
            Athena.player.emit.message(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        delete lastInvite[player.data._id];
        const result = FactionFuncs.addMember(faction, player.data._id);
        if (!result) {
            Athena.player.emit.message(player, `Failed to join faction.`);
            return;
        }

        Athena.player.emit.message(player, `Joined faction ${faction.name}`);
    }

    @command(
        'fsetowner',
        '/fsetowner <player_id> - Set a member inside a faction to the owner of their faction.',
        PERMISSIONS.ADMIN,
    )
    private static async handleSetOwner(player: alt.Player, id: string) {
        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot find player with that ID.');
            return;
        }

        const faction = FactionHandler.get(target.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `Target player is not in a faction.`);
            return;
        }

        const didUpdate = await FactionFuncs.setOwner(faction, target.data._id.toString());
        if (!didUpdate) {
            Athena.player.emit.message(player, `${target.data.name} could not be set the owner of ${faction.name}.`);
            return;
        }

        Athena.player.emit.message(player, `${target.data.name} was set to owner of ${faction.name}`);
    }

    // COMANDOS POLICIALES


    @command('r','/r (radio), escribe tu mensaje',PERMISSIONS.NONE)
    static async r(player: alt.Player, ...args) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `No eres parte de una faccion.`);
            return;
        }           
        let msg = `{B5AF3F}**[ID: ${player.id}, C:${player.getSyncedMeta('canalRadioserver')}]: ${args.join(' ')}`;
            console.log(player.getSyncedMeta('canalRadioserver'))
            

            if (player.getSyncedMeta('canalRadioserver') === "0" || player.getSyncedMeta('canalRadioserver') === undefined) {
                player.setSyncedMeta('canalRadioserver', "0")
                const target = alt.Player.all.filter((x) => {if(x && x.data && x.data.faction === faction._id){
                    alt.emitClient(x, View_Events_Chat.Append,msg);
                }})
            } 
            else {
                const otroTarget = alt.Player.all.filter((x) => (x && x.data && x.data.faction === faction._id));
                otroTarget.filter((y) => {if(y.getSyncedMeta('canalRadioserver') === player.getSyncedMeta('canalRadioserver')){
                    alt.emitClient(y, View_Events_Chat.Append,msg);
                }})
            }
        }

    @command('canalradio', '/canalradio (1-100',PERMISSIONS.NONE)
    static async handleanalradio(player: alt.Player, args: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `No eres parte de una faccion.`);
            return;
        }
        if (args === null) {
            if (player.getSyncedMeta('canalRadioserver') === undefined) {
                Athena.player.emit.message(player, 'Tu canal de radio actual es: 0')
                return;
            }
            Athena.player.emit.message(player,`Tu canal de radio actual es: ${player.getSyncedMeta('canalRadioserver')}` )
            return;
        }

        player.setSyncedMeta('canalRadioserver', args)
        Athena.player.emit.message(player, `Tu canal de radio es: ${player.getSyncedMeta('canalRadioserver')}` )
    }
    @command('f','f (faccion), escribe tu mensaje', PERMISSIONS.NONE)
    static async f(player: alt.Player, ...args) {
        const faction = FactionHandler.get(player.data.faction);
        const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
        if (!faction) {
            Athena.player.emit.message(player, `No eres parte de una faccion.`);
            return;
        }           
        let name = player.getSyncedMeta(PLAYER_SYNCED_META.NAME) as string;
        name = name.replace('_', ' ');
        let msg = `{3b18d9}[${faction.shortname}, ${selfRank.name} ${name}]: ${args.join(' ')}`;
        const target = alt.Player.all.filter((x) => {if(x && x.data && x.data.faction === faction._id){
            alt.emitClient(x, View_Events_Chat.Append,msg);
        }})
    }

    @command('multar','/multar id dinero razon', PERMISSIONS.NONE)
    static async multar(player: alt.Player, id: number, ammount: number, ...reason:string[]){
        const faction = FactionHandler.get(player.data.faction);
        const reasonJoin = reason.join(' ')
        if (!faction) {
            Athena.player.emit.message(player, `No eres parte de una faccion.`);
            return;
        }   
        const target = Athena.systems.identifier.getPlayer(id);
        // || target === player
        if (!target || !target.valid || !id ) {
            Athena.player.emit.message(target, 'Debes especificar una ID valida');
            return
        };
        if (ammount <= 0) {
            Athena.player.emit.message(target, 'Debes especificar una cantidad de dinero valida');
            return;
        };

        if(target.data.cash >= ammount) {
            Athena.player.currency.sub(target, CurrencyTypes.CASH, ammount)
            Athena.player.emit.message(target, `Se te ha cobrado una multa de $${ammount} por: ${reasonJoin}` )
            Athena.player.emit.message(player, `Has cobrado una multa de $${ammount} por: ${reasonJoin}` )

        } else {
            if (target.data.bank >= ammount) {
                Athena.player.currency.sub(target, CurrencyTypes.BANK, ammount)
                Athena.player.emit.message(target, `Se te ha cobrado una multa de $${ammount} por: ${reasonJoin}, el dinero se ha extraido de tu banco` )
                Athena.player.emit.message(player, `Has cobrado una multa de $${ammount} por: ${reasonJoin}` )

            } else {
                Athena.player.emit.message(player, 'El sujeto no tiene dinero para pagar la multa.')
            }
        }
    }

    @command('m', '/(m)egafono', PERMISSIONS.NONE)
    static async handleMCommand(player: alt.Player, vehicle: alt.Vehicle, ...args: any[]) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('megafono'));
            return;
        }
        // const factionVehicle = player.vehicle.

        if (!player.vehicle) {
            Athena.player.emit.message(player, 'No estas en un vehiculo equipado.')
            return
        }
        if (vehicle.data.ownerType !=  VEHICLE_OWNERSHIP.FACTION) {
            Athena.player.emit.message(player, 'No estas en un vehiculo equipado.')
            return
        }
        const fullMessage = args.join(' ');
        const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_SHOUT_DISTANCE);

        alt.emitClient(
            closestPlayers,
            View_Events_Chat.Append,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_MEGAPHONE_COLOR}[MEGAFONO] ${player.data.name}: ${fullMessage}`,
        );

    
    }

    @command('equipar', '/equipar', PERMISSIONS.NONE)
    static async handleEquipar(player: alt.Player){
        function showActionMenu(player: alt.Player) {
            
        }
    }

    // COMANDOS MEDICOS


}
