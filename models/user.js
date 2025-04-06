const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const user = require('../../../../../Codes/collegeproject/models/user');
const Schema = mongoose.Schema;

const UserSchema= new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    purchased: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})
UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User',UserSchema);