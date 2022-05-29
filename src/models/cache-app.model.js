const mongoose = require('mongoose');
const schema = mongoose.Schema;

const appSchema = schema({
    key:{
        type: String,
        required: true
    },
    value:{
        type: String,
        required: true
    },
    upsertDateTime:{
        type: Date,
        required: true
    }
})

module.exports =mongoose.model('Cache', appSchema);