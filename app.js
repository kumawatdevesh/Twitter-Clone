const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const loginRouter = require('./routes/login-register');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const Register = require('./util/register');
const MongoDBStore = require('connect-mongodb-session')(session);
const tweets = require('./routes/tweets');
const multer = require('multer');

const MONGODB_URI = 'mongodb+srv://kumawatdevesh99:kumawatdevesh99@cluster0-tpp9z.mongodb.net/register';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) =>  {
    cb(null, new Date().toISOString + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true);
  }else{
    cb(null, false);
  }
};
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({secret: 'my scret',
 resave: false,
 saveUninitialized: false,
 store: store
  }
));

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  Register.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err);
  });
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
//app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(loginRouter);
app.use(tweets);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
});

