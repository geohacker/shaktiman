#!/usr/bin/env node

var overpass = require('query-overpass');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var raju = require('raju');
var AWS = require('aws-sdk');
var MapboxClient = require('mapbox');

if (!argv.query || !argv.MapboxAccessToken || !argv.mapid) {
    usage();
    process.exit(1);
}

var input = argv.query;
var accessToken = argv.MapboxAccessToken;
var mapid = argv.mapid;
var user = mapid.split('.')[0];
var id = mapid.split('.')[1];
var name = argv.name;
var client = new MapboxClient(accessToken);

var query = fs.readFileSync(__dirname + '/' + input, {encoding: 'utf-8'});
process.stdout.write('Querying overpass...' + '\n');
overpass(query, function(err, data) {
    if (err) throw err;
    process.stdout.write('Results:' + data.features.length + ' features\n');
    process.stdout.write('Cleaning up geojson...' + '\n');
    data.features.forEach(function(feature) {
        var props = feature.properties;
        var keys = Object.keys(props);
        keys.forEach(function(key) {
            if (props[key] instanceof Array) {
                props[key].forEach(function(prop) {
                    flatten(prop, key, props);
                });
            }

            if (props[key] instanceof Object) {
                flatten(props[key], key, props);
            }
        });
    });
    var geojson = JSON.stringify(raju(data));
    fs.writeFileSync('query.geojson', geojson);
    process.stdout.write('Uploading to Mapbox...' + '\n');
    uploadData(__dirname + '/query.geojson', accessToken, mapid, user);
});


function uploadData(file, accessToken, mapid, user) {

 client.createUploadCredentials(function(err, credentials) {

    if (err) throw err;
    console.log('credentials', credentials);
    var s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: 'us-east-1'
    });

    s3.putObject({
        Bucket: credentials.bucket,
        Key: credentials.key,
        Body: fs.createReadStream(file)
    }, function(err, resp) {
        if (err) throw err;
        console.log('resp', resp);
    });

    client.createUpload({
        tileset: [mapid.split('.')[0], mapid.split('.')[1]].join('.'),
        url: credentials.url
    }, function(err, upload) {
        if (err) throw err;
        getProgressStatus(upload.id);
    });
});
}

function getProgressStatus(uploadId) {

    client.readUpload(uploadId, function(err, upload) {

        if (upload.progress < 1) {
            getProgressStatus(uploadId);
        }
        else {
            console.log('Upload Done!');
            process.exit(0);
        }
    });
}

function flatten(obj, parentKey, properties) {
    var objectLength = obj.length;
    Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof Object) {
            flatten(obj[key], parentKey + '_' + key, properties);
            delete properties[parentKey];
        }
        properties[parentKey + '_' + key] = obj[key];
        delete properties[parentKey];
    });
}

function usage() {
    process.stdout.write('shaktiman --query path_to_overpass_query \n --MapboxAccessToken \n --mapid \n --name \n');
}
