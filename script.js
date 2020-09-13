$(document).ready(function () {
  // submit button
  var submitBtn = $("#submit");
  var city = $("#inputCity");
  var weatherStats = $("#weatherStats");
  // create Dom Variable for 5-day div
  var forecast = $("#forecast");
  var searchedItems = $("#searchedItems");

  weatherStats.html(localStorage.getItem("weatherStats"));
  forecast.html(localStorage.getItem("forecast"));

  submitBtn.on("click", function (event) {
    event.preventDefault();
    weatherStats.empty();
    forecast.empty();
    var cityValue = city.val();

    var getAllInfo = function () {
      // Here we are building the URL we need to query the database
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityValue +
        "&appid=c320efcc3b8bfdd8481af302341ac06c&units=imperial";

      // We then created an AJAX call
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        var uvURL =
          "http://api.openweathermap.org/data/2.5/uvi?appid=c320efcc3b8bfdd8481af302341ac06c&lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          "&units=imperial";

        var iconCode = response.weather[0].icon;

        var iconURL =
          "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

        var icon = $("<img>").attr("src", iconURL);
        icon.attr("style", "width: 4rem;");

        var title = $("<h2>").text(
          response.name + "  (" + moment().format("l") + ")"
        );
        var temp = $("<p>").text(
          "Temperature: " + Math.round(response.main.temp) + "°F"
        );
        var humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        var uv = $("<p>").text("UV Index: " + response.main.speed);
        title.append(icon);
        weatherStats.append(title, temp, humid, wind);

        $.ajax({
          url: uvURL,
          method: "GET",
        }).then(function (response) {
          var uvLable = $("<p>").text("UV Index: ");
          var uv = $("<span>").text(response.value);
          uv.appendTo(uvLable);
          // add background color to uv index
          if (response.value < 3) {
            uv.addClass("green");
          } else if (response.value >= 8) {
            uv.addClass("red");
          } else if (response.value < 8 && response.value >= 6) {
            uv.addClass("orange");
          } else {
            uv.addClass("yellow");
          }
          weatherStats.append(uvLable);
        });
      });
      //make variables for 5-day url
      var daysURL =
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
        cityValue +
        "&units=imperial&cnt=5&appid=c320efcc3b8bfdd8481af302341ac06c";
      //make an ajax call to 5-day
      $.ajax({
        url: daysURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);

        // create a for loop to do this 5 times
        for (var i = 0; i < 5; i++) {
          // create another div
          var day = $("<div>");
          // add class of "days"
          day.addClass("days");
          // inside append h6 date
          var date = $("<h6>").text(moment().add(i, "days").format("l"));
          // append icon <p>
          var iconCode = response.list[i].weather[0].icon;
          var iconURL =
            "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
          var icon = $("<img>").attr("src", iconURL);
          icon.attr("style", "width: 3rem;");
          // append temp <p>
          var temp = $("<p>").text(
            "Temp: " + Math.round(response.list[i].main.temp) + "°F"
          );
          // append humidity <p>'
          var humid = $("<p>").text(
            "Humidity: " + response.list[i].main.humidity + "%"
          );
          //append this div to 5-day div
          day.append(date, icon, temp, humid);
          //append each day into forecast div
          forecast.append(day);
        }
      });
    };
    getAllInfo();
    var search = $("<button>")
      .text(cityValue)
      .addClass("history")
      .attr("value", cityValue);
    searchedItems.append(search);
    setTimeout(function () {
      localStorage.setItem("weatherStats", weatherStats.html());
      localStorage.setItem("forecast", forecast.html());
    }, 3000);
  });
  $(document).on("click", ".history", function(event){
      event.preventDefault();
      cityValue = $(this).val();
      console.log(event);
      console.log(event.val());
      console.log($(this));
      console.log(cityValue)
  })
});
