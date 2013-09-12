/**
 * For years Photoshop has been notoriously known for missing an option to use 
 * pixels when recording a resize action in which a resize was actually performed 
 * by explicitelly entering a size in pixels. This script aims to help with exactly
 * that problem by offering a number of ways to perform quick layer resizes in pixels.
 *
 * It supports user interactive mode in which during every execution the user is 
 * presented with an option to change values which were set by default. User 
 * interactive mode is activated and deactivated with the `promptUser` variable.
 * The meat of the script is however the `resizeToBounds` function which can be 
 * used separately. Care must be taken in this case that the arguments passed to the 
 * function MUST(!) adhere to the requested data types.
 *
 * Additionally the script is capable of performing resizes with constrained proportions
 * which means that the resized layer will always fit into the given width and height
 * while keeping the aspect ratio of the original layer. If one of the dimesnions is 
 * missing constrained proportions will be automatically activated and resizing will 
 * be performed by using scaling based on the existing dimension. 
 *
 * Most of the code should be self explanatory with comments explaining every step during
 * the script execution. The script has been tested with `Adobe Photoshop CS6` (both 32-bit 
 * and 64-bit versions) but if something breaks... Well... Blame the quaggans xD
 *
 */

#target photoshop

/**
 * Should the user be prompted to enter resize parameters?
 * @type {Boolean}
 */
var promptUser = false;

/**
 * Default resize width (null to disable).
 * @type {Number}
 */
var defWidth = 80;

/**
 * Default resize height (null to disable).
 * @type {Number}
 */
var defHeight = 80;

/**
 * Constrain proportions (keep aspect ratio)?
 * @type {Boolean}
 */
var defConstrain = true;

/**
 * Target width.
 * @type {Number}
 */
var width;

/**
 * Target height.
 * @type {Number}
 */
var height;

/**
 * Constrain proportions?
 * @type {Boolean}
 */
var constrain;

/**
 * Ruler unit type used before executing this script.
 * @type {Number}
 */
var rulerUnits;

/**
 * Resizes the currently active layer.
 * @param  {Number} width Resize width (bounding box).
 * @param  {Number} height Resize height (bounding box).
 * @param  {Number} constrain Constrain proportions (keep aspect ratio)?
 */
function resizeToBounds(width, height, constrain){
    /**
     * Active layer bounds.
     * @param {UnitValue} layerBounds
     */
    var layerBounds;
    
    /**
     * Active layer width.
     * @type {Number}
     */
    var layerWidth;
    
    /**
     * Active layer height.
     * @type {Number}
     */
    var layerHeight;

	/**
	 * Width resizing scale (if given).
	 * @type {Number}
	 */
    var scaleWidth;

    /**
     * Height resizing scale (if given).
     * @type {Number}
     */
    var scaleHeight;

    /**
     * Mutual scale used if proportions should be constrained.
     * @type {Number}
     */
    var scale;

    /**
     * New layer width expressed in percentages compared to the initial width (Photoshop loooooves percentages :'()
     * @type {Number}
     */
    var newWidth;

    /**
     * New layer height expressed in percentages compared to the initial height (did I mention that Photoshop loooooves percentages?)
     * @type {Number}
     */
    var newHeight;

	layerBounds = activeDocument.activeLayer.bounds;
	layerWidth = layerBounds[2].value - layerBounds[0].value;
	layerHeight = layerBounds[3].value - layerBounds[1].value;

	// Resizing scales... At least those which we can calculate...
	if(width){
		scaleWidth = width / layerWidth;
	}
	if(height){
		scaleHeight = height / layerHeight;
	}

	if(constrain){
		// Aspect ratio should be kept during resize (using a mutual scale) and still fit into the target bounding box.
		if(!width || !height){
			// At least one of the target dimensions is missing, using the available one for scale.
			if(!width){
				scale = scaleHeight;
			} else {
				scale = scaleWidth;
			}
		} else {
			// Both dimensions are available.
			if(scaleWidth >= scaleHeight){
				scale = scaleHeight;
			} else {
				scale = scaleWidth;
			}
		}
		newWidth = scale * 100;
		newHeight = scale * 100;
	} else {
		// No aspect ratio constrains set - resizing by width and height (both values are percentages!).		
		newWidth = scaleWidth * 100;
		newHeight = scaleHeight * 100;
	}
	
	// Performing the resize.
	activeDocument.activeLayer.resize(newWidth, newHeight, AnchorPosition.MIDDLECENTER);	
}

try { 
    // Buckle your seatbelt Dorothy, 'cause Kansas is going bye-bye!
    if(!documents.length){
    	throw "Hm... It seems you have no documents opened in Photoshop.\n\nOpen or create one and then we can talk again...";
    }
    // Resize is possible only on non-background layers.
	if(activeDocument.activeLayer.isBackgroundLayer){
		throw "Resize is possible only for non-background layers!\n\nYou sure you picked a non-background layer before executing this script?";
	}

	rulerUnits = preferences.rulerUnits; // Backing up current document ruler units cause we want to make Quaggan happy... Coooooo...
	preferences.rulerUnits = Units.PIXELS; // Setting document units to pixels.

	if(promptUser){
		// Hey user please enter some parameters for us...
		width = prompt("Enter target WIDTH in pixels [number]\n(if left out target width will be determined by height and constrained proportions set to true)", (defWidth === null) ? '' : defWidth);
		if(isNaN(parseInt(width)) && width !== '') {
			throw "WIDTH needs to be a number or left EMPTY!";
		}
		
		height = prompt("Enter HEIGHT in pixels [number]\n(if left out target width will be determined by width and constrained proportions set to true)", (defHeight === null) ? '' : defHeight);
		if(isNaN(parseInt(height)) && height !== ''){
			throw "HEIGHT needs to be a number or left EMPTY!";
		}

		// At least one of the values (width, height) needs to be given.
		if(isNaN(parseInt(width, 10)) && isNaN(parseInt(height, 10))){
			throw "At least one of the values (WIDTH or HEIGHT) is required!";
		}
		
		// If either width or height are left out constrain proportions is turned on automatically.
		if(isNaN(parseInt(width, 10)) || isNaN(parseInt(height, 10))){
			constrain = "true";
		} else {
			constrain = prompt("CONSTRAIN PROPORTIONS [true/false]\n(if false proportions will not be constrained)", defConstrain);
		}
		// If entering constrain parameter gets aborted script execution MUST stop (that is if you don't want to cause a nuke launch somewhere in Middle East xD)
		if(constrain == null){
			throw "Setting up CONSTRAINT PROPORTIONS was aborted - unable to proceed!";
		}
	} else {
		// No user input requested - using default values.
		width = (defWidth === null) ? '' : defWidth;
		height = (defHeight === null) ? '' : defHeight;
		constrain = defConstrain.toString();
	}

	// Constrain proportions needs to be either 'true' or 'false'.
	if(constrain.toLowerCase() !== 'true' && constrain.toLowerCase() !== 'false'){
		throw "CONSTRAIN PROPORTIONS needs to be either TRUE or FALSE (case insensitive)!";
	} else {
		// Making sure constrain evaluetes as Boolean from here.
		switch(constrain.toLowerCase()){
			case "true" :
				constrain = true;
				break;
			case "false" :
				constrain = false;
			default :
				constrain = defConstrain;
		}
	}
	
	resizeToBounds(width, height, constrain);
} catch (error) {
    // The bad news is something bad has happened... The good news is it was expected to happen... Quaggan sad :(
    alert(error);
} finally {
	// No matter what happens ruler units need to be reset after the script execution has ended.
	preferences.rulerUnits = rulerUnits;
}
