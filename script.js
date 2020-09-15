// this all starts once the document is loaded
$(document).ready(function () {
  // variables
  var submitBtn = $("#submit");
  var city = $("#inputCity");
  var weatherStats = $("#weatherStats");
  var forecast = $("#forecast");
  var searchedItems = $("#searchedItems");
  var cityValue = city.val();
  var apiKey = "c320efcc3b8bfdd8481af302341ac06c";
  // Get last searched city info from local storage
  weatherStats.html(localStorage.getItem("weatherStats"));
  forecast.html(localStorage.getItem("forecast"));
  //define getAllInfo function
  var getAllInfo = function () {
    // Here we are building the URL we need to query the database

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityValue +
      "&appid=" +
      apiKey +
      "&units=imperial";
    // We then created an AJAX call to Open Weather Map
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // get info for UV url
      var uvURL =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon +
        "&units=imperial";
      // get weather details
      //get icon code
      var iconCode = response.weather[0].icon;
      // put icon code into url
      var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      // create weather icon image
      var icon = $("<img>").attr("src", iconURL);
      // set style
      icon.attr("style", "width: 4rem;");
      // get city and date
      var title = $("<h2>").text(
        response.name + "  (" + moment().format("l") + ")"
      );
      // get temp in F
      var temp = $("<p>").text(
        "Temperature: " + Math.round(response.main.temp) + "°F"
      );
      //get humidity
      var humid = $("<p>").text("Humidity: " + response.main.humidity + "%");
      //get wind speed
      var wind = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
      //append icon to title
      title.append(icon);
      // append all other stats to the page
      weatherStats.append(title, temp, humid, wind);
      // make ajax call for uv
      $.ajax({
        url: uvURL,
        method: "GET",
      }).then(function (response) {
        // create uv info
        var uvLable = $("<p>").text("UV Index: ");
        var uv = $("<span>")
          .text(response.value)
          // round background-color corners
          .attr("style", "border-radius: 15px;");
        // add text to uv value
        uv.appendTo(uvLable);
        // add background color to uv index based on value
        if (response.value < 3) {
          // mild
          uv.addClass("green");
        } else if (response.value >= 11) {
          // extreme
          uv.addClass("violet");
        } else if (response.value < 11 && response.value >= 8) {
          // very high
          uv.addClass("red");
        } else if (response.value < 8 && response.value >= 6) {
          // high
          uv.addClass("orange");
        } else {
          // moderate
          uv.addClass("yellow");
        }
        // append uv info to page
        weatherStats.append(uvLable);
      });
    });
    //make variables for 5-day url
    var daysURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityValue +
      "&units=imperial&cnt=5&appid=" +
      apiKey;
    //make an ajax call to 5-day
    $.ajax({
      url: daysURL,
      method: "GET",
    }).then(function (response) {
      // create a for loop to do this 5 times
      for (var i = 0; i < 5; i++) {
        // create another div
        var day = $("<div>");
        // add class of "days"
        day.addClass("days");
        // inside append h6 date
        // this updates date for 5-day forecast
        var date = $("<h6>").text(
          moment()
            .add(i + 1, "days")
            .format("l")
        );
        // get icon code
        var iconCode = response.list[i].weather[0].icon;
        // add it to the url
        var iconURL =
          "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        //create icon element
        var icon = $("<img>").attr("src", iconURL);
        icon.attr("style", "width: 3rem;");
        // create temp element
        var temp = $("<p>").text(
          "Temp: " + Math.round(response.list[i].main.temp) + "°F"
        );
        // create humid element
        var humid = $("<p>").text(
          "Humidity: " + response.list[i].main.humidity + "%"
        );
        // append all info to the day div
        day.append(date, icon, temp, humid);
        //append each day into forecast div
        forecast.append(day);
      }
    });
    // give 1 second for ajax calls to be made then save info to local storage
    setTimeout(function () {
      localStorage.setItem("weatherStats", weatherStats.html());
      localStorage.setItem("forecast", forecast.html());
    }, 1000);
  };
  //when submit button is pressed, get info for city submitted
  submitBtn.on("click", function (event) {
    event.preventDefault();
    //clear out previous info
    weatherStats.empty();
    forecast.empty();
    //update cityValue
    cityValue = city.val();
    //call the function
    getAllInfo();
    //create a button with the city name under search bar. "search history"
    var search = $("<button>")
      .text(cityValue)
      .addClass("history")
      .attr("value", cityValue);
    searchedItems.append(search);
  });
  // when user clicks search history button, that info is displayed onto screen
  $(document).on("click", ".history", function (event) {
    event.preventDefault();
    // empty old info
    weatherStats.empty();
    forecast.empty();
    //get cityValue from button click value
    cityValue = event.target.innerText;
    //call function
    getAllInfo();
  });
});
