const cacheApp = require('../models/cache-app.model');
const cacheService = require('../services/cache-app.service')

exports.findAll = async (req, res) => {
    cacheApp.find({}, function(err, values) {
        let returnValues = [];
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {

            for(var i=0; i < values.length; i ++) {
                if(cacheService.checkTTL(values[i].upsertDateTime)) {
                    returnValues.push(values[i]);
                } else {
                    deleteSingleRecord({'req': req.body.key}, false);
                }
            }

            res.status(200).send(returnValues);
        }
    })
}

exports.findOne = async (req, res) => {
    cacheApp.findOne({'key': req.params.key}, function(err, value) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(cacheService.checkTTL(value.upsertDateTime)) {
                res.status(200).send(value);    
            } else {
                deleteSingleRecord({'req': req.body.key}, false);
                res.status(200).send('');
            }
        }
    });
}

exports.findKeys = async (req, res) => {
    cacheApp.find({}).select('key').exec(function(err, values){
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            res.status(200).send(values);
        }
    })
}

exports.createCache = async (req, res) => {

    const key = req.body.key;
    let bodyValue = req.body.value;

    if(! bodyValue) {
        bodyValue = cacheService.generateRandomString();
    }

    cacheApp.findOne({'key': key}, function(err, value) {

        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(value) {
                cacheApp.findOneAndUpdate({'key': req.body.key}, {'value': bodyValue, 'upsertDateTime': + new Date()}, function(err) {
                    if(err) {
                        console.log('err: ', err);
                        res.status(500).send('Internal Status error');
                    } else {
                        res.status(200).send('Updated successfully');
                    }
                })
            } else {
                cacheApp.create({'key': key, 'value': value, 'upsertDateTime': + new Date()}, function(err) {
                    if(err) {
                        console.log('err: ', err);
                        res.status(500).send('Internal Status error');
                    } else {
                        res.status(200).send('Inserted successfully');
                    }
                })
            }
        }

    });

}

exports.deleteOne = async (req, res) => {

    deleteSingleRecord({'req': req.body.key}, true);

}

exports.deleteAll = async (req, res) => {

    cacheApp.remove({}, function(err) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            res.status(200).send('Deleted All successfully');
        }
    })

}

function deleteSingleRecord(key, isDirect) {
    cacheApp.deleteOne(key, function(err) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(isDirect) {
                res.status(200).send('Deleted successfully');
            }
        }
    })
}