import { WeaponData } from 'alt-client';
import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
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


// function UseMagazine(player: alt.Player,item: Item, slot: number, type: INVENTORY_TYPE){
//     const weaponHash = player.currentWeapon
//     if (inventoryType === INVENTORY_TYPE.TOOLBAR) {
//         if (!Athena.player.inventory.toolbarRemove(player, item.slot)) {
//             return;
//         }

//         Athena.player.save.field(cuffer, 'toolbar', cuffer.data.toolbar);
//     }

//     if (inventoryType === INVENTORY_TYPE.INVENTORY) {
//         if (!Athena.player.inventory.inventoryRemove(cuffer, item.slot)) {
//             Athena.player.emit.notification(cuffer, `Could not find cuffs`);
//             return;
//         }
//     }

//     const keyItem = await ItemFactory.get(CUFF_ITEM_DB_NAMES.KEY);
//     const invRef = Athena.player.inventory.getFreeInventorySlot(cuffer);

// }