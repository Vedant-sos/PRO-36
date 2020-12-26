//Create variables here
var sdog;
var dog,database,happyDog,foodS,foodStock;
var foodStock;
var feedButton,addButton;
var fedTime,lastFed;
var foodObj;
var changeState,readState,gameState;
var bedroom,garden,washroom;
var currentTime;

function preload()
{
  //load images here
  happyDog=loadImage("images/dogImg1.png");
  dog=loadImage("images/dogImg.png");
  sadDog=loadImage("virtual+pet+images/virtual pet images/Lazy.png");
  bedroom=loadImage("virtual+pet+images/virtual pet images/Bed Room.png");
  garden=loadImage("virtual+pet+images/virtual pet images/Garden.png");
  washroom=loadImage("virtual+pet+images/virtual pet images/Wash Room.png");
}

function setup() {
	createCanvas(800, 600);
  sdog=createSprite(650,150,20,20);
  sdog.addImage(dog);
  sdog.scale=0.25;

  database=firebase.database();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);

  feedButton=createButton("To feed the dog, click here");
  feedButton.position(600,80);
  feedButton.mousePressed(feedDog);
  addButton=createButton("To add more milk, click here");
  addButton.position(800,80);
  addButton.mousePressed(addFood);

  readState=database.ref('gameState');
  readState.on("value",(data)=>{
    gameState=data.val();
  })

  foodObj=new Food();
}


function draw() {  
  background(46, 139, 87);

  fedTime=database.ref("feedTime");
  fedTime.on("value",(data)=>{
    lastFed=data.val();
  });

  if(lastFed>12){
    textSize(25);
    fill("yellow");
    text("Last fed time: "+ (lastFed%12) + " PM",400,450);
  }
  else if(lastFed===12){
    textSize(25);
    fill("yellow");
    text("Last fed time: "+ "12 PM",400,450);
  }
  else if(lastFed===0){
    textSize(25);
    fill("yellow");
    text("Last fed time: "+ "12 AM",400,450);
  }
  else{
    textSize(25);
    fill("yellow");
    text("Last fed time: "+ lastFed + " AM",400,450);
  }

  currentTime=hour();
  if(currentTime===lastFed+1){
    foodObj.garden();
    update("playing");
  }
  else if(currentTime===lastFed){
    foodObj.bedroom();
    update("sleeping");
  }
  else if(currentTime>=(lastFed+2) && currentTime<=(lastFed+4)){
    foodObj.washroom();
    update("bathing");
  }
  else{
    foodObj.display();
    update("hungry");
  }

  if(gameState!=="hungry"){
    feedButton.hide();
    sdog.remove();
  }
  else{
    feedButton.show();
    sdog.visible=true;
    sdog.addImage(sadDog);
  }

  drawSprites();
  //add styles here
  textSize(25);
  fill("blue");
  text("STOCK:"+ foodS,450,500);
  
  if(foodS===0){
    fill("red");
    text("PLEASE REFILL!",150,100);
    sdog.addImage(dog);
    sdog.x=650;
  }
  
}


function readStock(data){
   foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    food:x
  })
}

function feedDog(){
  sdog.addImage(happyDog);
  sdog.x=450;
  foodObj.updatefoodStock(foodObj.getfoodStock()-1);
  database.ref('/').update({
    food:foodObj.getfoodStock(),
    feedTime:hour()
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}


