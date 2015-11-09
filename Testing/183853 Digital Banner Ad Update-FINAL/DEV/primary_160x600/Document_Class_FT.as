package {

	//Import the flashtalking FTEvents class so we can listen for the events
	import com.flashtalking.events.FTEvent; 
	import com.flashtalking.buttons.*; 
	import com.flashtalking.*; 	


	// --------------------- IMPORTS ---------------------------------

	import flash.display.MovieClip;
	import flash.events.*;

	// ---------------------BEGIN MAIN CLASS --------------------------------

	public class Document_Class_FT extends MovieClip {


		private function addClickTag(myFT)
		{ 
 			myClickTag.width = 300; 
			myClickTag.height = 250; 
			addChild(myClickTag);
						
			// We just put the clickTag in the layer above the richload placeholder so it is not obscured. 
			setChildIndex(myClickTag,MovieClip(root).numChildren-1);
		}


		//ADD COMPONENT CLASS 
		public var myFT:FT = new FT();
		private var myClickTag:FTClickTagButton = new FTClickTagButton();


		private function addClickTag(myFT){ 
 			myClickTag.width = 300; 
			myClickTag.height = 250; 
			addChild(myClickTag);
						
			// We just put the clickTag in the layer above the richload placeholder so it is not obscured. 
			setChildIndex(myClickTag,MovieClip(root).numChildren-1);
		}
	
		public function Document_Class_FT():void {

			// Add the ad setup component to the stage next,
			// this will also determine the layer order of the automatic clickthrough.
			addChild(myFT);//FT added 

			// Add the ad setup component to the stage next,
			// this will also determine the layer order of the automatic clickthrough.
			addChild(myFT);
			init();

		}
		private function addClick(myFT){
			
		}

		private function init():void {
	
		}
		
	}//Class
	
}//Package