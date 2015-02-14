var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 10,
  padding: 20
};

var User = function(){
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
  this.zx = 0;
  this.zy = 0;
  this.oldX = 0;
  this.oldY = 0;
  this.r = 25;
};


var Enemy = function(id, x, y){
  //create a new enemy
  this.id = id;
  this.x = x;
  this.y = y;
  this.zx = 0;
  this.zy = 0;
  this.oldX = 0;
  this.oldY = 0;
  this.r = 25;
};

var createEnemies = function(){
  var range = _.range(0,gameOptions.nEnemies);

  var enemyData = _.map(range, function(num){
    var x = Math.random() * gameOptions.width;
    var y = Math.random() * gameOptions.height;
    return new Enemy(num, x, y);
  });

  return enemyData;
};

var createUser = function(){
  return [new User()];
};

// d3
var gameBoard = d3.select('.gameboard').append('svg')
                      .attr('width', gameOptions.width)
                      .attr('height', gameOptions.height);

var generateRandomPosition = function(dimension){
  if ( dimension === "width" ){
    return Math.random() * gameOptions.width;
  }
  if ( dimension === "height" ){
    return Math.random() * gameOptions.height;
  }
};

var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('drag', function(d){
    d3.select(this).attr('x', d.x = d3.event.x).attr('y', d.y = d3.event.y);
  });

var checkCollision = function(user, enemy, collidedCallback) {
  var radiusSum = parseFloat(enemy.attr('r')) + user.r;
  var xDiff = parseFloat(enemy.attr('zx')) - user.x;
  var yDiff = parseFloat(enemy.attr('zy')) - user.y;
  var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

  if (separation < radiusSum) {
    collidedCallBack(user, enemy);
  }
};

var onCollision = function() {
  console.log('collision has been detected!!');
};

var tweenWithCollisionDetection = function(startData, endData) {
  var enemy = d3.select(this);
  var user = gameBoard.selectAll('.user');

  var startPos = {
    x: startData.x,
    y: startData.y
  };

  var endPos = {
    x: endData.x,
    y: endData.y
  };

  return function(t) {
    checkCollision(user, enemy, onCollision);

    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };

    enemy.attr('x', enemyNextPos.x)
      .attr('y', enemyNextPos.y);
  };

};

// Render user image
var renderUser = function(userData){
  var user = gameBoard.selectAll('.user')
                .data(userData, function(d) { return d; });

  user.enter()
    .append('svg:image')
      .attr('class', 'user')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('zx', function(d) { return d.x + 25; })
      .attr('zy', function(d) { return d.y + 25; })
      .attr('r', function(d) { return d.r; })
      .attr('oldX', function(d) { return d.oldX; })
      .attr('oldY', function(d) { return d.oldY; })
      .attr('width', 50)
      .attr('height', 50)
      .attr('xlink:href', 'burger.png')
      .call(drag);
};

// Render enemy images
var renderEnemies = function(enemyData) {
  var enemies = gameBoard.selectAll('.enemy')
                .data(enemyData, function(d) { return d.id; });

  //update old enemies:
  enemies
    .transition()
    .duration(1250)
    .attr('oldX', function(d) {
      d.oldX = d.x;
    })
    .attr('oldY', function(d) {
      d.oldY = d.y;
    })
    .attr("x", function(d) {
      d.x = generateRandomPosition("width");
      return d.x;
    })
    .attr("y", function(d) {
      d.y = generateRandomPosition("height");
      return d.y;
    })
    .tween('custom',
      function(d) {
        tweenWithCollisionDetection(
          { x: d.oldX, y: d.oldY },
          { x: d.x, y: d.y });
      }
    );


    // pass in d.x and d.y as endData

  //create new enemies here:
  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('zx', function(d) { return d.x + 25; })
      .attr('zy', function(d) { return d.y + 25; })
      .attr('r', function(d) { return d.r; })
      .attr('oldX', function(d) { return d.oldX; })
      .attr('oldY', function(d) { return d.oldY; })
      .attr('width', 50)
      .attr('height', 50)
      .attr('xlink:href', 'asteroidpuppy.png')

};

var gameEnemies = createEnemies();
var gameUser = createUser();
renderEnemies(gameEnemies);
renderUser(gameUser);

setInterval(function(){
  renderEnemies(gameEnemies);
}, 1500);


