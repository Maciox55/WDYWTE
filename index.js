var request = require('request');
var http = require('http');
var https = require('https');
var express = require('express');
var randomGen = require('./randomNumber.js');
var credentials = require('./credentials.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'}); 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')(credentials.cookieSecret);
var userInfo = require('./models/userInfo');
var app = express();
var respon;
var userLocation;

app.set('port',process.env.PORT || 3000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use(require('cookie-parser')(credentials.cookieSecret));

app.get('/', function(req,res){
	console.log('homepage');
	res.render('home', {title: 'What Do you want to eat?'});
});
//app.get('/enterzip',function(req,res){
	//res.render('result',{title: 'Result'});
//});
app.post('/enterzip',function(req,res){
	userLocation = req.body.zip;
	console.log('ZIP CODE: ' + userLocation);
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+near'+userLocation+'&key=AIzaSyCuB4WwqsJP1kIPTMFfGvPlu68Hh6GWH-U',function(error,response,body){
		if(!error){
			console.log('status Code',response.statusCode);
			respon = JSON.parse(body);
		}
		else{
			console.log('error',error);
		}
		if(response.statusCode === 200){
			var random = randomGen.getRandomIntInclusive(0,respon.results.length);
			console.log(random);
			res.render('result',{
				placeName:respon.results[random].name,
				placeAddress:respon.results[random].formatted_address,
				placeRating:respon.results[random].rating,
				placePricePoint:respon.results[random].price_level,
				placeURL:'https://www.google.com/maps/embed/v1/place?key='+credentials.placesAPIKey+'&q=place_id:'+respon.results[random].place_id
			});
		}else{
			res.render('home');

		}
	});
});
app.use(function(req,res){
	res.render('404',{title:'Page not found'});
});

app.listen(3000,function(){
    console.log('Express started in ' + app.get('env')+' mode '+ 'on localhost:' + app.get('port') + ' Ctrl+C to Terminate');

});