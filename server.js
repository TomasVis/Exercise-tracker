const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id: String,
    username: String,
    count: Number,
    log:[{
      description:String,
      duration: Number,
      date: String
    }]

  });

var userModel = mongoose.model('userModel', userSchema);

app.post("/api/exercise/new-user", function(req,res){

  if(!isNaN(req.body.dashorturl)){

    findShort(Number(req.body.dashorturl),function(err, data){
      console.log("inside findShort")
      if(err) { return (next(err)); }
      if(data ==null){
        res.send({url:"no such number"})
      } 
      else{
        res.redirect(data.originalUrl);
      }

    })
    
  }
  if(isNaN(req.body.dashorturl)){
    res.send("Short url must be a number");
  }

})

/*{"_id":"BJ5F5aEIH","username":"tomasit","count":4,"log":[{"description":"running","duration":20,"date":"Tue Sep 10 2019"},
{"description":"sleeping","duration":600,"date":"Wed Aug 21 2019"},{"description":"sleeping","duration":600,"date":"Fri Aug 09 2019"},
{"description":"running","duration":20,"date":"Thu Jan 01 1970"}]}*/

//I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
