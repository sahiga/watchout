var Enemy = function(id, x, y){
  //create a new enemy
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = 50;
};

var generateRandomPosition = function(dimension){
  if ( dimension === "width" ){
    return Math.random() * ((gameOptions.width - 100) - 0);
  }
  if ( dimension === "height" ){
    return Math.random() * ((gameOptions.height - 100) - 0);
  }
};

var createEnemies = function(){
  var range = _.range(0,gameOptions.nEnemies);

  var enemyData = _.map(range, function(num){
    var x = generateRandomPosition('width');
    var y = generateRandomPosition('height');
    return new Enemy(num, x, y);
  });

  return enemyData;
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
