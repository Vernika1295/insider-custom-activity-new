"use strict";

var jwtLib = require('jwt-simple');
var packageJson = require('../../package.json');

var VERSION = packageJson.version;

var JwtDecoder = module.exports = function JwtDecoder( options ) {
    this.options = options || {};
};

JwtDecoder.VERSION = VERSION;

JwtDecoder.prototype.decode = function( req ) {
    var jwtObj = {};
    var jwt = req.body;

    try {
        console.log("jwt key->"+this.options.appSignature);
        var decoded = jwtLib.decode(jwt, this.options.appSignature);
        jwtObj.full = decoded;
    } catch( ex ) {
        console.error( 'Decoding failed for jwt: ' + jwt );
        console.error( 'Exception: ' + ex );
    }

    return jwtObj;
}; 
