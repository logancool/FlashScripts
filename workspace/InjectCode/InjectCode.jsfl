/*

The purpose of this script is to automatically add the FT components to
 each of the open files using code blocks. If the there is no document
 class, create one in each file's directory. If the componenet code
 blocks have already been added, or the script cannot find where to add
 the code blocks, it will return an error.


@author: Logan Cool
@date: June 19/2015
@last modified: June 26/2015


NOTE: By default this script will look for the documents included with it in the same
directory, if you move or rename the DC or Components SWF, the script will not be able 
to find them.

*/

/*----INITALS----*/

DEFAULT_DC = "Document_Class_FT"; //This is the document included in the script directory
PACKAGE_NAME = ""; //include if their is a package name in the current document class
ADSETUP = 0;
LOCATE = 0; // index for the component array
CODE = 1; // indext for the component array
PANEL = "";

//BLOCKS
//I: Import primative
I_Component = "\n\n\t\/\/Import the flashtalking FTEvents class so we can listen for the events\n\
	import com.flashtalking.events.FTEvent; \n\
	import com.flashtalking.buttons.*; \n\
	import com.flashtalking.*; \
	\n\
";

/*
If program has curly braces on the next line
*/
function init_NL(){
	//add weird spacing
	NLText = FLfile.read(removeFileName(fl.scriptURI) + "newLine.txt");
	NL = NLText.charAt(2);
	NLTab = NLText.substring(2,4);
	NL2Tab = NLTab + NLText.charAt(3);
	VOID = "()";//"():void";
}
/*
These are dynamically allocated which is why they are called in a function
*/
function init_FindBlocks(className){
	
	//F: Find primative																		
	F_PACKAGE = "package" + PACKAGE_NAME + NL + "{";
	F_CLASS_TITLE = "public class " + className + " extends MovieClip" + NLTab + "{";
	F_CONSTRUCT = "public function " + className + VOID + NL2Tab + "{";
}
//--------------------------------ADSETUP CODEBLOCK---------------------------------------------------//

//CB: Code Block component primative
CB_adSetup_Var = "\n\n\t\t\/\/ADD COMPONENT CLASS \n\
\t\tpublic var myFT:FT = new FT();\n\
\t\tprivate var myClickTag:FTClickTagButton = new FTClickTagButton();\n";
CB_adSetup_Child = "\n\t\t\t\/\/ Add the ad setup component to the stage next,\n\t\t\t\
\/\/ this will also determine the layer order of the automatic clickthrough.\n\t\t\t\
addChild(myFT);//FT added \n\n";			
CB_adSetup_Funct = "addClick(myFT); // FT added";

//CBF: Code Block Function component primative
CBF_adSetup_addClickTag = "\n\n\t\t\
private function addClickTag(myFT)" + "\n" + "\t\t{ \n \t\t\t\
myClickTag.width = 300; \n\t\t\t\
myClickTag.height = 250; \n\t\t\t\
addChild(myClickTag);\n\
						\n\
\t\t\t/\/ We just put the clickTag in the layer above the richload placeholder so it is not obscured. \n\
\t\t\tsetChildIndex(myClickTag,MovieClip(root).numChildren-1);\n\t\t\
}\n\n";

/*
Associations between where to look and what codeblock to add
*/
function C_ADSETUP(){
	var component = new Array();
				  // LOCATE  [i]   |	
				  //              \|/   i should match up with j (i==j)
				  // PUT     [j]         
	var LOCATE = [F_PACKAGE,   F_CONSTRUCT, 	 F_CLASS_TITLE,			  F_CLASS_TITLE];
	var CODE =   [I_Component, CB_adSetup_Child, CBF_adSetup_addClickTag, CB_adSetup_Var];
	component[ADSETUP] = [LOCATE, CODE];
	return component[ADSETUP];
}
//--------------------------------END ADSETUP BLOCK---------------------------------------------------//

//*****INSERT CODEBLOCKS HERE*****//

//-----DIALOG CODE----//

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
Returns the document list
*/
function printDCList(docString,i){
	return docString + '<textbox class="control" width="150" id="docClassList'+ i + '"  value="' + getDC(fl.documents[i]) +'"/>' + '<separator></separator>';
}

/*
Returns the document list
*/
function printDList(docString,i){
	return docString + '<label class="control" width="320" value="' + fl.documents[i].name + '"/>' + '<separator></separator>';
}

/*
lists the documents in an organized fashion
@returns as a string
*/
function printList(whichList){
	var docString = "";
	for (i = 0; i < fl.documents.length; i++){
		if (whichList == "DLIST"){
			docString = printDList(docString,i);
		}
		else{
			docString = printDCList(docString,i);	
		}	
	}
	return docString;
}

/*
Simply returns the string to display to initial dialog box
*/
function initialTitle(){
	var title = '<dialog title="' + "Welcome to the Injection Round..." +'" buttons="accept, cancel">';
	return String(title);
}
/*
Returns the Label telling the user to choose a postfix
*/
function initialLabel(){
	var label = '<label value="This script will inject codeblocks for the following units:"\
	width="320"/>';
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
	dialogXML += 	'<vbox class="control">';
	dialogXML +=		'<grid>';
	dialogXML +=			'<columns>';
	dialogXML +=				'<column flex="1"/>';
	dialogXML +=				'<column flex="2"/>';
	dialogXML +=			'</columns>';
	dialogXML +=				'<rows>';
	dialogXML +=						'<row>';
	dialogXML += 							initialLabel();
	dialogXML += 							'<label control="name" value="Please enter the document class name exactly, if it\'s not already listed. If you don\'t have one, just leave this as it is:" width="250" />  ';
	dialogXML +=						'</row>';
	dialogXML +=						'<row>';
	dialogXML +=   								'<vbox>';
	dialogXML +=								printList("DLIST");
	dialogXML +=   								'</vbox>';
	dialogXML +=   								'<vbox>';
	dialogXML +=								printList("DCLIST");
	dialogXML +=   								'</vbox>';
	dialogXML +=						'</row>';
	dialogXML +=				'</rows>';
	dialogXML +=		'</grid>';
    dialogXML += 	'</vbox>';
	dialogXML += '</dialog>';
	
	var xmlPanelOutput = displayXML(dialogXML);
	return xmlPanelOutput;
}

//-----DIALOG CODE----//

function blockNotFound(start, position){
	if (position == -1){
		alert("NOTE: " + start + " was not found..therefore the corresponding codeblock was not added");
		return true;
	}
	else {
		return false;
	}
	
}

function addBlockAt(start, addString, file){
	//get the start index position
	var position = file.indexOf(String(start));
	
	if (blockNotFound(start, position)){
		//don't add anything
		return file;
	}
	//the addString block will be added
	else{ 
		position = position + start.length + 1; 
		file = [file.slice(0, position), addString, file.slice(position)].join('');
		return file;
	}
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
Grabs the document class for each of the documents
*/
function getDC(doc){
	if (doc.docClass != ""){
		return doc.docClass;
	}
	else {
		//if their is no document class use the default
		return DEFAULT_DC;
	}
}

/*
Check to see if the file has already replaced each component
@param: codeBlock contains the code looking to put into the file
@file: the document class looking to update
@return true if the codeBlock already exists in the document class
*/
function blockExists(file, codeBlock, docClass){
	if (file.indexOf(codeBlock) != -1){
		alert("NOTE: " + docClass + " already contains: " + codeBlock);
		return true;
	}
	else{
		return false;
	}
}

/*
Adds the @param component's [CODE][BLOCK] to the @param file
*/
function addCodeBlocks(component, file, docClass){
	for (BLOCK = 0; BLOCK < component[CODE].length; BLOCK++){
		//don't add the block if it's already there.
		if (!(blockExists(file, component[CODE][BLOCK], docClass))){
			file = addBlockAt(component[LOCATE][BLOCK], component[CODE][BLOCK], String(file));
		}
	}
	return file;
}

/*
Read the AS and add inject the component blocks
*/

function readAS(docClass){
	var file = FLfile.read(docClass);
	return file;
}

/*
If the documentClass is the default, this function is called to
copy the file from the zip directory to the documuents root.
*/
function copyDefaultDC(defaultDCLoc,newLocation){
	FLfile.copy(defaultDCLoc, newLocation);
}

/*
Saves the new action script wit the injected component blocks
*/
function writeAS(docClass, file){
	FLfile.write(docClass, file);
}


//-----START--------//

//clear the console
fl.outputPanel.clear();
if (initial_setup()){
	inject_docs();
}



/* 
Gets the APPEND_POSTFIX from the user using a dialog box and
version to publish
*/
function initial_setup(){
	if (fl.documents.length > 0){
		var docs=fl.documents;
		PANEL = initialXML();
		
		//set the users postfix
		if (PANEL.dismiss == "accept"){
			return true;
		}
		else {
			return false;
		}
	}
	else{
		return false;
	}
	
}

/*
Looks at each FLA currently open in Flash and calls the
apporiate methods to publish it using the @param REPLACE_VERSION number
*/

function inject_docs(){ 
    var docs=fl.documents;
    var docs_length=docs.length;
	
	//In each FLA
    for (var i=0; i<docs_length; i++) {
		
		//doc is now the current FLA
        var doc=docs[i];
		
		//used to evaluate textbox id
		var docClassIndex = "PANEL.docClassList" + i;
		var DCName = eval(docClassIndex);
		
		//variable for reading dialog DC changes
		var docClass = removeFileName(doc.pathURI) + DCName + ".as";
		
		//if the parenthesis are on the right
		if(DCName == DEFAULT_DC){
			//reset the NL's
			NL=" ";
			NLTab=" ";
			NL2Tab=" ";
			VOID="():void";
			
			//no default doc class it must be copied.
			var defaultDCLoc = removeFileName(fl.scriptURI) + DEFAULT_DC + ".as";
			copyDefaultDC(defaultDCLoc,docClass);
		}
		else{
			//file has curly { on the next line
			init_NL();
		}
		
		//set the blocks to find using the new DC
		init_FindBlocks(DCName);

		//read the actionScript()
		var ASFile = readAS(docClass);
	
		//initialize AdSetup linkage with component C_ funciton and pass it to add the code
		ASFile = addCodeBlocks(C_ADSETUP(), ASFile, DCName); 

		//save the new injected file
		ASFile = writeAS(docClass ,ASFile);
		
	}
}

//------END--------//
