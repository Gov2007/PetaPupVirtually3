//Create variables here
var dog, happup, database, foodS, foodStock;
var dog1Ig, dog2Img;
var FoodQ = 20;
var fedTime, lastFed = 10;
var feedPet, addFood;
var foodObj, milkImg, milkBottle;


function preload()
{
  //load images here
  dog1Img = loadImage("dogImg.png");
  happup = loadImage("dogImg1.png");
  washroom = loadImage("Wash Room.png");
  garden = loadImage("Garden.png");
  bedroom = loadImage("Bed Room.png");
  milkImg = loadImage("Milk.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800, 500);
  dog = createSprite(550, 300, 20, 10);
  dog.addImage(dog1Img);  
  dog.scale = "0.3"
  foodObj = new Food();
  foodStock = database.ref('Food');
  // foodStock.on("value", readStock);
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
  feedPet = createButton("Feed the Dog");
  feedPet.position(700, 95);
  feedPet.mousePressed(feedDog);

  

  
  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  milkBottle = createSprite(370, 320);
  milkBottle.addImage(milkImg);
  milkBottle.visible = 0;
  milkBottle.scale = 0.1;
  

}

function draw() {  
  
  background(46, 139, 87);

  foodObj.display();
 fedTime=database.ref('FeedTime');
 fedTime.on("value",function(data){
   lastFed=data.val();
 })

  fill(255, 255, 254);
  textSize(15);
  if(lastFed >= 12){
     text("Last Feed : " + lastFed%12 + "PM", 350, 30);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM " , 350, 30);
  }
  else{
    text("Last Feed : " + lastFed + "AM", 350, 30)
  }

  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }

  else if(currentTime === (lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
  }

  else if(currentTime>(lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }

  else{
    update("Hungry");
    foodObj.display(); 
  }

  if(gameState != "Hungry"){
    feedPet.hide();
    addFood.hide();
    dog.remove();

  }

  else{
    feedPet.show();
    addFood.show();
    dog.addImage(dog1Img);
  }

 
  
  dog.display();
 milkBottle.display();
 


}


function feedDog(){
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkBottle.visible=0;
    dog.addImage(dog1Img);
  }
  else{
    dog.addImage(happup);
    if(foodObj.foodStock===1)
    {
        milkBottle.visible=0;
        dog.addImage(dog1Img);
    }
    else
    milkBottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}

function addFoods(){
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}



