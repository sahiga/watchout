var gameOptions = {
  height: 600,
  width: 850,
  nEnemies: 10,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
  // collisions: 0
};

var User = function(){
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
  this.r = 50;
};


var Enemy = function(id, x, y){
  //create a new enemy
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = 50;
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

// Scoreboard
var updateScoreDisplay = function() {
  document.getElementById('current').innerHTML = gameStats.score.toString();
};

var updateBestScoreDisplay = function() {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  document.getElementById('high').innerHTML = gameStats.bestScore.toString();
};

// var updateCollisionsDisplay = function() {
//   document.getElementById('collisions').innerHTML = gameStats.collisions.toString();
// };

// d3
var gameBoard = d3.select('.gameboard')
                      .attr('width', gameOptions.width)
                      .attr('height', gameOptions.height);

var generateRandomPosition = function(dimension){
  if ( dimension === "width" ){
    return Math.random() * ((gameOptions.width - 100) - 0);
  }
  if ( dimension === "height" ){
    return Math.random() * ((gameOptions.height - 100) - 0);
  }
};

var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('drag', function(d){
    if (d3.event.x + 100 < gameOptions.width &&
      d3.event.y + 100 < gameOptions.height &&
      d3.event.x > 0 &&
      d3.event.y > 0) {
      d3.select(this).attr('x', d.x = d3.event.x).attr('y', d.y = d3.event.y);
    }
  });

var onCollision = function() {
  if (gameStats.score > gameStats.bestScore) {
    updateBestScoreDisplay();
  }

  gameStats.score = 0;
  // gameStats.collisions += 1;
  updateScoreDisplay();
  // updateCollisionsDisplay();
};

var checkCollision = function(user, enemy, collidedCallback) {
  var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(user.attr('r'));
  var xDiff = parseFloat(enemy.attr('x')) - parseFloat(user.attr('x'));
  var yDiff = parseFloat(enemy.attr('y')) - parseFloat(user.attr('y'));
  var separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

  if (separation < radiusSum) {
    collidedCallback();
  }
};

var tweenWithCollisionDetection = function(endData) {
  var enemy = d3.select(this);
  var user = gameBoard.selectAll('.user');

  var startPos = {
    x: parseFloat(enemy.attr('x')),
    y: parseFloat(enemy.attr('y'))
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
      .attr('r', function(d) { return d.r; })
      .attr('width', 100)
      .attr('height', 100)
      .attr('xlink:href', 'cookie.png')
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
    .attr("x", function(d) {
      d.x = generateRandomPosition("width");
      return d.x;
    })
    .attr("y", function(d) {
      d.y = generateRandomPosition("height");
      return d.y;
    })
    .tween('custom', tweenWithCollisionDetection);

  //create new enemies here:
  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('r', function(d) { return d.r; })
      .attr('width', 100)
      .attr('height', 100)
      .attr('xlink:href', 'cookie_monster.png')

};

var increaseScore = function(){
  gameStats.score++;
  updateScoreDisplay();
};

var play = function() {
  var gameEnemies = createEnemies();
  var gameUser = createUser();
  renderEnemies(gameEnemies);
  renderUser(gameUser);

  setInterval(function(){
    renderEnemies(gameEnemies);
  }, 1000);

  setInterval(function(){
    increaseScore();
  }, 50);


};

play();

