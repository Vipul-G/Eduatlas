const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const instituteRouter = require('./routes/institute')

const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('Server/images')));
app.use(cookieParser());



mongoose.connect( "mongodb://localhost/Eduatals" , {   
  useNewUrlParser: true,
  useUnifiedTopology: true
 })
.then(()=>{
  console.log('==========================================================================')
  app.listen(port, () => console.log('Listening on', port));
  console.log('Connected to database');
})
.catch((reason)=>{
  console.error('Connection failed', '\n');
  console.log(reason);
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/institute', instituteRouter);

module.exports = app;
