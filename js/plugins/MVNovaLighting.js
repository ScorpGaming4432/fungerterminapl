"use strict";
var Imported = Imported || {};
Imported.MVNovaLighting = '1.3.0';
//=============================================================================
/*
* MVNovaLighting.js
* Versions:
*
* 1.3.0 - Fixed Morph Dependency
*       - Fixed Event Light Intensity not working for fire
*       - Added Light Intensity to radiusgrow
* 1.2.0 - Added intensity (alpha) to none player lights
* 1.1.0 - Added Terrax Mode
* 1.0.0 - Finished
* 0.5.0 - WIP
*/
//=============================================================================

var Anisoft = Anisoft || {};
Anisoft.Nova = Anisoft.Nova || {};


/*:
 * @target MV
 * @plugindesc <MVNovaLighting>
 * @author Anisoft/Quasi (QPlus functions) || Version 1.2.0
 *
 * @param Default Ambient Light
 * @desc Default Ambient Light used to darken the environment.
 * @type String
 * @default 0x0D2CF0
 *
 * @param Default Ambient Duration
  * @desc Default time in seconds for ambient light transition (Used for tint fade)
 * @type Number
 * @default 60
 *
 *
 * @param Default Player Radius
 * @desc Default radius for player light
 * @type Number
 * @default 300
 *
 * @param Default Flashlight Length
 * @desc Default length for player flashlight
 * @type Number
 * @default 12
 *
 * @param Default Flashlight Width
 * @desc Default width for player flashlight
 * @type Number
 * @default 16
 *
 * @param Flashlight Offset
 * @desc Flashlight offset x, y
 * @default 0, 0
 *
 * @param Terrax Legacy Settings
 *
 * @param Terrax Lighting
 * @parent Terrax Legacy Settings
 * @desc Changes the blendmodes of the lighting to match terrax (removes the additive bloomyness)
 * @type boolean
 * @default false //
 *
 * @param Terrax Lighting Force Alpha One
 * @parent Terrax Legacy Settings
 * @desc Forces the lights alpha (intensity) to 1 (Can help remove unwanted artifacts/complexity with settings lights up)
 * @type boolean
 * @default false
 *
 * @param Default Bitmap Resolution
 * @parent Terrax Legacy Settings
 * @desc Default resolution for lights generated from bitmap. Keep this value multiples/powers of 2 Ex: 4,16,64,128,256
 * @type number
 * @default 64
 *
 *
 * @requires QPlus
 *
  * @help
  *
  * Requires Pixi 4.7.1, included in download.
  * Game Folder -> JS -> Libs -> Replace your Pixie with the 4.7.1 version.
  *
  * To activate the script on a map, do the following:
  * 1. Put an event onto a map.
  * 2. In the 'Note' field (Next to the name) put the following text:
  * 'Light 250 #a25600'
  * - 250 is the lightradius of the object
  * - #a25600 is a nice color for torches (Yellow/Orange in this case)
  * - #FFFFFF is pure white light and not recommended for regular light.
  * - (PS: #FFFFFF white light works great with the Terrax Legacy option enabled)
  *
  * - If You want a white light use a white light with intensity/alpha of 80%
  * - So 'Light radius 150 #FFFFFF -1 .8' (No id, intensity 80%, -1 means no ID)
  * - Or 'Light radius 150 #FFFFFF 2 .8' (Id 2, intensity 80%)
  * 3. You're done, its that simple.
  *
  * PS: A nice evil red is '#8F0C00'
  *
  * - If you want to "Shut off" your light, simple reduce your radius to 0, example: Fire radius 0 #a25600
  *
  * If you want to start with a day time tint, use '0xffffff' in the plugin options.
  *
  * If the intensity of the lights are too much, you can make the lights much more basic in the options.
  * Simply turn on the "Terrax Legacy" plugin option. Recommend to leave light intensity alone with Terrax.
  * This will make the lights look like default Terrax Lights.
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * There are two flavors of lights.
  * 1) Lights with no IDs
  * 2) Lights with IDs
  *
  * 1) Lights with no IDs are by default ON (unless told to be off)
  * - Example: 'Light 250 #a25600'         (No ID, Default on, intensity 100%)
  * - Example: 'Light 250 #a25600 -1 .9'   (No ID, Default on, intensity 90%)
  * - '-1' stands for no ID so its default on, used if you need a number to adjust intensity
  * - Use plugin command 'Light on' or 'Light off' from within event to control light.
  *
  * 2) Lights with IDs are by default OFF (unless told to be on)
  * - Example: 'Light 250 #8F0C00 2'       (ID 2, Default off, intensity 100%)
  * - Example: 'Light 250 #8F0C00 5 .8'    (ID 5, Default off, intensity 80%)
  * - These Lights must be told do be on. Use Plugin command 'Light on ID' like 'Light on 2'
  * - Or you can simply use the Plugin Command 'Light on' from within the event, no need for ID (it knows own ID).
  *
  * - There is a tricky situation that may arise with these lights. They are always default on or off.
  * - In order to control these lights I will show you how you can master these events so that
  * - they will always be on or off appropriately.
  * - For this to work you need each map to have an autorun, and need the CE on game load script 'Izy_CommonEventOnLoad'.
  * - This will be used to call a common event that can tell lights to update itself, details below.
  * - This game load script is included in the download, I did not create it, so please read the terms and give credit
  *
  * Have your map autorun turn on the events selfswitch D to tell each event to set their lights up properly (Script below).
  * Set this page as the last page in the event and set as an autorun that turns off selfswitch D when its done.
  * Use selfswitch A to keep track if the Light should be on or off, and selfswitch D to run autorun when on.
  *
  * - Based on Selfswitch A, Light on or Light off, Selfswitch D off when the autorun is done
  * - (If selfswitch A is on: 'Light on' else 'Light off')
  *
  * (Important and powerful script)
  * var m = $gameMap.mapId();
  * for (var s = 1; s < $dataMap.events.length; s++){
  *   $gameSelfSwitches.setValue([m, s, 'D'], true);
  * }
  *
  * (This script snippet, takes all the events in the current map and sets their selfswitch D to true)
  *
  * - Make this a Common Event, and have the map autoruns, and the game load script, call this.
  * - if this is too complicated, no worries, I will create a youtube video to walk you through this
  * - Link:
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * Main take away: all of your maps should have an Autorun that fixes lights with a CE (if using advanced light mechanics)
  * The game load script will take care of loaded games with the same CE (because autorun would have already run)
  * NO PARALLELS! lol
  * Autoruns are MUCH better and can get the job done.
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * To alter the player radius in game use the following plugin command :
  * Light radius 200 #a25600  (to change the radius and the color)
  * If you want to change the player radius slowly over time (like a dying torch)
  * use the command 'Light radiusgrow 200 #a25600'
  * You can also adjust intensity to 80% 'Light radiusgrow 200 #a25600 .8'
  *
  * Recap Basics:
  * To turn on and off lightsources in the game, do the following:
  * Give the lightsource the normal def :  Light 250 #a25600 and an extra number
  * so it becomes 'Light 250 #a25600 1'
  * To turn on this light use plugin command : 'Light on 1'.
  * To turn off the light use plugin command : 'Light off 1'.
  * Events also a reference to their own light even of its numbered.
  * Simply use 'Light on' or 'Light off' to turn on or turn off a light.
  * Please Remember IDs are map specific, so you can give the same ID to a different light on a different map.
  * I recommend that if you want to control all lights of a certain kind, assign them all the same ID.
  *
  * With the default Nova lighting enabled (Terrax version off) you have to be mindful of the tinting and intensity of lights
  * They can become too intense if you use colors that are too bright, the solution?
  * - Change the intensity of the light
  * - Use Darker colors
  * 'Light radius 200 #FFFFFF -1 .5' where .5 is the intensity. Light intensity ranges from 0 to 1
  *
  * If you do not want to assign the light an ID, give it ID -1 so 'Light radius 150 #a25600 -1 .9'
  * so this light with behave as if no ID was given and have an intensity of 90%
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * You can alter the size and color of existing Lights! (plugin command)
  * light size #color id     (ID is optional)
  * light 450 #027218        Where Size is now 450 and Color is green
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * Replacing the 'Light' with 'Fire' will give the lights a subtle flicker
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * The plugin command 'Tint set #333333' will make the room less dark.
  * The plugin command 'Tint fade #777777 5' will fade the color from the current color to the new, the last
  * The number (5) is the speed of the fade, were 1 is a fast fade and 20 is a very slow one.
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * To use a flashlight effect for player use 'Flashlight on 8 12 #FFFFFF' and 'Flashlight on'
  * Where 8 = beamlength and 12 = beamwidth
  * To use a flashlight effect with ID for event use 'Flashlight on 8 12 #FFFFFF 3' and 'Flashlight off' or 'Flashlight on 8 12 #FFFFFF'
  * Light intensity works the same for flashlights 'light radius color id alpha'.
  *
  * Again, if the intensity of the lights are too much, you can make the lights much more basic in the options.
  * Simply turn on the "Terrax Legacy" plugin option. Leave Light intensity at 100% in this mode
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * If you want to lower strain on computer lower the bit map resolution.
  * Lights closer together requires more computation.
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * This Plugin is compatible with Yanfly Copy Event and Spawn Event.
  * It is highly recommended that you use these plugins to maximize your lighting mechanics.
  *
  * The Killer Gin will create videos on Youtube to help with the basics
  * and also to help illustrate how to maximize the plugins potential.
  * Video: https://youtu.be/2OvKN_SuT4g
  *
  * Link to Yanfly Copy Event (Highly Recommended!): https://www.youtube.com/watch?v=LimmJm_4bYE&ab_channel=YanflyEngine
  * Link to Yanfly Spawn Event (Highly Recommended!): https://www.youtube.com/watch?v=ER1ZvfAjUXc&ab_channel=YanflyEngine
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * You can now SWITCH betwen Nova Lighting Style and Terrax Style at ANYTIME in the game!
  * (Script calls)
  *
  * "Anisoft.Nova.TerraxLighting = true;" Change to Terrax Style
  *
  * "Anisoft.Nova.TerraxLighting = false;" Change back to Nova Style
  *
  * Oh yeah, you may notice a plugin option to force 100 light intensity, I used that as a shortcut to move between the two styles
  * However, this is not necessary and might be removed in the next version, because you can update lights manually.
  * Remember, you can use plugin commands to alter a lights size and color at anytime so this is not needed.
  *
  *
  * Incoming, Nova Lighting DEMO and diagonal Flashlights! (In case you are using an Q- 8 movement plugin)
  *
  * ////////////////////////////////////////////////////////////////////////////
  *
  * /////////////
  * Terms of Use:
  * /////////////
  * 1) This Plugin is a collaboration between the Killer Gin and Dairnon, you must credit us in your game credits page.
  * 2) This Plugin is a paid plugin, you must have purchased this plugin on STEAM or Itch.io to use.
  * 3) You may edit and patch the code.
  * 4) Code may not be redistributed.
  *
  * Please report to thekillergin at gmail.com if someone is using this code without permission.
  *
  * Special thanks to everyone in the rpgmakerweb community for idea's, support and interest.
  *
  *------------------------------------------------------------------------------
 */
 //=============================================================================
 // ** PLUGIN PARAMETERS
 //=============================================================================
($=> {
    const filter = $plugins.filter(function (p) {
        return p.description.contains('<MVNovaLighting>') && p.status;
    })[0];
    const params = filter.parameters;
    if (!params) {
        console.warn("Failed to load parameters, Remove and Re-add the plugin to reset them")
    }
    $.ambientLight = Number(params['Default Ambient Light']) || 0x0D2CF0;
    $.ambientLightTarget = $.ambientLight;
    $.ambientLightTime = 1;
    $.ambientLightDuration =   1/(Number(params['Default Ambient Duration']) || 60);

    const defaultPlayerRadius = params['Default Player Radius'];
    $.playerRadius = (defaultPlayerRadius !== undefined) ? Number(defaultPlayerRadius) : 300;

    const defaultFlashlightLength = params['Default Flashlight Length'];
    $.defaultFlashlightLength = (defaultFlashlightLength !== undefined) ? Number(defaultFlashlightLength) : 12;

    const defaultFlashlightWidth = params['Default Flashlight Width'];
    $.defaultFlashlightWidth = (defaultFlashlightWidth !== undefined) ? Number(defaultFlashlightWidth) : 16;

    $.defaultBitmapResolution = Number(params['Default Bitmap Resolution']) || 64;

    $.playerLightOffset = params['Flashlight Offset'].trim().split(/\s*,\s*/).map(x=>+x);

    $.TerraxLighting = params['Terrax Lighting'] === "true"

    $.TerraxLightingAlphaOne = params['Terrax Lighting Force Alpha One'] === "true"

    //Anisoft.Nova.TerraxLighting = true;
})(Anisoft.Nova);

//-----------------------------------------------------------------------------
// Utils
($ => {
    $.string2hex = function (string) {
        if (typeof string === 'string' && string[0] === '#') {
            string = string.substr(1);
        }
        return parseInt(string, 16);
    };
    //https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
    $.lerpHexColor = function(a, b, amount) {
        const ar = a >> 16,
            ag = a >> 8 & 0xff,
            ab = a & 0xff,

            br = b >> 16,
            bg = b >> 8 & 0xff,
            bb = b & 0xff,

            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return (rr << 16) + (rg << 8) + (rb | 0);
    };

    $.lerp = function(a, b, amount) {
        return a*(1-amount)+b*amount
    }

    $.validHexColor = function(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex)
    }
})(Anisoft.Nova);


//-----------------------------------------------------------------------------
// DataManager
($ => {
    if (Imported.QPlus){
        const Alias_extractQData = $.extractQData;
        $.extractQData = function (data, object) {
            Alias_extractQData.call(this, data, object);
            this.getLightData(data);
        };
    } else {
        var reading = null;
        const Alias_onLoad = $.onLoad;
        $.onLoad = function(object) {
            reading = object;
            Alias_onLoad.call(this, object);
            reading = null;
        };

        const Alias_extractMetadata = $.extractMetadata;
        $.extractMetadata = function(data) {
            Alias_extractMetadata.call(this, data);
            const blockRegex = /<([^<>:\/]+)>([\s\S]*?)<\/\1>/g;
            data.qmeta = Object.assign({}, data.meta);
            while (true) {
                const match = blockRegex.exec(data.note);
                if (match) {
                    data.qmeta[match[1]] = match[2];
                } else {
                    break;
                }
            }
            this.extractQData(data, reading);
        };

        $.extractQData = function(data, object) {
            // to be aliased by plugins
            this.getLightData(data);

        };
    }


    $.getLightData = function (data) {
        const notes = data.note.toLowerCase().split(" ");
        const lightType = notes.shift()
        if (lightType === 'light' || lightType === 'fire' || lightType === 'flashlight') {

            let bitmap;
            let tint;
            let radius;
            let alpha;
            if (lightType === 'flashlight') {
                const length = notes.shift();
                const width = notes.shift();
                bitmap = Anisoft.Nova.LightBitmapGenerator.getConeLight(length, width)
            } else {
                radius = notes.shift();
            }

            tint = notes.shift();
            const id= notes.shift();

            alpha = notes.shift();

            if (lightType) {
                data.lightData = data.lightData || [];

                data.lightData.push({
                    id: 0,
                    gid: id > -1 ? id : null,

                    type: lightType,
                    active: id > -1 ? !id : true,
                    //persistent: true,
                    radius: radius!==undefined ? Number(radius) : 512,
                    tint: tint ? Anisoft.Nova.string2hex(tint) : 0xffffff,
                    bitmap: bitmap,
                    flicker: lightType === "fire",
                    alpha: alpha !== undefined ? Number(alpha) : 1
                });

            }
        }

    };

    const Alias_makeSaveContents = $.makeSaveContents;
    $.makeSaveContents = function() {
        const contents = Alias_makeSaveContents.call(this);
        contents.lightData = Anisoft.Nova.LightManager.saveData();
        return contents;
    };

    const Alias_extractSaveContents = $.extractSaveContents;
    $.extractSaveContents = function(contents){
        const events = $gameMap.events();
        $gamePlayer.setupLights();
        for (let i = 0; i < events.length; ++i) {
            events[i].setupLights();
        }
        Anisoft.Nova.LightManager.loadData(contents.lightData);


        Alias_extractSaveContents.call(this, contents)
    };

    const Alias_createGameObjects = $.createGameObjects;
    $.createGameObjects = function() {
        Alias_createGameObjects.call(this);
        Anisoft.Nova.LightManager.reset(true);
    };

    if (Imported.YEP_EventCopier || Imported.YEP_EventSpawner) {
            $.checkPreloadedMaps = function() {
                const maps = Yanfly.PreloadedMaps;
                for (let i =0; i < maps.length; ++i) {
                    const map = maps[i];
                    if (map === null) return this.checkPreloadedMaps.call(this);
                }
                for (let i =0; i < maps.length; ++i) {
                    const map = maps[i];
                    if (!map) continue;
                    const events = map.events;
                    if (Array.isArray(events)) {
                        for (let p = 0; p < events.length; p++) {
                            const data = events[p];
                            if (data && data.note !== undefined) {
                                $.extractMetadata(data);
                            }
                        }
                    }
                }
                return true;
            };
            const Alias_isMapLoaded = $.isMapLoaded
            $.isMapLoaded = function() {
                return ($.checkPreloadedMaps() && Alias_isMapLoaded.call(this))
            };
    }


})(DataManager);

//-----------------------------------------------------------------------------
// Game_Interpreter
($=> {
    const Alias_pluginCommand = $.pluginCommand;
    $.pluginCommand = function(command, args) {
        Alias_pluginCommand.call(this, ...arguments);
        command = command.toLowerCase();

        //LEGACY TERRAX
        args = args.map(v => v.toLowerCase());
        if (command === 'tint') {
            if (args[0] === 'set') {
                Anisoft.Nova.ambientLight = Anisoft.Nova.string2hex(args[1]);
                Anisoft.Nova.ambientLightTarget = Anisoft.Nova.ambientLight;
                Anisoft.Nova.ambientLightTime = 1;
            }
            if (args[0] === 'fade') {
                Anisoft.Nova.ambientLightTarget = Anisoft.Nova.string2hex(args[1])
                Anisoft.Nova.ambientLightTime = 0;
            }
        }

        if (command === 'light' || command === "fire" || command === "flashlight") {

            const player = args[0];
            if (player === 'radius') {
                const light = Anisoft.Nova.LightManager.getLight('player_0');

                const active = args[1];
                if (active === 'off' || active === 'on') {
                    light.active = active === 'on';
                    light.refresh();
                    return;
                }

                const radius = Number(args[1]);
                if (radius >= 0) {
                    light.scale.set(radius);
                    light._scaleTarget.copy(light.scale)
                }

                const tint = args[2];
                if (/^#[0-9A-F]{6}$/i.test(tint)) {
                    light.tint = Anisoft.Nova.string2hex(tint)
                    light.tintTarget = light.tint;
                }

                const alpha= Number(args[3]);
                if (alpha  >= 0) {
                    light.alpha = alpha;
                }

                light.refresh();
                return;
            }

            if (command === "flashlight") {
                const light = Anisoft.Nova.LightManager.getLight('player_0');

                if (args[0] === 'off' || args[0] === 'on') {
                    let length = args[1];
                    let width = args[2];
                    if (args[0] === 'on') {
                        light.bitmap = Anisoft.Nova.LightBitmapGenerator.getConeLight(length !== undefined ? length : Anisoft.Nova.defaultFlashlightLength, width !== undefined ? width : Anisoft.Nova.defaultFlashlightWidth)
                    } else {
                        light.bitmap = null;
                    }
                    args.shift()
                }
                light.offset.set(Anisoft.Nova.playerLightOffset[0], Anisoft.Nova.playerLightOffset[1])
                console.log(light.offset)
            } else {
                const light = Anisoft.Nova.LightManager.getLight('player_0');

                light.offset.set(0,0);
            }

            if (player === 'radiusgrow') {
                const light = Anisoft.Nova.LightManager.getLight('player_0');

                if (!light) return;
                const radius = Number(args[1]);
                if (radius  >= 0) {
                    light._scaleTarget.set(radius)
                }

                const tint = args[2];
                if (/^#[0-9A-F]{6}$/i.test(tint)) {
                    light._tintTarget = Anisoft.Nova.string2hex(tint)
                }

                const alpha = Number(args[3]);
                if (alpha >= 0) {
                    light._alphaTarget = alpha;
                }

                light.resetGrow();
            }


            let light, lightMultiple;
            const lastArg = args[args.length-1];

            if (!isNaN(lastArg)) {
                lightMultiple = true;
                args.pop();
            } else {
                const event = $gameMap._events[this._eventId];
                if (event && event._lights) light = Anisoft.Nova.LightManager.getLight(event._lights[0]);
            }
            if (!light && !lightMultiple) return;

            if (args[0] === 'off' || args[0] === 'on') {
                if (lightMultiple) {
                    light = Anisoft.Nova.LightManager.rangeLights(Number(lastArg), {active: args[0] === 'on'})
                } else {
                    light.active = args[0] === 'on';

                }
                args.shift()

            }

            let tint = args[args.length-1];
            if (Anisoft.Nova.validHexColor( tint )) {
                tint = Anisoft.Nova.string2hex( args.pop() );
                console.log(tint);
                if (lightMultiple) {
                    light = Anisoft.Nova.LightManager.rangeLights(Number(lastArg), {tint: tint})
                } else {
                    light.tint = tint;

                }

                let radius = args[args.length-1]
                if (!isNaN(radius))
                {
                    radius = args.pop();
                    if (lightMultiple) {
                        light = Anisoft.Nova.LightManager.rangeLights(Number(lastArg), {scale: radius})
                    } else {
                        light.scale = radius;

                    }
                }

            }


            if (light) light.refresh();
        }
    }
})(Game_Interpreter.prototype);


//=============================================================================
// ** Light Game Data
//=============================================================================

//-----------------------------------------------------------------------------
// Game_LightManager
($ => {
    class Game_LightManager {
        constructor() {
            this._lights = {};
            this._dirtyLights = [];
        }

        createLight(event, data) {
            const id = this.createID(event, data);
            const light = new Anisoft.Nova.Game_Light(id, event._realX, event._realY, data);

            this.add(light);
            return light;
        }

        createID(value, data) {
            const mapId = $gameMap.mapId();
            if (data.gid) {
                const eventID = value.eventId();

                return `${mapId}_${eventID}_${data.gid}`;
            }
            if (value.constructor === Game_Event) {
                const eventID = value.eventId();
                return `${mapId}_${eventID}_${data.id}`;
            }
            else {
                return `player_${data.id || 0}`
            }
        }


        add(light, force) {
            if (force) {
                this._lights[light.id] = light;
            }
            if (!force && this._lights[light.id]) return;
            this._lights[light.id] = light;

            if (Anisoft.Nova.lightMapContainer) {
                Anisoft.Nova.lightMapContainer.createSpriteLight(light);
            }
        }

        addDirty(light) {
            if (this._dirtyLights.indexOf(light.id) === -1)
                this._dirtyLights.push(light.id)

        }

        removeDirty(light) {
            const index = this._dirtyLights.indexOf(light.id)
            if (index > -1)
                this._dirtyLights.splice(index, 1);
        }

        getLight(id) {
            return this._lights[id];
        }

        lights() {
            return this._lights;
        }

        currentMapLights() {
            const mapId = $gameMap.mapId();
            return Object.values(this.lights()).filter(l=> {
                const split = l.id.split('_');

                if (split.length === 3) {
                    const ID = Number(split[0]);
                    return ID === mapId
                }
                return l;
            });
        }

        clear(resetPersistent) {
            if (resetPersistent) {
                this._lights = {};
            } else {
                for (const i in this._lights) {
                    const light = this._lights[i]
                    if (!light.persistent) {
                        delete this._lights[i] ;
                    }
                }
            }
            this._dirtyLights = [];
        }

        update() {
            for (let i = 0; i < this._dirtyLights.length; ++i) {
                const id = this._dirtyLights[i];
                this._lights[id].update();
            }
        }

        reset(resetPersistent) {
            this.clear(resetPersistent);

        }

        rangeLights(id, object) {
            const lights = Object.values(this._lights)

            lights.forEach(l=> {
                const split = l.id.split('_');
                if (split.length === 3) {
                    if (Number(split[0]) === $gameMap.mapId() && Number(split[2]) === id) {
                        for (const o in object) {
                            if (l[o] !== undefined) l[o] = object[o];
                        }
                    }
                }

            })
        }

        saveData() {
            const saveList = [];
            const lights = Object.values(this._lights);
            for (let i = 0, len = lights.length; i < len; ++i) {
                const light = lights[i];
                if (light.persistent) {
                    saveList.push(light.toJSON());
                }

            }
            return saveList;
        }

        loadData(data) {
            this.reset(true);
            if (!data) return;
            for (let i = 0, len = data.length; i < len; ++i) {
                const lightData = data[i];
                const light = new Anisoft.Nova.Game_Light(lightData.id, lightData.position.x, lightData.position.y, lightData);
                this.add(light, true);
            }
        }

    }

    $.LightManager = new Game_LightManager();
})(Anisoft.Nova);

//-----------------------------------------------------------------------------
// Game_Light
($ => {
    class Game_Light {

        get id() {
            return this._id;
        }

        get type() {
            return this._type;
        }

        get position() {
            return this._position;
        }

        get rotation() {
            return this._rotation;
        }

        set rotation(val) {
            this._rotation = val;
            this.setDirty(true);

        }

        get scale() {
            return this._scale;
        }

        set scale(value) {
            this._scale.set(value);
            this._scaleTarget.copy(this._scale);
            this.setDirty(true);

        }

        set tint(val) {
            this._tint = val;
            this._tintTarget = this._tint;
            this.setDirty(true);

        }

        get tint() {
            return this._tint;
        }



        get bitmap() {
            return this._bitmap;
        }

        set bitmap(value) {
            if (value === null) value = $.LightBitmapGenerator.getLight("point")
            this._bitmap = value;

            this.setDirty(true);
        }

        get active() {
            return this._active;
        }



        set active(val) {
            this._active = val;
            this.setDirty(true);
        }


        get alpha() {
            return this._alpha;
        }

        set alpha(val) {
            this._alpha = val;
            this._alphaTarget = this._alpha;
        }

        get flicker() {
            return this._flicker
        }

        set flicker(value) {
            this._flicker = value;
            this.setDirty(value)
        }

        get offset() {
            return this._offset;
        }

        get flickerIntensity() {
            return this._flickerIntensity;
        }

        get persistent() {
            return this._persistent;
        }

        set persistent(val) {
            this._persistent = val;
        }



        constructor(id, x, y, data) {
            this._id = id;
            const radius = data.radius !== undefined ? data.radius : 100;
            this._type = data.type;
            this._persistent = data.persistent || false;
            this._position = new Point(x, y);
            this._rotation = 0;
            this._scale = new Point(radius, radius);
            this._tint = data.tint || 0xffffff;
            this._offset = new PIXI.Point();
            //this._spriteLight = null;
            this._bitmap = data.bitmap || $.LightBitmapGenerator.getLight("point")
            this._active = data.active !== undefined ? data.active : true;
            this._alpha = data.alpha || 1;
            this._growTime = 1.9;

            this._growDuration = 1/120;
            this._flicker = false;
            this._flickerIntensity = 1;

            this._tintTarget = this._tint;
            this._scaleTarget = this._scale.clone();
            this._alphaTarget = this._alpha;
            this.move(x, y);
            this.initData(data)
        }

        initData(data) {
            this.flicker = data.flicker || false;;
        }

        setDirty(value) {
            if (value) {
                    this._isDirty = true;
                    Anisoft.Nova.LightManager.addDirty(this);
            } else {
                this._isDirty = false;
                Anisoft.Nova.LightManager.removeDirty(this);

            }

        }


        move(x, y, d) {
            this.rotation = this.rotateToDirection(d);
            this.position.set(x, y);

            //$.LightManager.refreshGrid(this)

            this.refresh()
        }

        refresh() {
            if (Anisoft.Nova.lightMapContainer) {
                const spriteLight = Anisoft.Nova.lightMapContainer._objLights[this._id]

                if (spriteLight) spriteLight.refresh();
            }


        }

        rotateToDirection(d) {
            switch (d) {
                case 2:
                    return Math.PI*2;
                case 4:
                    return Math.PI/2;
                case 6:
                    return 3*Math.PI/2;
                case 8:
                    return Math.PI;
            }
        }


        resetGrow() {
            this._growTime = 0;
            this.setDirty(true);
        }

        update() {
            const time =this._growTime
            if (this._tint !== this._tintTarget) {
                this._tint =  $.lerpHexColor(this._tint, this._tintTarget, time)
            }

            if (!this._scale.equals(this._scaleTarget)) {
                this._scale.set(
                    $.lerp(this._scale.x, this._scaleTarget.x, time),
                    $.lerp(this._scale.y, this._scaleTarget.y, time)
                )
            }

            if (this._alpha !== this._alphaTarget) {
                this._alpha = $.lerp(this._alpha, this._alphaTarget, time);
            }

            if (this._growTime <= 1) {
                this._growTime+= this._growDuration;
            }

            this.updateFlicker()



            this.refresh()

            if (this._isDirty) {
                if (this.stopUpdate()) return this.setDirty(false)

            }

        }

        updateFlicker() {
            if (this._flicker) {
                const wait = Math.floor((Math.random()*8)+1);
                if (wait === 1) {
                    this._flickerIntensity = .9 + .1*Math.random();
                }
            }
        }

        stopUpdate() {
            if (this._flicker) return false;
            if (this._growTime >= 1)
                return true;
        }

        toJSON() {
            return {
                id: this._id,
                position: this._position,
                radius: this._scale.x,
                tint: this._tint,
                alpha: this._alpha,
                flicker: this._flicker,
                persistent: this._persistent,
                active: this._active,
                offset: this._offset
            }
        }
    }

    $.Game_Light = Game_Light;
})(Anisoft.Nova);

//=============================================================================
// ** Light Sprite Data
//=============================================================================



//-----------------------------------------------------------------------------
// LightmapFilter
(function ($) {

    const vertex = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        
        uniform mat3 projectionMatrix;
        
        varying vec2 vTextureCoord;
        
        void main(void)
        {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        
            vTextureCoord = aTextureCoord;
        }
    
    `;

    const fragment = `
        varying vec2 vTextureCoord;

        uniform sampler2D uSampler;

        uniform vec4 filterArea;
        uniform vec2 dimensions;
        uniform vec4 ambientColor;
        void main() {
            vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;
            vec4 light = texture2D(uSampler, lightCoord);
            vec3 ambient = ambientColor.rgb* ambientColor.a + (light.rgb* light.a);

            
            gl_FragColor = vec4(ambient, 1.);
        }
    `;


    class LightmapFilter extends PIXI.Filter {

        constructor(color = 0x000000, alpha = 1) {
            super(vertex, fragment);
            this.uniforms.dimensions = new Float32Array(2);
            this.uniforms.ambientColor = new Float32Array([0, 0, 0, alpha]);
            this.color = color;
        }

        apply(filterManager, input, output, clear) {
            this.uniforms.dimensions[0] = input.frameBuffer.width;
            this.uniforms.dimensions[1] = input.frameBuffer.height;

            // draw the filter...
            filterManager.applyFilter(this, input, output, clear);
        }



        set color(value) {
            const arr = this.uniforms.ambientColor;
            if (typeof value === 'number') {
                PIXI.utils.hex2rgb(value, arr);
                this._color = value;
            } else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                arr[3] = value[3];
                this._color = PIXI.utils.rgb2hex(arr);
            }
        }

        get color() {
            return this._color;
        }

        get alpha() {
            return this.uniforms.ambientColor[3];
        }

        set alpha(value) {
            this.uniforms.ambientColor[3] = value;
        }
    }

    $.LightmapFilter = LightmapFilter;
})(Anisoft.Nova);

//-----------------------------------------------------------------------------
// LightBitmapGenerator
($ => {
    class LightBitmapGenerator {
        constructor() {
            this._cache = {};

            this.createPointBitmap("point")
        }

        createPointBitmap(key, resolution = Anisoft.Nova.defaultBitmapResolution) {

            const bitmap = new Bitmap(resolution, resolution);
            bitmap.smooth = true;
            bitmap.resolution = resolution/2;
            const width = bitmap.width;
            const height = bitmap.height;
            const ctx = bitmap._context;
            const grd = ctx.createRadialGradient(width / 2, width / 2, 0, width / 2, height / 2, width / 2);
            grd.addColorStop(0, "white");

            grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
            bitmap._setDirty();
            bitmap.offsetY = height / 2;
            this._cache[key] = bitmap;
        }

        createConeBitmap(key, coneLength, coneWidth, resolution) {
            const radiusSize = 40;
            const offsetY = 3;

            const flashLength = coneLength;
            const flashwidth = (coneWidth / 512) * resolution;
            let height = 0;
            let radius = (radiusSize / 512) * resolution;
            const initRadius = radius;
            height += radius + offsetY*2;

            const distance = (6 / 512) * resolution;
            const grow = (3 / 512) * resolution;

            let r2 = 0;
            for (let cone = 0; cone < flashLength; ++cone) {
                r2 = cone * flashwidth;
                height = height + cone * distance;
            }


            const bitmap = new Bitmap((Math.max(radius, r2)) * 2, height + r2);
            bitmap.smooth = true;
            bitmap.resolution = resolution;
            radius = initRadius

            let x = bitmap.width / 2;
            let y = 0;
            y += radius + offsetY


            const ctx = bitmap._context;
            const grd = ctx.createRadialGradient(x, y, 1, x, y, radius);
            grd.addColorStop(0, "white");
            grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");
            ctx.fillStyle = grd;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);


            let r1 = 0;

            for (let cone = 0; cone < flashLength; ++cone) {
                // r2 = cone * flashWidth;
                r1 = 0//cone * grow;
                radius = cone * flashwidth;

                y = y + cone * distance;

                const grd = ctx.createRadialGradient(x, y, r1, x, y, radius);
                grd.addColorStop(0, "white");
                grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");

                ctx.fillStyle = grd;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }

            ctx.restore();
            ctx.globalCompositeOperation = 'source-over';

            bitmap._setDirty();
            bitmap.offsetY = initRadius + offsetY;

            return bitmap;
        }

        getLight(key) {
            return this._cache[key];
        }

        getConeLight(coneLength, coneWidth, resolution = Anisoft.Nova.defaultBitmapResolution) {
            const key = `flashlight_${coneLength}_${coneWidth}`;
            let bitmap = this._cache[key];
            if (!bitmap) {
                bitmap = this.createConeBitmap(key, coneLength, coneWidth, resolution)
                this._cache[key] = bitmap;
            }
            return bitmap;
        }
    }

    $.LightBitmapGenerator = new LightBitmapGenerator();


})(Anisoft.Nova);

//-----------------------------------------------------------------------------
// LightMapContainer
($ => {
    class LightMapContainer extends PIXI.Container {
        constructor() {
            super();
            this.initialize();
        }

        initialize() {
            this._lights = [];
            this._objLights = [];
            this.createWebGLContainer();
            this.createRenderTexture();
            this._mapContainer = new PIXI.Container();
            this.addChild( this._mapContainer)
            this.createShadowMap();
            this.createLightMap();

        }

        createLightContainer () {
            this._lightMapContainer = $.lightMapContainer =($.lightMapContainer ? $.lightMapContainer :  new LightMapContainer());
            $.lightMapContainer.reset();
            this.addChild(this._lightMapContainer);
        };

        createLights () {
            const lights = Anisoft.Nova.LightManager.currentMapLights();
            this._lightMapContainer.objLights = lights;
            for (let i = 0; i < lights.length; ++i) {
                const light = lights[i];
                this._lightMapContainer.createSpriteLight(light);
            }
        };

        createShadowMap () {

            this._lightMapFilter = new Anisoft.Nova.LightmapFilter(Anisoft.Nova.ambientLight);

            this._shadowMapSprite = new PIXI.Sprite($.LightMapRenderTexture)
            this._shadowMapSprite .width = Graphics.width;
            this._shadowMapSprite .height = Graphics.height;
            this._mapContainer.addChild(this._shadowMapSprite);

            this._shadowMapSprite .filters = [this._lightMapFilter];
            this._shadowMapSprite .filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
            this._shadowMapSprite .filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height)
        };
        createLightMap() {
            this._lightMapSprite = new PIXI.Sprite($.LightMapRenderTexture);
            this._lightMapSprite.blendMode = PIXI.BLEND_MODES.ADD;
            this._mapContainer.addChild(this._lightMapSprite)
        }


        createWebGLContainer() {

            const renderContainer = this._lightMapRenderContainer = new PIXI.Container();//new PIXI.particles.ParticleContainer(100000, {tint: true});
            this._lightMapRenderContainer.renderable = false;
            this.addChild(renderContainer);

            const lightFastContainer = this._lightFastContainer = new PIXI.particles.ParticleContainer(100000, {tint: true});
            this._lightMapRenderContainer.addChild(lightFastContainer);
            const lightContainer = this._lightContainer = new PIXI.Container();
            this._lightMapRenderContainer.addChild(lightContainer);
        }


        createRenderTexture() {
            if (!$.LightMapRenderTexture) {
                $.LightMapRenderTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height, 0, 1);
            }
        }


        render() {
             this._lightMapRenderContainer.x = -$gameMap.displayX() * $gameMap.tileWidth();
             this._lightMapRenderContainer.y = -$gameMap.displayY() * $gameMap.tileHeight();

            this._lightMapRenderContainer.renderable = true;
            Graphics._renderer.render(this._lightMapRenderContainer,$.LightMapRenderTexture, true, null);
            this._lightMapRenderContainer.renderable = false;

            //const value = $gameSwitches.getValue(wahtever);
            this._lightMapSprite.renderable =  !$.TerraxLighting;



        }

        createSpriteLight(light) {
            if (this._objLights[light.id]) return;

            const spriteLight = new Anisoft.Nova.Sprite_Light(light);
            spriteLight.blendMode = 3;

            this._objLights[light.id] = spriteLight;

            this._lights.push(spriteLight);
            this._lightContainer.addChild(spriteLight)
        }

        clear() {
            this._lightContainer.removeChildren()
            this._lights.length = 0;
            this._objLights = {}

        }

        reset() {
            this.clear();
        }
    }

    $.LightMapContainer = LightMapContainer;
})(Anisoft.Nova);

//-----------------------------------------------------------------------------
// Sprite_Light
($ => {
    class Sprite_Light extends PIXI.Sprite {
        constructor(data) {
            const bitmap = data.bitmap ? data.bitmap : $.LightBitmapGenerator.getLight("point");
            super(new PIXI.Texture(bitmap._baseTexture));
            this._bitmap = bitmap;
            this._data = data;
            this.refresh();
        }

        refresh() {
            const data = this._data;
            this.visible = data.active;
            this.alpha = ($.TerraxLighting && $.TerraxLightingAlphaOne ? 1 : data.alpha)*data.flickerIntensity;
            if (!this.visible || this.alpha <= 0) return;
            this.updateImage(data.bitmap);

            const position = data.position || new PIXI.Point(0, 0);
            this.position.set(
                position.x * $gameMap.tileWidth() + $gameMap.tileWidth() / 2,
                position.y * $gameMap.tileHeight() + $gameMap.tileHeight() / 2);


            this.anchor.set(0.5, this._bitmap.offsetY / this._texture.height);
            this.scale.set((data.scale.x / this._bitmap.resolution), (data.scale.y / this._bitmap.resolution));
            this.rotation = data.rotation;// || 0;
            this.tint = data.tint;
            this.pivot.copy(data.offset);
            //this.pivot.set(0,-10)
        }

        updateImage(bitmap) {
            if (bitmap !== this._bitmap) {

                this._bitmap = bitmap;
                if (bitmap) {
                    this._texture = new PIXI.Texture(bitmap._baseTexture);

                }
            }
        }


        render() {
        }

        update() {
            this.refresh();
        }
    }

    $.Sprite_Light = Sprite_Light;
})(Anisoft.Nova);


//-----------------------------------------------------------------------------
// Game_CharacterBase
($=> {
    $.moveLights = function() {
        if (!this._lights) return;
        for (let i = 0; i < this._lights.length; ++i) {
            const id = this._lights[i];
            const light = Anisoft.Nova.LightManager.getLight(id);
            if (!light) continue;
            light.move(this._realX, this._realY, this._direction);
        }
    };

    $.setupLights = function() {}

    $.refreshLights = function() {
        if (!this._lights) return;
        for (let i = 0; i < this._lights.length; ++i) {
            const id = this._lights[i];
            const light = Anisoft.Nova.LightManager.getLight(id);
            light.refresh();
        }
    }
    const Alias_setDirection = $.setDirection;
    $.setDirection = function(d) {
        Alias_setDirection.call(this, d);
        this.moveLights()
    }

})(Game_CharacterBase.prototype);

(function($) {
    const Alias_performTransfer = $.performTransfer
    $.performTransfer = function() {
        Alias_performTransfer.call(this);
        if ($gamePlayer.newMapId() !== $gameMap.mapId()) {
            console.log("reset?")
            Anisoft.Nova.LightManager.reset();

        }
    };
    const Alias_updateMove = $.updateMove;
    $.updateMove = function () {
        Alias_updateMove.call(this);
        if (this.isMoving())
            this.moveLights();
    };


    $.setupLights = function() {
        const light = Anisoft.Nova.LightManager.createLight(this, {
            radius: Anisoft.Nova.playerRadius,
            tint: 0xf07829,
        });
        light.persistent = true;
        this._lights = [light.id];

        this.moveLights();
    };

    const Alias_locate = $.locate;
    $.locate = function() {
        Alias_locate.call(this, ...arguments);
        this.moveLights();
    }

})(Game_Player.prototype);

//-----------------------------------------------------------------------------
// Game_Event
($ => {
    const Alias_initialize = $.initialize;
    $.initialize = function () {
        Alias_initialize.call(this,...arguments);
        this.setupLights();
    };

    $.getLightData = function() {
        if (Imported.YEP_EventCopier) {
            if (this._copiedEvent) {
                const event = Yanfly.EventCopier.event.call(this);
                if (event.lightData) return event.lightData;
            }
        }
        return this.event().lightData
    };

    $.setupLights = function () {
        this._lights = [];
        const lightData = this.getLightData();
        if (lightData) {
            for (let i = 0; i < lightData.length; ++i) {
                const data = lightData[i];
                const light = Anisoft.Nova.LightManager.createLight(this, data);
                this._lights.push(light.id);
            }
        }
        this.moveLights();
        this.refreshLights()
    };

    const Alias_updateMove = $.updateMove;
    $.updateMove = function () {
        Alias_updateMove.call(this);
        if (this.isMoving())
            this.moveLights();
    };


})(Game_Event.prototype);

//-----------------------------------------------------------------------------
// Game_Map
($ => {

    const Alias_setup = $.setup;
    $.setup = function (mapId) {
        $gamePlayer.setupLights();
        Alias_setup.call(this, mapId);
    };

    const Alias_update = $.update;
    $.update = function(sceneActive) {
        Alias_update.call(this, ...arguments);
        Anisoft.Nova.LightManager.update();
    };

})(Game_Map.prototype);

//-----------------------------------------------------------------------------
// Spriteset_Map
($ => {
    const Alias_createLowerLayer = $.createLowerLayer;
    $.createLowerLayer = function () {
        Alias_createLowerLayer.call(this);
        this.createLightContainer();
        this.createLights();

    };

    $.createLightContainer = function () {
        this._lightMapContainer = Anisoft.Nova.lightMapContainer =(Anisoft.Nova.lightMapContainer ? Anisoft.Nova.lightMapContainer :  new Anisoft.Nova.LightMapContainer());
        Anisoft.Nova.lightMapContainer.reset();
        this.addChild(this._lightMapContainer);
    };

    $.createLights = function () {
        const lights = Anisoft.Nova.LightManager.currentMapLights();
        this._lightMapContainer.objLights = lights;
        for (let i = 0; i < lights.length; ++i) {
            const light = lights[i];
            this._lightMapContainer.createSpriteLight(light);
        }
    };




    const Alias_update = $.update;
    $.update = function () {
        Alias_update.call(this);

       // this._lightMapContainer._lightMapRenderContainer.x = -$gameMap.displayX() * $gameMap.tileWidth();
       // this._lightMapContainer._lightMapRenderContainer.y = -$gameMap.displayY() * $gameMap.tileHeight();

       // this._lightMapContainer.x =$gameScreen._zoomX;
       // this._lightMapContainer.y =$gameScreen._zoomY;
       // this._lightMapSprite.scale.set( 1/$gameScreen._zoomScale);
        this.updateAmbientLight();
    };

    $.updateAmbientLight = function() {
        let ambientLight = Anisoft.Nova.ambientLight;
        let ambientTarget = Anisoft.Nova.ambientLightTarget;
        let time = Anisoft.Nova.ambientLightTime;
        if (time <= 1) {
            time += Anisoft.Nova.ambientLightDuration;
            Anisoft.Nova.ambientLightTime = time;
            const color = Anisoft.Nova.lerpHexColor(ambientLight, ambientTarget, time)
            this._lightMapContainer._lightMapFilter.color = color;
        } else {
            Anisoft.Nova.ambientLight = ambientTarget;
        }
    }

})(Spriteset_Map.prototype);

//-----------------------------------------------------------------------------
// Sprite_Character
($ => {
    const Alias_initialize = $.initialize;
    $.initialize = function (character) {
        Alias_initialize.call(this, character);
        this.shadowBlocker = character.constructor === Game_Player || character.constructor === Game_Follower;
    };

    Object.defineProperties($, {
        shadowBlocker: {
            set: function (value) {
                this._shadowBlocker = value;
            },
            get: function () {
                return this._shadowBlocker
            }
        }
    });
})(Sprite_Character.prototype);

//-----------------------------------------------------------------------------
// Graphics
($ => {
    const Alias_render = $.render;
    $.render = function (stage) {
        Alias_render.call(this, stage);
        if (this._skipCount === 0) {
             if (Anisoft.Nova.lightMapContainer)
                 Anisoft.Nova.lightMapContainer.render();
        }

    }
})(Graphics);




//-----------------------------------------------------------------------------
// Scene_Map
($=> {
    const Alias_createDisplayObjects = $.createDisplayObjects;
    $.createDisplayObjects = function() {
        const events = $gameMap.events();
        $gamePlayer.setupLights();
        for (let i = 0; i < events.length; ++i) {
            events[i].setupLights();
        }
        Alias_createDisplayObjects.call(this);
    };

/*

    const Alias_createSpriteset = $.createSpriteset;
    $.createSpriteset = function() {
        Alias_createSpriteset.call(this);
        //this.addChild(this._spriteset._weather._weatherContainer2Wrapper)
        this.addChild(this._spriteset._pictureContainer);
    };
*/

    const Alias_update = $.update;
    $.update = function() {
        Alias_update.call(this);
    }

})(Scene_Map.prototype);
