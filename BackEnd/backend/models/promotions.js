const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)

var Currency = mongoose.Types.Currency
const Schema = mongoose.Schema

const promotionSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: ''
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('promotion', promotionSchema)