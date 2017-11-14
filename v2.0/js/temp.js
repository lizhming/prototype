//Stage
var stage = new createjs.Stage("demoCanvas");

//VARIABLES
//Drag Object Size
dragRadius = 40;
//Destination Size
destHeight = 100;
destWidth = 100;

//Circle Creation
var label = new createjs.Text("DRAG ME", "14px Lato", "#fff");
label.textAlign="center";
label.y -= 7;
var circle = new createjs.Shape();
circle.graphics.setStrokeStyle(2).beginStroke("black")
.beginFill("red").drawCircle(0,0, dragRadius);


//Drag Object Creation
//Placed inside a container to hold both label and shape
var dragger = new createjs.Container();
dragger.x = dragger.y = 100;
dragger.addChild(circle, label);
dragger.setBounds(100, 100, dragRadius*2, dragRadius*2);
//DragRadius * 2 because 2*r = width of the bounding box
var label2 = new createjs.Text("HERE", "bold 14px Lato", "#000");
label2.textAlign = "center";
label2.x += 50;
label2.y += 40;


var box = new createjs.Shape();
box.graphics.setStrokeStyle(2).beginStroke("black").rect(0, 0, destHeight, destWidth);
var destination = new createjs.Container();
destination.x = 350;
destination.y = 50;
destination.setBounds(350, 50, destHeight, destWidth);

destination.addChild(label2, box);

//DRAG FUNCTIONALITY =====================
dragger.on("pressmove", function(evt){
     evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
     stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
     if(intersect(evt.currentTarget, destination)){
       evt.currentTarget.alpha=0.2;
       box.graphics.clear();
       box.graphics.setStrokeStyle(3)
       .beginStroke("#0066A4")
       .rect(0, 0, destHeight, destWidth);
       
     }else{
       evt.currentTarget.alpha=1;
       box.graphics.clear();     box.graphics.setStrokeStyle(2).beginStroke("black").rect(0, 0, destHeight, destWidth);
     }

});

//Mouse UP and SNAP====================
dragger.on("pressup", function(evt) {
  if(intersect(evt.currentTarget, destination)){
    dragger.x = destination.x + destWidth/2;
    dragger.y = destination.y + destHeight/2;
    dragger.alpha = 1;
    box.graphics.clear();     
    box.graphics.setStrokeStyle(2).beginStroke("black").rect(0, 0, destHeight, destWidth);
    stage.update(evt);
  }
});
//Tests if two objects are intersecting
//Sees if obj1 passes through the first and last line of its
//bounding box in the x and y sectors
//Utilizes globalToLocal to get the x and y of obj1 in relation
//to obj2
//PRE: Must have bounds set for each object
//Post: Returns true or false
function intersect(obj1, obj2){
  var objBounds1 = obj1.getBounds().clone();
  var objBounds2 = obj2.getBounds().clone();

  var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
  
  var h1 = -(objBounds1.height / 2 + objBounds2.height);
  var h2 = objBounds2.width / 2;
  var w1 = -(objBounds1.width / 2 + objBounds2.width);
  var w2 = objBounds2.width / 2;
 
  
  if(pt.x > w2 || pt.x < w1) return false;
  if(pt.y > h2 || pt.y < h1) return false;
  
  return true;
}


//Adds the object into stage
stage.addChild(destination, dragger);
stage.mouseMoveOutside = true;
stage.update();