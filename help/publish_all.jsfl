
var appendName = "_ft";
var publishProfile = "PUBLISH_11_2";

var documentPath = fl.getDocumentDOM().path; //current open document's path

function removeExtension(filename){
    var lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}

function publish(doc){
	fl.trace("publishing path: " + doc.path);
	var pubDoc = fl.openDocument("file:///" + doc.path);
	pubDoc.currentPublishProfile = "/Users/logancool/Library/Application\ Support/Adobe/Flash\ CC\ 2014/en_US/Configuration/Publish\ Profiles/PUBLISH_11_2.xml";
	save(pubDoc);
	//pubDoc.publish();
}


function check_extension(oldPath){
	
	var ext = oldPath.split('.').pop(); //current directory to regex
	//var oldPath = removeExtension(oldPath); //current directory to regex
	fl.trace("OLD PATH: " + oldPath);
	if (FLfile.exists(oldPath) == true) {
		fl.trace("OVERWRITE");
		documentPath = oldPath // dont change the path to write 
	}
	else {
		documentPath = oldPath.replace("." + ext, appendName);//create appended name for new version
		fl.trace("replacing " + ext + " with " + appendName);
		} 
}

function save(doc){
	
	//var oldPath = String(documentPath);
	
	//check_extension(oldPath); //find what extension to replace-- set the file name
	
	fl.trace("Save new FLA: " + documentPath);
	//fl.saveDocument(doc, "file:///" + documentPath);  
	//fl.openDocument("file:///" + documentPath);//open this newly saved document

}

function export_all(){ 
    var docs=fl.documents;
    var docs_length=docs.length;
    for (var i=0; i<docs_length; i++) {  
        var doc=docs[i];
		documentPath = doc.path; 
		fl.trace("DOCUMENT: " + documentPath);
        publish(doc); // set the publish settings for current document
		//save_fla(doc); // save new fla document
		
    }
}

appendName = appendName + ".fla"; //make the users custom append an fla
export_all();