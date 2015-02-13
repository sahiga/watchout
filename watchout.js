var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var Enemy = function(id, x, y){
  //create a new enemy
  this.id = id;
  this.x = x;
  this.y = y;
};

Enemy.prototype.updateLocation = function(){

}

var createEnemies = function(){
  var range = _.range(0,gameOptions.nEnemies);

  var enemyData = _.map(range, function(num){
    var x = Math.random() * gameOptions.width;
    var y = Math.random() * gameOptions.height;
    return new Enemy(num, x, y);
  });

  return enemyData;
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

var renderEnemies = function(enemyData) {
  var enemies = gameBoard.selectAll('circle.enemy')
                  .data(enemyData, function(d) { return d.id; });

  //update old enemies:
  enemies
    .transition()
    .duration(1250)
    .attr("cx", function(d) {
      d.x = generateRandomPosition("width");
      return d.x;
    })
    .attr("cy", function(d) {
      d.y = generateRandomPosition("height");
      return d.y;
    });

  //create new enemies here:
  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 10);

  // var enemies = gameBoard.selectAll('div')
  //   .data(enemyData, function(d) { return d.id; });

  // enemies.enter()
  //   .append('div')
  //     .attr('class', 'enemy')
  //     .attr('x', function(d) { return d.x; })
  //     .attr('y', function(d) { return d.y; });

  //enemies.exit();
};

var gameEnemies = createEnemies();

renderEnemies(gameEnemies);

setInterval(function(){
  renderEnemies(gameEnemies);
}, 1500);

