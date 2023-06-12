var fs = require("fs");
// var noble = require('../node_modules/noble/index.js');
var noble = require('noble-mac');


var deviceList = {};
var scanResult = {};
noble.on('discover', function (peripheral) {
    if (peripheral.advertisement.localName !== 'device_name') return;
    scanResult[peripheral.address] = deviceList[peripheral.address]||"";
});

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning([],true);
    deviceList = JSON.parse(fs.readFileSync(__dirname+"/../data/"+"deviceList.json"));
  } else {
    noble.stopScanning();
  };

setTimeout(() => {
    noble.stopScanning();
}, 5000); 

setTimeout(() => {
    console.log(JSON.stringify(scanResult));
    process.exit(0);
}, 6000);

});