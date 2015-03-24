var express = require('express');
var router = express.Router();
var fs = require('fs');
var nconf = require('nconf');
var url = require('url');
var parseHttpHeader = require('parse-http-header');
var request = require('request');
/**
 * Defines route for root
 */
router.get('/', function (req, res) {

	// Render PubNub config for client-side javascript to reference
  res.render('index', {
		farbic_consumer_key: nconf.get('FABRIC_CONSUMER_KEY'),
		ga_tracking_id: nconf.get('GA_TRACKING_ID')
	});
});

/**
 * GET Starts stream
 */
router.post('/verify', function (req, res) {

	var verfied = true;
	var messages = [];

	// verify oauth_consumer_key
	var oauth_consumer_key = parseHttpHeader(req.body.authHeader)['OAuth oauth_consumer_key'].replace(/"/g,'')
	if (oauth_consumer_key != nconf.get('FABRIC_CONSUMER_KEY')) {
		verfied = false;
		messages.push('Consumer keys doe not match.');
	}

	// verify hostname
	var hostname = url.parse(req.body.apiUrl).hostname;
	if (hostname != 'www.digits.com' && hostname != 'api.twitter.com') {
		verfied = false;
		messages.push('Invalid API hostname.');
	}

	var options = {
		url: req.body.apiUrl,
		headers: {
			'Accept' : '*/*',
			'Connection' : 'close',
			'User-Agent' : 'Node authentication',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': 0,
			'Authorization': req.body.authHeader,
			'Host': hostname
		}
	};

	console.log('-- OPTIONS ----------------------');
	console.log(options);

	request.post(options, function (error, resp, body) {
	  console.log('-- ERROR ----------------------');
	  console.log(error);
	  console.log('-- BODY -----------------------');
	  console.log(body);

		res.send({
			verified: verfied,
			resp: resp,
			messages: messages
		});
	});


});


module.exports = router;
