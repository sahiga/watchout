
var onCollision = function() {
  if (gameStats.score > gameStats.bestScore) {
    updateBestScoreDisplay();
  }

  gameStats.score = 0;
  updateScoreDisplay();
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

