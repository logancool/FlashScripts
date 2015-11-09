fl.outputPanel.clear();

/*
Returns the path without the filename (after the last slash)
*/
function removeFileName(path){
	var filename = /[^\/]*$/;
	path = path.replace(filename, '');
	return path;
}

var path = removeFileName(fl.scriptURI) + "AnimatedBanner.as";
var file = FLfile.read(path);


var NLText = FLfile.read(removeFileName(fl.scriptURI) + "newLine.txt");
var newLine = NLText.charAt(2);
var newLineTAB = NLText.substring(2,4);
var newLine2TAB = newLineTAB + NLText.charAt(3);

fl.trace(file.indexOf("package" + newLine + "{"));

fl.trace(file.indexOf("public class AnimatedBanner extends MovieClip" + newLineTAB + "{"));

fl.trace(file.indexOf("public function AnimatedBanner()" + newLine2TAB + "{"));