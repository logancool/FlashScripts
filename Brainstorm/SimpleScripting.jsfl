
function componentExists(codeBlock, component){
	return codeBlock.indexOf(component) != -1;
}

codeBlock = "George ";
component = "Washington is on the CAT";

if (componentExists(codeBlock,component)){
	fl.trace("THE CAT is on the tree");
}
else{
	fl.trace("no it didn't");
}