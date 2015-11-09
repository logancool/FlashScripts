/*
Purpose of this script is to add a layer to the timeline of each file
and add the appropriate component to the code based file.

*/

var LAYER_NAME = "AdSetup";

//Don't touch these unless you rename the file in the directory itself as well
var DOC_CLASS = "Document_Class_FT";
var SWC = "FT_COMPONENTS";

//var COMP_FILE=fl.documents[0]; //components are located in the first open file after the jsfl

/*
Returns the path without the filename (after the last slash)
*/
function removeFileName(path){
	var filename = /[^\/]*$/;
	path = path.replace(filename, '');
	return path;
}

/*
Adds a new Layer to the @param timeline below the currently open one
*/
function addLayerToDoc(layer_name, timeline){
	var layer = timeline.addNewLayer(layer_name, "normal", false);
	return layer;
}


/*
Gives the file to the user that there is no Document Class
*/
function addCustomTitle(doc){
	var title = '<dialog title="No Document Class Found" buttons="accept, cancel">'
	return String(title);
}

/*
Returns the customized label including the postfix to the dialog
*/
function addCustomLabel(doc){
	var label = '<label value="There is no Document Class in: \
	' + doc.name + '. A new one will be created in it\'s directory."/>';
	
	return String(label);
}

/*
Makes a temp XML file to display the dynamic XML dialog box
*/

function showXMLPanel(xmlString){
  var tempUrl = fl.configURI + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}

/*
Asks the user which FT component you want to import to the open files.
*/
function docExistsDialogXML(doc){
	// create an XUL with JSFL
	var dialogXML = "";
	dialogXML += 	addCustomTitle(doc);
	dialogXML += 	'<vbox>';
    dialogXML += 		addCustomLabel(doc);
    dialogXML += 		'<label control="chooseLablel" value="Choose a component to add: "/>  ';
	dialogXML += 		'<radiogroup id="compChoice"> ' ;
	dialogXML += 			'<radio selected="true" label="AdSetup"/>  ';
	dialogXML += 			'<radio label="Other..."/>  ';
	dialogXML += 		'</radiogroup> ' ;
    dialogXML += 	'</vbox>';
	dialogXML += '</dialog>';
	
	var xmlPanelOutput = showXMLPanel(dialogXML);
	return xmlPanelOutput;
}


/*
Copy the Default FT Document Class to the place where the open files are located
prefereabley the same directory as the FLA
*/
function copyDC(doc){
	curDCPath = removeFileName(fl.scriptURI) + DOC_CLASS + ".as";
	newDCPath = removeFileName(doc.pathURI)  + DOC_CLASS + ".as";
	fl.trace("copying docClassPath: " + curDCPath);
	fl.trace("to: " + newDCPath);
	FLfile.copy(curDCPath, newDCPath );
}

function copySWC(doc){
	curSWC = removeFileName(fl.scriptURI) + SWC + ".swc";
	newSWC = removeFileName(doc.pathURI)  + SWC + ".swc";
	fl.trace("copying curSWC: " + curSWC);
	fl.trace("to: " + newSWC);
	FLfile.copy(curSWC, newSWC);
}
/*
Adds the SWC to the library
*/
function addSWC(doc){
	doc.externalLibraryPath = removeFileName(doc.pathURI)  + SWC + ".swc";
}
/*
Checks the users decision on if to overwrite and calls the appropriate action
CALLED in the saveNewPostFix function
*/
function clickedOk(xmlPanelOutput){
	//if the user clicks OK 
	if (xmlPanelOutput.dismiss == "accept") // user chooses to overwrite
	{
		return true;
	}

	//the user clicked Cancel
	else if (xmlPanelOutput.dismiss == "cancel"){ // user chooses to save
		return false;
	}
}

/*
Add the Document Class which contains the selected component
*/
function createDocClass(doc, dialog){
	if (dialog.compChoice == "AdSetup"){
		//copy the template doc class to the directory of the doc
		copyDC(doc);
		
		//copy the swc with the components to the fiel
		copySWC(doc);
		
		//tell flash you have created the document class
		doc.docClass = DOC_CLASS;
		
		//add the swc
		addSWC(doc);
		
		//doc.save();
	}
	else {
		fl.trace("Other...");
	}
}

/*
Sorts through the open documents and injects the FT components to the 
current document class, or makes one if one already exists.
*/
function importFTComponents() {
	
	//loops through each open documents
	var docs=fl.documents;
    var docs_length=docs.length;

	//In each doc
    for (var i=0; i<docs_length; i++) {
		doc = docs[i];
		
		//if their is no assigned document class
		if (doc.docClass.length == 0){
			//add a dialog box that asks which components to add
			dialog = docExistsDialogXML(doc);
			
			//if they clicked ok
			if (clickedOk(dialog)){
				createDocClass(doc, dialog);
			}
			else{
				fl.trace("User Cancelled...");
			}
		}
	}
}

fl.outputPanel.clear();
importFTComponents();


/*
---UNUSED----

//Locates the ADD_COMPONENT in the COMP_FILE and returns it

function findComponentToAdd(){
	for (var n=0; n<COMP_FILE.library.items.length; n++) {
		if (COMP_FILE.library.items[n].name == ADD_COMPONENT){
			return COMP_FILE.library.items[n];
			 
		}
	}
}

*/

