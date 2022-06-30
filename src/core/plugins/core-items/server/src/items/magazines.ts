import { WeaponData } from 'alt-client';
import * as alt from 'alt-server';
import { INVENTORY_TYPE } from '../../../../../shared/enums/inventoryTypes';
import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';

export const magazines: Array<Item> = [
    {
        name: `Cargadorpistola`,
        description: `Añade 18 balas.`,
        dbName: 'combatp-mag',
        icon: 'combatp-mag',
        slot: 0,
        quantity: 1,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE |
            ITEM_TYPE.SKIP_CONSUMABLE,
        data: {
            event: 'effect:Vehicle:Repair',
        },
        version: 1,
        model:'w_pi_combatpistol_mag1' ,
    },
];


function UseMagazine(player: alt.Player,item: Item, slot: number, type: INVENTORY_TYPE){
    const weaponHash = player.currentWeapon
    

}