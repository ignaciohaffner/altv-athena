import * as alt from 'alt-server';
import { type } from 'os';
import { PluginSystem } from '../../../server/systems/plugins';
import { View_Events_Chat } from '../../../shared/enums/views';
import { getWeaponByName } from '../../../shared/information/weaponList';

const PLUGIN_NAME = 'Wound System';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    // Initialize other things for your plugin here...
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});

alt.on('weaponDamage', (source, target, weaponHash, damage, bodyPart) => {
    const validPlayers = [...alt.Player.all].filter((x) => x && x.valid && x.data);
    alt.emitClient(validPlayers, View_Events_Chat.Append, `[BROADCAST] ${source.name} le hizo daño a ${target}, infligio ${damage} y en la parte ${bodyPart}`);
} )


