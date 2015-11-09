POSTFIX = "abc"; //example postfix for label

/*
Returns the directory location of the script (without the script name)
*/
function getScriptPath(){
	var scriptName = /[^\/]*$/;
	var scriptPath = fl.scriptURI;
	scriptPath = scriptPath.replace(scriptName, '');
	return scriptPath;
}

/*
Makes a temp XML file to display the dynamic XML dialog box
*/

function showXMLPanel(xmlString)
{
  var tempUrl = fl.configURI + parseInt(777 * 777) + ".xml"
  FLfile.write(tempUrl, xmlString);
  var xmlPanelOutput = fl.getDocumentDOM().xmlPanel(tempUrl);
  FLfile.remove(tempUrl);
  return xmlPanelOutput;
}

/*
Returns the customized label including the postfix to the dialog
*/
function addCustomLabel(){
	var label = '<label value="There already exists a file with the postfix: ' + POSTFIX + '"/>';
	return String(label);
}

/*
The meat of the dialog - contains the xml definitions for buttons and choices
@returns the dialog information
*/
function dynamicXML(){
	// create an XUL with JSFL
	var dialogXML = "";
	dialogXML += '<dialog title="File Already Exists" buttons="accept, cancel">';
	dialogXML += 	'<vbox>';
    dialogXML += 		addCustomLabel();
    dialogXML += 		'<label control="chooseLablel" value="Choose a save option"/>  ';
    dialogXML += 		'<radiogroup id="saveChoice"> ' ;
	dialogXML += 			'<radio selected="true" label="Overwrite"/>  ';
	dialogXML += 			'<radio label="Save As.."/>';
	dialogXML += 		'</radiogroup> ' ;
    dialogXML += 	'</vbox>';
	dialogXML += '</dialog>';
	
	var xmlPanelOutput = showXMLPanel(dialogXML);
	return xmlPanelOutput;
}
/*
Checks the users decision on if to overwrite and calls the appropriate action
*/
function saveChoice(xmlPanelOutput){
	//if the user clicks OK 
	if (xmlPanelOutput.dismiss == "accept") // user chooses to overwrite
	{
		//what button the user chose
		if (xmlPanelOutput.saveChoice == "Overwrite"){
			fl.trace("OVERWRITE");
			doc.save(docPath);
		}
		else {
			fl.trace("SAVE AS");
			fl.saveDocumentAs(true);
		}
	}
	//the user clicked Cancel
	else if (xmlPanelOutput.dismiss == "cancel"){ // user chooses to save
		fl.trace("CANCELLED PROCESS");
	}
}

saveChoice(dynamicXML());



 