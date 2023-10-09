const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    email : {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //Add Username and Password fields into UserSchema with passport, along with support of LocalStrategy

module.exports = mongoose.model('User', UserSchema)