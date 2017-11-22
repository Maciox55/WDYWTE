var request = require('request');
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var randomGen = require('./randomNumber.js');
var credentials = require('./credentials.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'}); 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')(credentials.cookieSecret);
var userInfo = require('./models/userInfo');
var placeObj = require('./models/placeObj');
var session = require('express-session');
var MemoryStore = require('session-memory-store')(session);
var app = express();
var respon;
var zip;

app.set('port',process.env.PORT || 3000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname+'/public'));
app.use(session({
	secret:credentials.cookieSecret,
	store:new MemoryStore()
}));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/', function(req,res){
	if(req.session.visited = false || req.session.respon == undefined){
		req.session.visited = true;
		console.log('homepage');
		res.render('home', {title: 'What Do you want to eat?'});
	}else{
		res.render('result',{title:'Test',
		placeName:req.session.respon.results[req.session.random].name,
		placeAddress:req.session.respon.results[req.session.random].formatted_address,
		placeRating:req.session.respon.results[req.session.random].rating,
		placePricePoint:req.session.respon.results[req.session.random].price_level,
		placeURL:'https://www.google.com/maps/embed/v1/place?key='+credentials.placesAPIKey+'&q=place_id:'+req.session.respon.results[req.session.random].place_id
		});
	}
});
app.get('/submit',function(req,res){
	res.render('result',{title: 'Result'});
});
app.post('/submit',function(req,res){
	req.session.location = req.body.zip;
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+near'+req.session.location+'&key=AIzaSyCuB4WwqsJP1kIPTMFfGvPlu68Hh6GWH-U',function(error,response,body){
		if(!error){
			console.log('status Code',response.statusCode);
			respon = JSON.parse(body);
			req.session.respon = respon;
			var random = randomGen.getRandomIntInclusive(0,respon.results.length);
		}
		else{
			console.log('error',error);
		}
		if(response.statusCode === 200){
			req.session.random = random;
			res.render('result',{title:'Test',
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
app.post('/resubmit',function(req,res){
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+near'+req.session.location+'&key=AIzaSyCuB4WwqsJP1kIPTMFfGvPlu68Hh6GWH-U',function(error,response,body){
		if(!error){
			console.log('status Code',response.statusCode);
			respon = JSON.parse(body);
			req.session.respon = respon;
			var random = randomGen.getRandomIntInclusive(0,respon.results.length);
		}
		else{
			console.log('error',error);
		}
		if(response.statusCode === 200){
			req.session.random = random;
			res.render('result',{title:'Test',
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
app.post('/geolocation',function(req,res){
		var locat = req.body;
		console.log(locat);
		res.send('Location Received');
	
});

app.use(function(req,res){
	res.render('404',{title:'Page not found'});
});

app.listen(3000,function(){
    console.log('Express started in ' + app.get('env')+' mode '+ 'on localhost:' + app.get('port') + ' Ctrl+C to Terminate');

});