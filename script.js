$(document).ready(function(){
    var submitBtn = $("#submit");
    var city = $("#inputCity")
    var weatherStats = $("#weatherStats")
    // current date and time
    var objDate = new Date();
    

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
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=c320efcc3b8bfdd8481af302341ac06c&lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial";

        console.log(response);
        var iconCode = response.weather[0].icon;
        console.log(iconCode);
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        console.log(iconURL)
        var icon = $("<img>").attr("src", iconURL);
        icon.attr("style", "width: 4rem;")
        console.log(icon)
        var title = $("<h2>").text(response.name + "  (" + moment().format('l') + ")");
        var temp = $("<p>").text("Temperature: " + Math.round(response.main.temp) + "°F");
        var humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        var uv = $("<p>").text("UV Index: " + response.main.speed);
        title.append(icon);
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
    
    