



function updateWeather(city){

addToLocalStorage(city);
var UV_URL = "http://api.openweathermap.org/data/2.5/uvi?lat={%s}&lon={%s}&appid="; 
var FIVE_DAY_URL=`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=`;
var CURRENT_DAY_URL=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=`;
const API_KEY="226fa871e602dfe5766fff6af9945fe1";

// main current weather 
$.get( CURRENT_DAY_URL+API_KEY, function(data, status) {
    var lat= data.coord.lat;
    var lon= data.coord.lon;
    var wind_speed = data.wind.speed; 
    var humidity= data.main.humidity;
    var name_city= data.name;
    var dt= data.dt;
    var curr_temp = data.main.temp;
    var icon= data.weather[0].icon;
    $("#main-icon").attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`); 
    $("#main-temp").html(curr_temp + " &#176;F"); 
    $("#main-wind-speed").text(wind_speed + " MPH"); 
    $("#main-city-name").text(name_city); 
    $("#main-humidity").text(humidity + "%"); 
    $("#main-date").text(moment(dt, "X").format('L'));

    var uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=` + API_KEY;
    getUVData(uvURL); 
  })



    $.get( FIVE_DAY_URL+API_KEY, function(data, status) {

        var count = 0; 
       
        for (const d of data.list){

            if (count !== 0 && (count+1) %8 === 0){ // get every 8th value  
                var humidity= d.main.humidity;
                var dt= d.dt;
                var curr_temp = d.main.temp;
                var icon= d.weather[0].icon;
                $($(".daily-icon")[((count+1)/8)-1]).attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`); 
                $($(".daily-temp")[((count+1)/8)-1]).html(curr_temp + " &#176;F"); 
                $($(".daily-humidity")[((count+1)/8)-1]).text(humidity + "%"); 
                $($(".daily-date")[((count+1)/8)-1]).text(moment(dt, "X").format('L'));
            }

            count++; 
        }
        
       
      })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "finished" );
        });
}



function _log(str){
    console.log(str); 
}

function getUVData(url){

    $.get(url, (data, status) =>{
        var uv = data.value; 
        $("#main-uv-index").text(uv); 
    });
}
function addToLocalStorage(city){
    var cities = localStorage.getItem("cities"); 
    if (cities !== undefined && cities != null){
        
        var cities_arr = cities.split(",").map(x => x.toLowerCase()); 
        if (cities_arr.indexOf(city.toLowerCase()) == -1){
            //if does not exist... 
            localStorage.setItem("cities",cities + "," + city); 

            $("#search-history").html(""); 
            $("#search-history").append(`<li>${city}</li>`); 

            for (const c of cities_arr){
                $("#search-history").append(`<li>${c}</li>`); 
            }
        }
    }else {
        /// appending the cities
        localStorage.setItem("cities", city); 
        $("#search-history").append(`<li>${city}</li>`); 
    }
}

function populateExistings(){
    var cities = localStorage.getItem("cities"); 
    if (cities !== undefined && cities != null){
        /// then there are  existing cities 
        // don't repeat 
        var cities_arr = cities.split(",").map(x => x.toLowerCase()); 
           $("#search-history").html(""); 

            for (const c of cities_arr){
                $("#search-history").append(`<li class='search-results'><h5 onclick="$('#city-search').val('${c}')">${c}</h5></li>`); 
            }
        
    }
}
updateWeather("Seattle"); 

populateExistings();