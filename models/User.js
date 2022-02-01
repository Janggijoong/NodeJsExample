const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },

    email: {
        type: String,
        trim: true,
        unique: 1
    },

    password: {
        type: String,
        maxlength: 100
    },

    lastname: {
        type: String,
        maxlength: 50
    },

    role: {
        type: Number,
        default: 0
    },

    image: String,

    token: {
        type: String
    },

    tokenExp: {
        type: Number
    }

})

//저장하기전에
userSchema.pre('save', function(next){
    //user = userSchema
    var user = this;

    //비밀번호 수정시
    if (user.isModified('password')){
        //비밀번호 암호화 작업
        bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    var user = this;
    console.log("USER", user)
    console.log(plainPassword)
    bcrypt.compare(plainPassword, user.password, function(err, isMatch) {
        console.log("plainPassword", plainPassword);
        console.log("user.password", user.password);
        console.log(isMatch)
        if (err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    console.log('user_id', user._id)
    // jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'token')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }