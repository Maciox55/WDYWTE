var request = require('request');
var credentials = require('./credentials.js');
var http = require('http');
var https = require('https');
var randomGen = require('./randomNumber.js');
var util = require('./helperFunctions.js');
module.exports = {

    placeSearch : function(location,radius,filters,callback){
        var result;
        var coords
        request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location+'&radius='+radius+'&type=restaurant&keyword='+filters+'&key='+credentials.placesAPIKey,function(error,response,body){
            if(!error){
                result = JSON.parse(body);
                var random = randomGen.getRandomIntInclusive(0,result.results.length);   
                console.log(radius);
                
                callback(null,result);
            }
            else
            {
                console.log('error',error);
            }
            if(response.statusCode === 200){
                return result;
            }
            else{
                return "API request was not successful";

            }
            
        });
      
    },
    geocode : function(zip, callback){
        request('https://maps.googleapis.com/maps/api/geocode/json?address='+zip+'&key='+credentials.placesAPIKey,function(error,response,body){
            if(!error){
                result = JSON.parse(body);
                coords = {
                    lat:result.results[0].geometry.location.lat,
                    lon:result.results[0].geometry.location.lng
                }
                callback(null,coords);
            }
            else
            {
                console.log('error',error);
            }
            if(response.statusCode === 200){
                //console.log(coords.lat+','+coords.lon);
                
               return coords;
                //return coords.lat+','+coords.lon;
            }
            
            else{
                return "API request was not successful";

            }
        });
    },
    placeDetail: function(placeID, callback){
        request('https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeID+'&key='+credentials.placesAPIKey,function(error,response,body){
            if(!error)
            { 
                var resul = JSON.parse(body);
                console.log(resul);
                callback(null,resul);
            }
            else
            {
                console.log('error',error);
            }
            if(response.statusCode === 200){
                //console.log(coords.lat+','+coords.lon);
                
               return JSON.parse(body);
                //return coords.lat+','+coords.lon;
            }
            
            else{
                return "API request was not successful";

            }
        });
    }
}