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
    const ttl = process.env.TTL || 5;

    const diffInMins = parseInt((new Date() - upsertDateTime)/1000*60);

    return diffInMins < ttl;
}