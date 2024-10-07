//=============================================================================
// DisableMapRegen.js
//=============================================================================

/*:
 * @plugindesc Disables regeneration on maps.
 * @author John Clifford (Trihan)
 *
 * @param Disable HP regen
 * @desc Disable map regeneration for HP.
 * @default true
 *
 * @param Disable MP regen
 * @desc Disable map regeneration for MP.
 * @default true
 *
 * @param Disable TP regen
 * @desc Disable map regeneration for TP.
 * @default true
 *
 * @help
 *
 * Plug and play. Disables all regen by default, but there are parameters to allow HP, MP or TP regen separately.
 *
 * Terms of use
 * Please feel free to use this plugin for any purpose you see fit. Credit is appreciated but not necessary.
 *
 */

(function() {
    var parameters = PluginManager.parameters('DisableMapRegen');
    
    Game_Actor.prototype.turnEndOnMap = function() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.clearResult();
            this.regenerateMap();
            this.updateStateTurns();
            this.updateBuffTurns();
            this.removeStatesAuto(2);
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    };
    
    Game_Actor.prototype.regenerateMap = function() {
        if (this.isAlive()) {
            if (parameters['Disable HP regen'] !== "true") {
                this.regenerateHp();
            }
            if (parameters['Disable MP regen'] !== "true") {
                this.regenerateMp();
            }
            if (parameters['Disable TP regen'] !== "true") {
                this.regenerateTp();
            }
        }
    };
})();