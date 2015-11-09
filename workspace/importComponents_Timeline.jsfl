/*
Purpose of this script is to add a layer to the timeline of each file
and add the appropriate component to it.

*/

var LAYER_NAME = "AdSetup";
var ADD_COMPONENT = "_ftComponents/AdSetup";
var COMP_FILE=fl.documents[0]; //components are located in the first open file after the jsfl

/*
Returns the path without the filename (after the last slash)
*/
function removeFilename(path){
	var filename = /[^\/]*$/;
	path = path.replace(filename, '');
	return path;
}

/*
Locates the ADD_COMPONENT in the COMP_FILE and returns it
*/
function findComponentToAdd(){
	for (var n=0; n<COMP_FILE.library.items.length; n++) {
		if (COMP_FILE.library.items[n].name == ADD_COMPONENT){
			return COMP_FILE.library.items[n];
			 
		}
	}
}

function addLayerToDoc(layer_name, timeline){
	var layer = timeline.addNewLayer(layer_name, "normal", false);
	return layer;
}

function importFTComponents() {
	
	var docs=fl.documents;
    var docs_length=docs.length;

	//In each FLA
    for (var i=0; i<docs_length; i++) {
		doc = docs[i];
		
		//don't touch the componenet file
		if (doc != COMP_FILE){
		
			fl.trace("FLA: " + doc.name);
			
			//grab the timeline of the document
			timeline = doc.getTimeline();
			
			//add a new layer for the adSetup componenet to the doc timeline
			//TODO: check if the layer already exists
			layer = addLayerToDoc(LAYER_NAME, timeline);
			//fl.trace("layer: " + layer);
			
			
			//find componenet to add to stage
			//comp = findComponentToAdd();
			compPath = removeFilename(fl.scriptURI) + "FT_COMPONENTS.swc"
			fl.trace("Component is at: " + compPath);
			
			doc.importFile(compPath,true);
			//.library.moveToFolder("mc", comp, true);
			//fl.trace("FOUND: " + COMP_FILE.library.items[n]);
			
			//doc2.library.addItemToDocument({x:0, y:0}, "_ftComponents", "AdSetup");
		}
	}
}

fl.outputPanel.clear();
importFTComponents();