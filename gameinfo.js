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

// Scoreboard
var updateScoreDisplay = function() {
  document.getElementById('current').innerHTML = gameStats.score.toString();
};

var updateBestScoreDisplay = function() {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  document.getElementById('high').innerHTML = gameStats.bestScore.toString();
};

//Generate the gameboard svg
var gameBoard = d3.select('.gameboard')
                      .attr('width', gameOptions.width)
                      .attr('height', gameOptions.height);


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
