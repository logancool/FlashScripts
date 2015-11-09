/*

The purpose of this script is to publish all of the currently opened tabs 
with the user-defined REPLACE_VERSION of flash. The script will publish 
seperate FLA's which including the user-defined APPEND_POSTFIX in the 
filename. 

@author: Logan Cool
@date: June 09/2015
@last modified: June 10/2015


NOTE: By default this script will overwrite and publish all files opened
with the user defined postfix.

*/


APPEND_POSTFIX = "_ft";
REPLACE_VERSION = "11.2";
VERSION_ID = "15";
PUBLISH_SETTINGS = "PublishSettings";


//-----DEFAULTS-------

//global flag for dialog choice
OVERWRITE_ALL = false;

/*
Removes @param filename's extension after . for renaming purposes
*/
function removeExtension(filename){
    var lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}

/*
Removes a publish settings file in the directory if it is named 
PublishSettings.xml. If this file is removed, the function will
return true.*/
function removePublishXML(doc){
	var pubSetPath = removeFileName(doc.pathURI) + PUBLISH_SETTINGS + ".xml";
	if(fl.fileExists(pubSetPath)){
		FLfile.remove(pubSetPath);
		fl.trace(PUBLISH_SETTINGS + " file was removed...");
	}	
}

/*
Returns the path without the filename (after the last slash)
*/
function getFileName(path){
	var filename = /[^\/]*$/;
	filename = path.match(filename);
	return filename;
}

/*
Returns the path without the filename (after the last slash)
*/
function removeFileName(path){
	var filename = /[^\/]*$/;
	path = path.replace(filename, '');
	return path;
}

/*
Makes a temp XML file to display the dynamic XML dialog box
*/

function displayXML(xmlString){
  var tempUrl = fl.configURI + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}

/*
Returns the customized label including the postfix to the dialog
*/
function saveLabel(){
	var label = '<label value="The titled file already has this postfix: ' + APPEND_POSTFIX + '"/>';
	return String(label);
}

/*
Gives the file to the user that is contains the postfix
*/
function saveTitle(postfixFName){
	var title = '<dialog title="' + postfixFName +'" buttons="accept, cancel">';
	return String(title);
}

/*
The meat of the dialog - contains the xml definitions for buttons and choices
@returns the dialog information
*/
function saveXML(postfixFName){
	// create an XUL with JSFL
	var dialogXML = "";
	dialogXML += 	saveTitle(postfixFName);
	dialogXML += 	'<vbox>';
    dialogXML += 		saveLabel();
    dialogXML += 		'<label control="chooseLabel" value="Choose a save option"/>  ';
    dialogXML += 		'<radiogroup id="saveChoice"> ' ;
	dialogXML += 			'<radio selected="true" label="Overwrite"/>  ';
	dialogXML += 			'<radio label="Overwrite ALL detections"/>  ';
	dialogXML += 			'<radio label="Save As.."/>';
	dialogXML += 		'</radiogroup> ' ;
    dialogXML += 	'</vbox>';
	dialogXML += '</dialog>';
	
	var xmlPanelOutput = displayXML(dialogXML);
	return xmlPanelOutput;
}

/*
Simply returns the string to display to initial dialog box
*/
function initialTitle(){
	var title = '<dialog title="' + "Welcome PublishAll User" +'" buttons="accept, cancel">';
	return String(title);
}
/*
Returns the Label telling the user to choose a postfix
*/
function initialLabel(){
	var label = '<label value="This script will append a suffix on to each\
	open document that you provide. It will then save use this copy to save and\
	pubish with, this way the original file doesn\'t get touched. If you are working\
	with the original file, and the file with the suffix already exists in your directory\
	you will be prompted to overwrite or rename. If you are in the suffix file, no new file\
	will be created. " width="500" align="center"/>';
	return String(label);
}

/*
This is the xml for the initial dialog that asks the user what posfix they
want along with version to publish with
@returns the dialog information
*/
function initialXML(){

	var dialogXML = "";
	dialogXML += 	initialTitle();
	dialogXML += 	'<vbox>';
    dialogXML += 		initialLabel();
    dialogXML += 		'<label control="choosePostfix" value="Choose a suffix to append:"/>  ';
    dialogXML += 		'<textbox id="postfix" value="_ft" width="50"/> ' ;
    dialogXML += 	'</vbox>';
	dialogXML += '</dialog>';
	
	var xmlPanelOutput = displayXML(dialogXML);
	return xmlPanelOutput;
}


/*
Replaces XML strings with containing @param string with @param newVers
*/
function replaceString(string, newVers, profileXML){
	//replace with newVers in the profileXML
	var stringS = "<" + string + ">";
	var stringE = "</" + string + ">";
	var startIndex = profileXML.indexOf(stringS) + stringS.length;
	var endIndex = profileXML.indexOf(stringE);
	var curVers = profileXML.substring(startIndex, endIndex);
	profileXML = profileXML.replace(curVers, newVers);
	
	return profileXML;
}

/*
Replaces the current default FLA version to the users defined version
*/
function replaceVersion(profileXML){
	
	//Replace External Player
	profileXML = replaceString("ExternalPlayer", "FlashPlayer" + REPLACE_VERSION, profileXML);
	
	//Replace Version
	profileXML = replaceString("Version", VERSION_ID, profileXML);
	
	return profileXML;
}

/*
Checks the users decision on if to overwrite and calls the appropriate action
CALLED in the saveNewPostFix function
*/
function shouldOverwrite(xmlPanelOutput){
	//if the user clicks OK 
	if (xmlPanelOutput.dismiss == "accept") // user chooses to overwrite
	{
		//what button the user chose
		if (xmlPanelOutput.saveChoice == "Overwrite"){
			
		    //tell the save controller to overwrite this single file
			return "single";
		}
		else if (xmlPanelOutput.saveChoice == "Overwrite ALL detections"){
			//tell the save controller to overwrite all the files
			return "all";
		}
		else {
			return "saveAs";
		}
	}
	//the user clicked Cancel
	else if (xmlPanelOutput.dismiss == "cancel"){ // user chooses to save
		throw new Error("You have quit the Publish All script");
	}
}

/*
Helper for containsPostFix by checking the postfix extensions
*/
function containsPostExt(path, ext){
	return (path.indexOf(String(APPEND_POSTFIX + ext)) != -1);
}

/*
Checks if @param APPEND_POSTFIX is in the current FLA
returns true if it is
*/
function containsPostFix(docPath){
	//if "postfix.fla or postfix.xfl" in the path return true
	var containsPost = (containsPostExt(docPath, ".xfl") || containsPostExt(docPath, ".fla"));
	return containsPost;
}

/*
Calls the defined XML text and displays the user the 
dialog at runtime
*/
function displaySaveDialog(docPath){
	//find the filename that already exists
	var postfixFName = getFileName(docPath);
			
	//get the dialog window
	var dialog = saveXML(postfixFName);
	return dialog;
}

/*
Called when the user has chosen to overwrite the new postfix
files
*/
function overwrite(doc,docPath){
	
	//keep the location of the old FLA
	oldPath = String(doc.pathURI);
	
	//save the new postfix FLA
	fl.saveDocument(doc, docPath);
	fl.trace("Saved..." + doc.name);
}

/*
Checks if the APPEND_POSTFIX already exists, if it does the user 
is promted with the option to overwrite. If not, the function will
create a new document with the APPEND_POSTFIX postfix.
@ returns the new document to be published
*/
function saveNewPostFix(doc, docPath){
	//postfix file exists

	//if the user has already chosen to overwrite all
	//only display once if this is the case!
	if (OVERWRITE_ALL == true){
		//just overwrite the file
		overwrite(doc,docPath);
	}
	// this is the first case
	else {
		if (fl.fileExists(docPath) == true){
			var dialog = displaySaveDialog(docPath);
			//make an updated _ft version of the FLA 
			
			// SINGLE OVEWRITE
			// if dialog choice was to overwrite OR overwrite all was chosen in the past
			if (shouldOverwrite(dialog) == "single"){
				
				//overwrite the new postfix
				overwrite(doc,docPath);
				
				//UNCOMMENT if you want to open back up the FLA without the postfix
				//fl.openDocument("file://" + oldPath);
			}
			// if user chooses overwrite ALL
			else if(shouldOverwrite(dialog) == "all"){
				//set the flag to access the SINGLE OVERWRITE loop
				fl.trace("Overwriting all postfix files...");
				//set to avoid multiple dialogs
				OVERWRITE_ALL = true;
				
				//save the new postfix as if the user selected overwrite
				overwrite(doc,docPath);
				
			}
			//user chose to save as..
			else{
				fl.saveDocumentAs(true);
				fl.trace("User Saved...");
			}
		}
		else{
			//save a new copy with added POSTFIX
			doc.saveAsCopy(docPath);
			
			//close the non-postfix document
			fl.saveDocument(doc);
			fl.closeDocument(doc);
			
			//open the new postfix document
			fl.openDocument(docPath);
			fl.trace("New file Saved..." + getFileName(docPath));
		}
	}
	return doc;
}

/*
Overwrites the postfix document as it already exists.
@returns the document to be published
*/
function saveSamePostFix(doc, docPath){
	fl.saveDocument(doc, docPath);
	fl.trace("Saved..." + doc.name);
	return doc;
}


/* 
Gets the APPEND_POSTFIX from the user using a dialog box and
version to publish
*/
function initial_setup(){
	var panel = initialXML();
	//set the users postfix
	APPEND_POSTFIX = panel.postfix;
	if (panel.dismiss == "accept"){
		return true;
	}
	else {
		return false;
	}
}

/*
Looks at each FLA currently open in Flash and calls the
apporiate methods to publish it using the @param REPLACE_VERSION number
*/

function publish_documents(){ 
    var docs=fl.documents;
    var docs_length=docs.length;
	
	//In each FLA
    for (var i=0; i<docs_length; i++) {
		
		//doc is now the current FLA
        var doc=docs[i];
		
		//remove any previous publish settings if they exist
		removePublishXML(doc, docs_length);

		//the current FLA's path including its name
		var docPath = removeExtension(doc.pathURI);
		
		//load the default profile as variable profileXML
		var profileXML = doc.exportPublishProfileString('Default'); 
		
		//update it with the new user-defined version
		profileXML = replaceVersion(profileXML);
		
		//put this back into the FLA
		doc.importPublishProfileString(profileXML); 
		doc.currentPublishProfile = profileXML;
		
		//save the current document
		//doc.save(true);
		
		//does the current document have a postfix already?
		if (containsPostFix(doc.pathURI) == true){
			//send the current FLA with the full file path
			var postDoc = saveSamePostFix(doc, docPath + ".fla");
		}
		//no postfix on the current FLA
		else{
			//save the updated FLA with the appended document path
			var postDoc = saveNewPostFix(doc, docPath + APPEND_POSTFIX + ".fla");
		}
		
		//publish the new postFixed document
        postDoc.publish();
		fl.trace("Published..." + postDoc.name);
    }
}

//clear the console for error reporting
fl.outputPanel.clear();

//make sure there is at lease one file 
if (fl.documents.length > 0){
	//grab the append postfix and value to publish
	if (initial_setup()){
		//begin publishing
		publish_documents();
	}
}