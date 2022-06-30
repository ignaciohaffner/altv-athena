import * as alt from 'alt-client';
import * as native from 'natives';
import { config } from '../shared/config';

alt.on('connectionComplete', () => {
    if (config.shootingStat.enabled) {
        alt.setStat('shooting_ability', config.shootingStat.value);
    }
});

alt.everyTick(() => {
    if (native.isPedShooting(alt.Player.local.scriptID)) {
        if (config.shootingStat.enabled) {
            alt.setStat('shooting_ability', config.shootingStat.value);
        }

        let weapon = native.getSelectedPedWeapon(alt.Player.local.scriptID);
        if (config.rates[weapon] && config.rates[weapon] != 0) {
            native.setGameplayCamRelativePitch(native.getGameplayCamRelativePitch() + config.rates[weapon], 1.2);
        }
    }
});
