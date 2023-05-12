const mongoose = require('mongoose')

const Schema = mongoose.Schema

const favoriteSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dishes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'dish',
        required: true
    }
    }, {
    timestamps: true
})

module.exports = mongoose.model('Favorite', favoriteSchema)
