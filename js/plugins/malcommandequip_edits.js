//=============================================================================
// Maliki's Equip Battle Command edits
// MalCommandequip_edits.js
// version 1.0
//=============================================================================
/*:  
 * @plugindesc Fixes equip pick crash issue in original plugin and adds turn loss option. 
 * @author Maliki79 (original plugin by Jeneeus Guruman)
 * @param CooldownState
 * @desc ID of state to add to actors to facilitate Equip changing costing a turn.  Leave 0 to not add state.
 * Default: 0
 * @default 0
 *
 * @help You need two steps to use this plugin:
 * 1: If you have not done so already, install the commandequip.js plugin
 *    currently found at http://forums.rpgmakerweb.com/index.php?/topic/49324-equip-battle-command/
 * 2: If you want to impose a used turn when changing equips, you'll need to first make a cooldown state.
 *    It will need to restrict movement, remove at battle end, and auto cure at turn end, duration of 1 - 1.
 *    You may also want to remove the "state removal" text to keep the transition smoother.
 * Note that you must keep the name of this plugin MalCommandequip_edits.js.
 */

var Mal = Mal || {}; 

Mal.Parameters = PluginManager.parameters('MalCommandequip_edits');
Mal.Param = Mal.Param || {};
 
Mal.Param.coolD = (Mal.Parameters['CooldownState']);

var MalcommandEquipment = Scene_Battle.prototype.commandEquipment;
Scene_Battle.prototype.commandEquipment = function() {
    MalcommandEquipment.call(this);
	BattleManager.actor()._origEquips = [];
	for (i = 0; i < BattleManager.actor()._equips.length; i++ ) {
	if(BattleManager.actor()._equips[i]) {
	BattleManager.actor()._origEquips[i] = BattleManager.actor()._equips[i]._itemId;
	} else {
	BattleManager.actor()._origEquips[i] = 0;
	}
	}
};

Scene_Battle.prototype.commandEquip = function() {
    this._slotWindow.refresh();
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_Battle.prototype.equipCheck = function() {
for (i = 0; i < BattleManager.actor()._equips.length; i++ ) {
 if (BattleManager.actor()._origEquips[i] != BattleManager.actor()._equips[i]._itemId) return false;
}
return true;
}

var MalEquipCancel = Scene_Battle.prototype.commandEquipmentCancel;
Scene_Battle.prototype.commandEquipmentCancel = function() {
    MalEquipCancel.call(this);
	if(Mal.Param.coolD != 0) {
	if(!this.equipCheck()) {
	BattleManager.actor().addState(Number(Mal.Param.coolD) || 0);
	BattleManager.selectNextCommand();
	this.changeInputWindow();
	BattleManager._statusWindow.refresh();
	console.log(BattleManager.actor());
	if(!BattleManager.actor()) {
	BattleManager.startTurn();
	this._actorCommandWindow.deactivate();
	}
	}
	}
};