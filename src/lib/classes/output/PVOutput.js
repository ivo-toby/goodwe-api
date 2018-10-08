var PVoutputAPI = require('pvoutput-nodejs');

var pvoutput = new PVoutputAPI({
    debug: false,

    apiKey: "xxx",
    systemId: "xxx"
});

module.exports = pvoutput;
