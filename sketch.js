/***********************************************************************************
  Deforestation
  by Tyler Wong

  Uses the p5.2DAdventure.js class 
  A game that is centered around deforestation in the Amazon Rainforest.
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;

// Global Variables
var hearts = 0;
var talkedToNPC = false;
var talkedToOtter = false;
var talkedToToucan = false;

var animalTree = false;
var greenhouseTree = false;
var environmentTree = false;


var gotHearts = false;
var animalHeart = false;
var greenhouseHeart = false;
var environmentHeart = false;

let bodyFont;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  bodyFont = loadFont('fonts/NeueHaasGrot-Round-75-Bold.otf');

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height-200, 100, 220);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  playerSprite.addAnimation('walk', loadAnimation('assets/avatars/avatar-right-01.png', 'assets/avatars/avatar-right-05.png'));
  playerSprite.addAnimation('still', loadAnimation('assets/avatars/avatar-right-01.png'));

  // use this to track movement from room to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" &&
      adventureManager.getStateName() !== "Introduction" &&
      adventureManager.getStateName() !== "Portal") {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 

  if(animalHeart === true && greenhouseHeart === true && environmentHeart === true) {
    hearts = 3;
  }
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  	if(keyIsDown(RIGHT_ARROW)) {
	  	playerSprite.changeAnimation('walk');
	  	playerSprite.mirrorX(1);
	    playerSprite.velocity.x = 5;
	}
  	else if(keyIsDown(LEFT_ARROW)) {
  		playerSprite.changeAnimation('walk');
  		playerSprite.mirrorX(-1);
		playerSprite.velocity.x = -5;
  	} 
  	else if(keyIsDown(DOWN_ARROW)) {
  		playerSprite.changeAnimation('walk');
		playerSprite.velocity.y = 5;
  	}
  	else if(keyIsDown(UP_ARROW)) {
  		playerSprite.changeAnimation('walk');
		playerSprite.velocity.y = -5;
  	}
  	else {
  		playerSprite.changeAnimation('still');
		playerSprite.velocity.y = 0;
		playerSprite.velocity.x = 0;
  	}
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#C9A26B";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#FFEEA9";
  this.textFont = bodyFont;
  this.textSize = 15;
  this.width = 175;
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}

function talkToNPC() {
  if( talkedToNPC === false) {
    talkedToNPC = true;
    print("talked to NPC");
  }
}

function getAnimalHeart() {
  if ( animalHeart === false) {
    animalHeart = true; 
  }
}
function getGreenhouseHeart() {
  if ( greenhouseHeart === false) {
    greenhouseHeart = true; 
  }
}
function getEnvironmentHeart() {
  if ( environmentHeart === false) {
    environmentHeart = true; 
  }
}

function talkToOtter() {
  if( talkedToOtter === false ) {
    print( "turning them on");

    talkedToOtter = true;
    print("talked to otter");
  }
}

function talkToToucan() {
  if( talkedToToucan === false ) {
    print( "turning them on");

    talkedToToucan = true;
    print("talked to toucan");
  }
}

function portalInteract() {
  adventureManager.changeState("Portal");
}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a background image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are a tree farmer in the Brazilian Amazon that has come across four unusual trees at the edge of the forest. You feel a strange presence around you. Navigate through the different rooms using the buttons and arrow keys to learn the truth behind tree farming and deforestation.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

// 
class TreeOne extends PNGRoom {
  preload() {
    this.chopped = loadImage('assets/choppedTree.png');

    this.animal = loadImage('assets/animalTree.png');
    this.greenhouse = loadImage('assets/greenhouseTree.png');
  }

  draw() {
    super.draw();

    // 
    if( animalTree === true ) {
      image(this.chopped, 900, 500);
    } else {
      image(this.animal, 800, 200);
    }

    if( greenhouseTree === true ) {
      image(this.chopped, 400, 500);
    } else {
      image(this.greenhouse, 400, 200);
    }
  }
}

class TreeTwo extends PNGRoom {
  preload() {
    this.chopped = loadImage('assets/choppedTree.png');

    this.environment = loadImage('assets/environmentTree.png');

    this.portalSprite = createSprite( 700, 300, 400, 400);
    this.portalSprite.addAnimation('regular',  loadAnimation('assets/NPCs/portal_01.png', 'assets/NPCs/portal_06.png'));  
    print("preloading portal");
  }

  unload() {
    super.unload();

  }

  draw() {
    super.draw();

    // 
    if( environmentTree === true ) {
      image(this.chopped, 150, 500);
    } else {
      image(this.environment, 150, 200);
    }

    if( hearts === 3) {
      drawSprite(this.portalSprite);

      playerSprite.overlap(this.portalSprite, portalInteract);
    }
  }
}


class Animal extends PNGRoom {

  preload() {
    this.talkBubble = null;
    this.talkBubble2 = null;
    this.talkedToOtter = false;
    this.talkedToToucan = false;  // only draw when we run into it
    talkedToOtter = false;
    talkedToToucan = false;


    this.otterSprite = createSprite( 250, 300, 200, 200);
    this.otterSprite.addAnimation('regular',  loadAnimation('assets/NPCs/otter_01.png', 'assets/NPCs/otter_04.png'));  
    print("preloading animal otter");

    this.toucanSprite = createSprite(1000, 500, 200, 200);
    this.toucanSprite.addAnimation('regular', loadImage('assets/NPCs/toucan.png'));
    print("preloading animal toucan");
  }
  load() {
    // pass to superclass
    super.load();

    this.talkBubble = loadImage('assets/text/otter-text.png');
    this.talkBubble2 = loadImage('assets/text/toucan-text.png');
      
  }

  // clears up memory
  unload() {
    super.unload();

    this.talkBubble = null;
    this.talkBubble2 = null;

    this.talkedToOtter = false;
    this.talkedToToucan = false; 
    print("unloading Animal room");
  }

  draw() {
    // PNG room draw
    super.draw();
    drawSprite(this.otterSprite);
    drawSprite(this.toucanSprite);
    playerSprite.overlap(this.otterSprite, talkToOtter);
    playerSprite.overlap(this.toucanSprite, talkToToucan);


    if (this.talkBubble !== null && talkedToOtter === true) {
      image(this.talkBubble, 500, 50);
    }
    if (this.talkBubble2 !== null && talkedToToucan === true) {
      image(this.talkBubble2, 200, 490);
    }
  }
}


class Animal2 extends PNGRoom {


  preload() {
    this.talkBubble = null;
    this.gotHeart = false; 
    animalHeart = false;

    this.heartSprite = createSprite(610, 300, 200, 200);
    this.heartSprite.addAnimation('regular', loadImage('assets/NPCs/heart_01.png'));
    print("preloading Animal2 heart");
  }


  load() {
    super.load();

    this.talkBubble = loadImage('assets/text/animal2text.png');
  }


  unload() {
    super.unload();

    this.talkBubble = null;

    this.talkedToNPC = false;
    print("Unloading Animal2 room");
  }


  draw() {
    super.draw();
    drawSprite(this.heartSprite);

    playerSprite.overlap(this.heartSprite, getAnimalHeart);

    if(this.talkBubble !== null && animalHeart === true) {
      image(this.talkBubble, 60, 500);
      animalTree = true;
      clickables[4].visible = false;
      this.heartSprite.remove();
      print("heart number: " + hearts);
    }
  }
}

class Greenhouse extends PNGRoom {

  
  preload() {
    this.talkBubble = null;
    this.talkedToNPC = false; // only draw when we run into it  
    talkedToNPC = false;

    this.gasSprite = createSprite( 640, 300, 300, 300);
    this.gasSprite.addAnimation('regular',  loadAnimation('assets/NPCs/gas_01.png', 'assets/NPCs/gas_08.png'));  
    print("preloading gas sprite");

  }
  load() {
    // pass to superclass
    super.load();

    this.talkBubble = loadImage('assets/text/greenhouseGasText.png');
  }

  // clears up memory
  unload() {
    super.unload();

    this.talkBubble = null;

    this.talkedToNPC = false;
    print("Unloading Greenhouse room");
  }

  draw() {
    // PNG room draw
    super.draw();
    drawSprite(this.gasSprite);
    playerSprite.overlap(this.gasSprite, talkToNPC);
  
    if (this.talkBubble !== null && talkedToNPC === true) {
      image(this.talkBubble, 700, 400);
    }

  }
}


class Greenhouse2 extends PNGRoom {


  preload() {
    this.talkBubble = null;
    this.gotHeart = false; 
    greenhouseHeart = false;

    this.heartSprite = createSprite(610, 300, 200, 200);
    this.heartSprite.addAnimation('regular', loadImage('assets/NPCs/heart_01.png'));
    print("preloading Greenhouse2 heart");
  }


  load() {
    super.load();

    this.talkBubble = loadImage('assets/text/greenhouse2text.png');
  }


  unload() {
    super.unload();

    this.talkBubble = null;

    this.talkedToNPC = false;
    print("Unloading Animal2 room");
  }


  draw() {
    super.draw();
    drawSprite(this.heartSprite);

    playerSprite.overlap(this.heartSprite, getGreenhouseHeart);

    if(this.talkBubble !== null && greenhouseHeart === true) {
      image(this.talkBubble, 60, 450);
      greenhouseTree = true;
      clickables[4].visible = false;
      this.heartSprite.remove();
      print("heart number: " + hearts);
    }
  }
}

class Environment extends PNGRoom {

  
  preload() {
    this.talkBubble = null;
    this.talkedToNPC = false; // only draw when we run into it  
    talkedToNPC = false;

    this.treeSprite = createSprite( 240, 200, 300, 300);
    this.treeSprite.addAnimation('regular',  loadAnimation('assets/NPCs/roottree.png'));  
    print("preloading tree sprite");

  }
  load() {
    // pass to superclass
    super.load();

    this.talkBubble = loadImage('assets/text/environmentTreeText.png');
  }

  // clears up memory
  unload() {
    super.unload();

    this.talkBubble = null;

    this.talkedToNPC = false;
    print("Unloading Greenhouse room");
  }

  draw() {
    // PNG room draw
    super.draw();
    drawSprite(this.treeSprite);
    playerSprite.overlap(this.treeSprite, talkToNPC);
  
    if (this.talkBubble !== null && talkedToNPC === true) {
      image(this.talkBubble, 650, 250);
    }

  }
}

class Environment2 extends PNGRoom {


  preload() {
    this.talkBubble = null;
    this.gotHeart = false; 
    environmentHeart = false;

    this.heartSprite = createSprite(610, 300, 200, 200);
    this.heartSprite.addAnimation('regular', loadImage('assets/NPCs/heart_01.png'));
    print("preloading Greenhouse2 heart");
  }


  load() {
    super.load();

    this.talkBubble = loadImage('assets/text/environment2text.png');
  }


  unload() {
    super.unload();

    this.talkBubble = null;

    this.talkedToNPC = false;
    print("Unloading Environment2 room");
  }


  draw() {
    super.draw();
    drawSprite(this.heartSprite);

    playerSprite.overlap(this.heartSprite, getEnvironmentHeart);

    if(this.talkBubble !== null && environmentHeart === true) {
      image(this.talkBubble, 60, 450);
      environmentTree = true;
      clickables[4].visible = false;
      this.heartSprite.remove();
      print("heart number: " + hearts);
    }
  }
}



