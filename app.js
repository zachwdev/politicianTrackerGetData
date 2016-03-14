var request = require('request'),
    mongodb = require('mongodb').MongoClient,
    objectID = require('mongodb').ObjectID,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var url = 'mongodb://localhost:27017/politicianTracker';

request({
        url: 'https://api.propublica.org/campaign-finance/v1/2016/president/totals.json',
        headers: {
            'X-API-Key': 
        }
    },
    function (error, res, body) {
        if (!error && res.statusCode == 200)
            data = JSON.parse(body);
        dbData = data.results
        console.log(dbData);
        var url = 'mongodb://localhost:27017/politicianTracker';
        mongodb.connect(url, function (err, db) {

            var collection = db.collection('politicians');
            collection.insert(dbData);
        })

    });

mongodb.connect(url, function (err, db) {
    var politicianDetails = {}
    var collection = db.collection('politicians');
    collection.find({}).toArray(
        function (err, results) {
            for (var i = 0; i < results.length; i++) {
                var reqUrl = 'https://api.propublica.org/campaign-finance/v1/2016/president/candidates/' + results[i].committee_id + '.json';
                request({
                        url: reqUrl,
                        headers: {
                            'X-API-Key': 'Vt18WkeDJqbPeDNl8YWD5y91W3GtcAo7SZaMTEW9'
                        }
                    },
                    function (error, res, body) {
                        if (!error && res.statusCode == 200)
                            data = JSON.parse(body);
                        dataArray = data.results;
                        dbData = dataArray[0]
                        politicianDetailsInsert(dbData)
                    });

            };
        });
});

function politicianDetailsInsert(dbData) {
        var url = 'mongodb://localhost:27017/politicianTracker';
        mongodb.connect(url, function (err, db) {

            var collection = db.collection('politicianDetails');
            collection.insert(dbData);
        })
}