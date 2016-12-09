"use strict";

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var FirebaseTokenGenerator = require("firebase-token-generator");
var app = express();
var projects = String(process.env.APP_KEYS).split(',').reduce((r,p) => {

    var parts = p.split(':');

    r[parts[0]] = parts[1];
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

    return _.mapValues(projects, token => {
        let tokenGenerator = new FirebaseTokenGenerator(token);
        return tokenGenerator.createToken(
            {
                uid: uid,
                // this is just and example of additional data that can be embedded
                agent: true
            },
            {admin: false}
        );
    });
}