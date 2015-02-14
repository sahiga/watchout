var User = function(){
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
  this.r = 50;
};

var createUser = function(){
  return [new User()];
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
