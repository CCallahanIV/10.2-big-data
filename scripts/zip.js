(function(module) {
  var zip = {};
  var zips = [];

  getData = function() {
    $.getJSON('/data/manhattan.json', function(data) {
      zips = data.features;
      console.log('loaded');

      var newZips = trimData(zips);
      console.log(newZips);

      var topFiveNeighborhoods = topFive(newZips);
      console.log(topFiveNeighborhoods);

    //END OF .getJSON
    });
  };

  function topFive(newZips){
    return newZips.map(function(ele){
      return ele.neighborhood;
    }).reduce(function(uniqueNeighbors, curNeighbor) {
      if (uniqueNeighbors.indexOf(curNeighbor) === -1) {
        uniqueNeighbors.push(curNeighbor);
      }
      return uniqueNeighbors;
    }, []).map(function(neighborhood){
      return {
        'neighborhood': neighborhood,
        'numZips': newZips.filter(function(ele){
          return ele.neighborhood === neighborhood;
        }).length
      }
    }).sort(function(a,b){
      return b.numZips - a.numZips;
    }).slice(0,5);
  };

  function trimData(data){
    return data.map(function(ele){
      return {
        'zip': ele.properties.zip,
        'neighborhood': ele.properties.neighborhood,
        'address': checkNeighborhood(ele),
        'coordinates': {
          'lat': ele.geometry.coordinates[0],
          'lng': ele.geometry.coordinates[1]
        }
      };
    });

    function checkNeighborhood(ele){
      if (ele.properties.neighborhood === ""){
        return null;
      } else {
        return ele.properties.neighborhood;
      };
    };

  };


  getData();
  module.zip = zip;
})(window);
