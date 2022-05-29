const cacheApp = require('../models/cache-app.model');
const cacheService = require('../services/cache-app.service')

exports.findAll = async (req, res) => {
    cacheApp.find({}, function(err, data) {
        let returnValues = [];
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {

            const dataLength = data.length;
            for(var i=0; i < dataLength; i ++) {
                if(cacheService.checkTTL(data[i].upsertDateTime)) {
                    returnValues.push(cacheService.formOutput(data[i].key, data[i].value));
                } else {
                    deleteSingleRecord(res, {'req': req.body.key}, false);
                }
            }

            /* 
            * If we have records greater than the accepted value
            * We will calculate the exceeding number of records.
            * We will delete the oldest records, so we arrange by asc and remove the exceeding records
            */
           const exceedingRecords = cacheService.checkMaxRecords(dataLength);
            if(exceedingRecords > 0) {
                const query = cacheApp.find({}).sort({'upsertDateTime': 'asc'}).limit(exceedingRecords).select('key');
                query.exec(function(err, data) {
                    if(err) {
                        console.log('err: ', err);
                    } else {
                        for(var i=0; i<data.length; i++) {
                            deleteSingleRecord(res, {'req': data.key}, false);
                        }
                    }
                })

            }

            res.status(200).send(returnValues);
        }
    })
}

exports.findOne = async (req, res) => {
    const key = req.params.key;
    cacheApp.findOne({'key': key}, function(err, data) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(data) {
                if(cacheService.checkTTL(data.upsertDateTime)) {
                    console.log('Cache hit');
                    res.status(200).send(cacheService.formOutput(data.key, data.value));    
                } else {
                    deleteSingleRecord(res, {'req': key}, false);
                    res.status(200).send('');
                }   
            } else {
                console.log('Cache miss');
                const bodyValue = generateRandomString(req.params.value); 
                createSingleRecord(res, {'key': key, 'value': bodyValue, 'upsertDateTime': + new Date()}, true);
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

    let loop = 0;
    const body = req.body;
    const bodyLength = body.length;

    for(var i=0; i <bodyLength; i++) {
        const key = body[i].key;
        const bodyValue = generateRandomString(body[i].value);
        cacheApp.findOne({'key': key}, function(err, data) {
            loop ++; 
            if(err) {
                console.log('err: ', err);
                res.status(500).send('Internal Status error');
            } else {
                if(data) {
                    cacheApp.findOneAndUpdate({'key': key}, {'value': bodyValue, 'upsertDateTime': + new Date()}, function(err) {
                        if(err) {
                            console.log('err: ', err);
                            res.status(500).send('Internal Status error');
                        } else {
                            res.status(200).send('Updated successfully');
                        }
                    })
                } else {
                    createSingleRecord(res, {'key': key, 'value': bodyValue, 'upsertDateTime': + new Date()}, (loop === bodyLength));
                }
            }
    
        });   
    }

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

function createSingleRecord(res, body, isFinalRecord) {
    cacheApp.create(body, function(err) {
        if(err) {
            console.log('err: ', err);
            res.status(500).send('Internal Status error');
        } else {
            if(isFinalRecord) {
                res.status(200).send('New Data Inserted successfully');
            }
        }
    })
}

function generateRandomString(value) {
    let bodyValue = value;

    if(! bodyValue) {
        bodyValue = cacheService.generateRandomString();
    }

    return bodyValue;
}