var request = require('request-promise');
// import * as request from "request-promise";

async function BLEconnect() {
// function BLEconnect() {

	// This variable contains the data
	// you want to send
	// var data = "Connect"
	var data = "A"

	var options = {
		method: 'POST',

		// uri: 'http://172.20.10.10:5000/arraysum',
		uri: 'http://172.20.10.4:9999/bluetooth',
		body: data,
		json: true
	};

	console.log("Connecting")

	var sendrequest = await request(options)
	// The parsedBody contains the data
	// sent back from the Flask server
	.then(function (parsedBody) {
		console.log(parsedBody);
		
		// You can do something with
		// returned data
		let result;
		result = parsedBody['result'];
		console.log("Sum of Array from Python: ", result);
	})
	.catch(function (err) {
		console.log(err);
	});

	console.log("Connected")
}

// BLEconnect();
export default BLEconnect;
