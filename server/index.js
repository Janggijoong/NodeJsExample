const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json())
//cookie
app.use(cookieParser())

const mongoose = require('mongoose');
const read = require('body-parser/lib/read');
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello', (req, res) => res.send('hello world'))

app.post('/api/users/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 DB에 INSERT
  
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    // console.log(err)
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청된 이메일이 DB에 있을 시 비밀번호가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(req.body.password)
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 맞지 않습니다."
        })

      //비밀번호 맞다면 토큰 생성.
      user.generateToken((err, user) => {
        // console.log(err)
        if(err) return res.status(400).send(err);

        res.cookie("auth", user.token)
        .status(200)
        .json({
            loginSuccess: true,
            userId: user._id
        })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

  //여기 왔다는 말은 Authentication이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  console.log("req.user._id", req.user._id)
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if(err) return res.json({ success: false, err});
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})