require('dotenv').config();

exports.generateRandomString = function() {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let reqLength = process.env.RS_LENGTH || 6;
    for ( var i = 0; i < reqLength; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

exports.checkTTL = function(upsertDateTime) {

    const diffInMins = parseInt((new Date().getTime() - upsertDateTime.getTime())/(1000 * 60) % 60);

    return diffInMins < (process.env.TTL || 20);
}

exports.formOutput = function(key, value) {
    return {'key': key, 'value': value};
}

exports.checkMaxRecords = function(listSize) {
    return listSize - (process.env.MAX_RECORDS || 5);
}