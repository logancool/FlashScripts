/*
Returns the path without the filename (after the last slash)
*/
function getFileName(path){
	var filename = /[^\/]*$/;
	filename = path.match(filename);
	return filename;
}

fl.trace(getFileName("file:////Users/abc/123/thisIsAfile.fla"));