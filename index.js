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
var randomGen = require('./randomNumber.js');

var requests = require('./requests');
var app = express();
var results;
var locat;
var query;
var respon;
var zip;

app.set('port',(process.env.PORT || 3000));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('partialsDir',__dirname+'/views/partials/');
app.use(express.static(__dirname+'/public'));
app.use(session({
	secret:credentials.cookieSecret,
	store:new MemoryStore(),
	cookie:{maxAge:60000}
}));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/', function(req,res){
	if(req.session.visited = false || req.session.results == undefined){
		req.session.visited = true;
		console.log('homepage');
		res.render('home', {title: 'What Do you want to eat?'});
	}else{
		res.render('results',{title:'Results',
		results: req.session.results.results,

		});
	}
});
app.get('/submit',function(req,res){
	res.render('result',{title: 'Result'});
});
app.post('/submit',function(req,res,next){
	req.session.zip = req.body.zip;
	req.session.filters = req.body.filter;
	req.session.priceRange = req.body.priceRange;
	req.session.minRating = req.body.minRating;
	req.session.radius = parseInt(req.body.radius,10);
	locat = requests.geocode(req.body.zip,function(err,result){
		if(err)
		{
			console.log('Something went wrong'+ ' Result: ' + result);
			res.render('Something Went Wrong', '404');
		}
		else{
			req.session.location = result;
			console.log(req.session.location.lat+','+req.session.location.lon);
			next();
		}
	});
	//query = requests.placeSearch(locat,req.body.filter,1000);
	
},function(req,res){
	requests.placeSearch(req.session.location.lat+','+req.session.location.lon,req.session.radius*1609.344,'pizza',function(err,ret){
		if(err){
			console.log('Something went wrong');
			res.render('Something Went Wrong', '404');	
		}
		else{
			var results = ret;
			req.session.results = ret;
			req.session.random = randomGen.getRandomIntInclusive(0,results.results.length);
			//Later render the Results instead of single one, have to make a partial and Results view first
			//res.render('result',{title:'Test',
			//placeName:ret.results[req.session.random].name,
			//placeAddress:ret.results[req.session.random].formatted_address,
			//placeRating:ret.results[req.session.random].rating,
			//placePricePoint:ret.results[req.session.random].price_level,
			//placeURL:'https://www.google.com/maps/embed/v1/place?key='+credentials.placesAPIKey+'&q=place_id:'+ret.results[req.session.random].place_id});
			res.render('results',{title:'What we found',
			results: req.session.results.results,

			});
		}
	});
});

app.post('/result/:placeID',function(req,res){
	console.log(req.params.placeID);
	//req.sessions.placeID = req.params.placeID;
	//ss
	requests.placeDetail(req.params.placeID,function(err,ret){
		if(err){
			res.render('Something Went Wrong', '404');	
		}else{
			res.render('result',{title:'More Detail',
				results: req.session.results.results,
				placeName:ret.result.name,
				placeAddress:ret.result.formatted_address,
				placeRating:ret.result.rating,
				placePricePoint:ret.result.price_level,
				placeURL:'https://www.google.com/maps/embed/v1/place?key='+credentials.placesAPIKey+'&q=place_id:'+ret.result.place_id
			});
		}
	});
});

app.post('/resubmit',function(req,res){
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+req.session.filters+'+near'+req.session.location+'&key=AIzaSyCuB4WwqsJP1kIPTMFfGvPlu68Hh6GWH-U',function(error,response,body){
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
		req.session.filters = req.body.filters;
		console.log(JSON.parse(req.body.pos));
		request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+req.session.filters+'+near'+req.body.pos.lat+','+req.body.pos.long+'&key=AIzaSyCuB4WwqsJP1kIPTMFfGvPlu68Hh6GWH-U',function(error,response,body){
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

app.use(function(req,res){
	res.render('404',{title:'Page not found'});
});

app.listen(app.get('port'),function(){
    console.log('Express started in ' + app.get('env')+' mode '+ 'on localhost:' + app.get('port') + ' Ctrl+C to Terminate');

});