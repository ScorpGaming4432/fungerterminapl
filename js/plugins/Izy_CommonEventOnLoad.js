//============================================================================
// Izy_CommonEventOnLoad.js
//----------------------------------------------------------------------------
// This script will excute a command event when load saved game.
//============================================================================

var Imported = Imported || {};
Imported.Izy_ComEveOnLod = true;
Imported.Izy_ComEveOnLod_name = "Izy's Common Event On-Load";
Imported.Izy_ComEveOnLod_desc = "This script will excute a command event when load saved game.";
Imported.Izy_ComEveOnLod_version = '1.01';
Imported.Izy_ComEveOnLod_author = 'Izyees Fariz';

var Izy_ComEveOnLod = Izy_ComEveOnLod || {};

/*:
 * @plugindesc This script will excute a command event when load saved game.
 * Izys library scripts.
 * @author Izyees Fariz
 *
 * @param Common Event ID
 * @desc Common event id to run when load saved game. Leave 0 for none.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This script will excute a command event when load saved game.
 * Free for commercial and non-Commercial games.
 * Credit me as Izyees Fariz.
 * No Plugin Commands.
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.01:
 * - Fix the bug where the common event continuosly excute.
 * Version 1.00:
 * - Finished Plugin!
 */

//============================================================================
// Startin' Script.
//============================================================================

(function () {
	var parameters = PluginManager.parameters('Izy_CommonEventOnLoad');
	Izy_ComEveOnLod.CommonEventID = Number(parameters['Common Event ID']);

	//============================================================================
	// Data Manager.
	//============================================================================
	Izy_ComEveOnLod.dtaCrtGO = DataManager.createGameObjects;
	DataManager.createGameObjects = function () {
		Izy_ComEveOnLod.dtaCrtGO.apply(this);
		$_isLoad = false;
	};

	Izy_ComEveOnLod.mksave = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function () {
		var contents = Izy_ComEveOnLod.mksave.call(this);
		contents._vil = true;
		return contents;
	};

	Izy_ComEveOnLod.extractSave = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function (contents) {
		Izy_ComEveOnLod.extractSave.call(this, contents);
		$_isLoad = contents._vil || false;
	};

	Izy_ComEveOnLod.scenemapa = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function () {
		Izy_ComEveOnLod.scenemapa.apply(this);
		if ($_isLoad) {
			if (Izy_ComEveOnLod.CommonEventID > 0)
				$gameTemp.reserveCommonEvent(Izy_ComEveOnLod.CommonEventID);
				$_isLoad = false;
		}
	};

})();

//============================================================================
// End Script.
//============================================================================
