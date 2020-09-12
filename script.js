$(document).ready(function(){
    var submitBtn = $("#submit");
    var city = $("#inputCity")
    var weatherStats = $("#weatherStats")

    submitBtn.on("click", function(event){
        event.preventDefault();
        weatherStats.empty();
        var cityValue = city.val();
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityValue + "&appid=c320efcc3b8bfdd8481af302341ac06c&units=imperial";
    

    // We then created an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=c320efcc3b8bfdd8481af302341ac06c&lat=" + response.coord.lat + "&lon=" + response.coord.lon;

        var title = $("<h1>").text(response.name);
        var temp = $("<p>").text("Temperature: " + Math.round(response.main.temp) + "°F");
        var humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        var uv = $("<p>").text("UV Index: " + response.main.speed);
        weatherStats.append(title, temp, humid, wind);
      
        $.ajax({
            url: uvURL,
            method: "GET"
          }).then(function(response) {

            console.log(response);
            var uv = $("<p>").text("UV Index: " + response.value);
            weatherStats.append(uv);
            
      

      
          });

    });
    })
})
    
    