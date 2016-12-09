"use strict";

var FIREBASE_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
var ALGORITHM = 'RS256';
var ONE_HOUR_IN_SECONDS = 60 * 60;
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();
var projects = String(process.env.APP_KEYS).split(',').reduce((r,p) => {

    var parts = p.split(':');

    r[parts[0]] = parts[1].replace(/\\n/g, '\n');
    return r;
}, {});


app.use(bodyParser.text());
app.use(bodyParser.json());
app.post('/', function (req, resp) {

    var token = jwt.decode(req.body);
    console.log(token.user_id);
    resp.status(200).send(generateTokens(token.user_id));
});

app.listen(process.env.PORT || 2014, function () {
    console.log('Example app listening on port 3000!')
});

function generateTokens(uid) {

    return _.mapValues(projects, key => {
        return jwt.sign({
            uid: uid
        }, key, {
            audience: FIREBASE_AUDIENCE,
            expiresIn: ONE_HOUR_IN_SECONDS,
            algorithm: ALGORITHM
        });
    });
}