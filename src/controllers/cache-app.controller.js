const cacheApp = require('../models/cache-app.model');
const cacheService = require('../services/cache-app.service')

exports.findAll = async (req, res) => {
    cacheApp.find({}, function(err, data) {
        let returnValues = [];
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {

            for(var i=0; i < data.length; i ++) {
                if(cacheService.checkTTL(data[i].upsertDateTime)) {
                    returnValues.push(cacheService.formOutput(data[i].key, data[i].value));
                } else {
                    deleteSingleRecord(res, {'req': req.body.key}, false);
                }
            }

            res.status(200).send(returnValues);
        }
    })
}

exports.findOne = async (req, res) => {
    cacheApp.findOne({'key': req.params.key}, function(err, data) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(cacheService.checkTTL(data.upsertDateTime)) {
                res.status(200).send(cacheService.formOutput(data.key, data.value));    
            } else {
                deleteSingleRecord(res, {'req': req.body.key}, false);
                res.status(200).send('');
            }
        }
    });
}

exports.findKeys = async (req, res) => {
    cacheApp.find({}).select('key').exec(function(err, data){
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            res.status(200).send(data);
        }
    })
}

exports.createCache = async (req, res) => {

    const key = req.body.key;
    let bodyValue = req.body.value;

    if(! bodyValue) {
        bodyValue = cacheService.generateRandomString();
    }

    cacheApp.findOne({'key': key}, function(err, data) {

        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(data) {
                cacheApp.findOneAndUpdate({'key': req.body.key}, {'value': bodyValue, 'upsertDateTime': + new Date()}, function(err) {
                    if(err) {
                        console.log('err: ', err);
                        res.status(500).send('Internal Status error');
                    } else {
                        res.status(200).send('Updated successfully');
                    }
                })
            } else {
                cacheApp.create({'key': key, 'value': bodyValue, 'upsertDateTime': + new Date()}, function(err) {
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

    deleteSingleRecord(res, {'req': req.body.key}, true);

}

exports.deleteAll = async (req, res) => {

    cacheApp.deleteMany({}, function(err) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            res.status(200).send('Deleted All successfully');
        }
    })

}

function deleteSingleRecord(res, key, isDirect) {
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