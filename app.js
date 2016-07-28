// -------------------------------------------------- //
// Module Dependencies
// -------------------------------------------------- //
var express = require('express');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var http = require('http');
var request = require('request');
var path = require('path');
var config = require('./config.js');              // Get our config info (app id and app secret)
var sys = require('util');
//var bodyParser = require('body-parser');
var STATE_COOKIE = "TABLEAU_STATE_COOKIE";

var app = express();

// -------------------------------------------------- //
// Express set-up and middleware
// -------------------------------------------------- //
app.set('port', (process.env.PORT || config.PORT));
//app.use(bodyParser.json());
app.use(cookieParser());                                    // cookieParser middleware to work with cookies
app.use(express.static(__dirname + '/public'));

// -------------------------------------------------- //
// Variables
// -------------------------------------------------- //
var clientID = config.CLIENT_ID;
var clientSecret = config.CLIENT_SECRET;
console.log(clientID);
console.log(clientSecret);
var redirectURI = config.HOSTPATH + ":" + config.PORT + config.REDIRECT_PATH;
var scope = config.SCOPE;

// -------------------------------------------------- //
// Routes
// -------------------------------------------------- //

app.get('/', function(req, res) {
  console.log("got here");
  res.redirect('/index.html');
});

// This route is hit once Foursquare redirects to our
// server after performing authentication
app.get('/redirect', function(req, res) {
  // get our authorization code
  authCode = req.query.code;
  console.log("Auth Code is: " + authCode);

  // Set up a request for an long-lived Access Token now that we have a code
  var requestObject = {
      'client_id': clientID,
      'redirect_uri': redirectURI,
      'client_secret': clientSecret,
      'code': authCode,
      'grant_type': 'authorization_code'
  };

  var token_request_header = {
      'Content-Type': 'application/x-www-form-urlencoded'
  };

  // Build the post request for the OAuth endpoint
  var options = {
      url: 'https://www.googleapis.com' + '/oauth2/v4/token',
      form: requestObject,
      headers: token_request_header
  };

  // Make the request
  request.post(options, function (error, response, body) {
    if (!error) {
      // We should receive  { access_token: ACCESS_TOKEN }
      // if everything went smoothly, so parse the token from the response
      console.log('request.body: ' + request.body);
      console.log('Status Code: ' + response.statusCode);
      body = JSON.parse(body);
      console.log('body: ' + body);
      var accessToken = body.access_token;
      var refreshToken = body.refresh_token;
      var expiresIn = body.expires_in;
      var idToken = body.id_token;
      console.log('accessToken: ' + accessToken);
      console.log('refreshToken: ' + refreshToken);
      console.log('expiresIn: ' + expiresIn);
      console.log('idToken: ' + idToken);
      var status = {
        class: "bigquery",
        savedState: {
          authSecrets: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: expiresIn,
            idToken: idToken
          },
          authMatchingAttrs: {
            clientId: clientID
          },
        }
      };


      // Set the token in cookies so the client can access it
      res.cookie('accessToken', accessToken, { });
      res.cookie('refreshToken', refreshToken, { });
      res.cookie('expiresIn', expiresIn, { });
      res.cookie('idToken', idToken, { });

      // Head back to the WDC page
      // Next make a request to get some user info
      request({
        method: 'GET',
        url: "https://www.googleapis.com/oauth2/v3/userinfo?id_token=" + idToken,
        headers : {
          'Authorization': 'Bearer ' + accessToken
        }
      },
      function(error, response, body) {
        if(!error)
        {
            console.log(body);
            var userInfoBody = JSON.parse(body);
            //status.savedState.authMatchingAttrs.userId = userInfoBody.id;
            //status.savedState.authMatchingAttrs.userName = userInfoBody.name;
            status.savedState.authMatchingAttrs.username = userInfoBody.email;
            console.log("GOOGLE COOKIE**** + \n" + JSON.stringify(status));
            res.cookie(STATE_COOKIE, JSON.stringify(status), { });
            res.redirect('/');
        }
        else
        {
            console.log(error);
        }
      });
    } else {
      console.log(error);
    }
  });
});

app.get("/Landing.html", function(req, res) {
  res.sendFile(__dirname + '/Landing.html')
})

// -------------------------------------------------- //
// Create and start our server
// -------------------------------------------------- //
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
