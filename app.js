const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  );
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(logger('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use('/images',express.static(path.join('Server/images')));
app.use(cookieParser());

//"mongodb://localhost:27017/Eduatlas"
mongoose.connect("mongodb://localhost:27017/Eduatlas"
 , {   
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
 })
.then(()=>{
  app.listen(port, () => console.log('Listening on', port));
  console.log('Connected to database');
})
.catch((reason)=>{
  console.error('Connection failed', '\n');
  console.log(reason);
});
console.log('=================================================')

app.use('/', indexRouter);
app.use('/users', require('./routes/users'));

app.use('/institute/student', require('./routes/student'));
app.use('/institute', require('./routes/institute'));

module.exports = app;
