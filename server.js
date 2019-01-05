const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
var db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
MongoClient.connect('mongodb://root:root12@ds149344.mlab.com:49344/basicexpress', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   console.log("dfghjkl")
//   db.collection('quotes').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('index.ejs', {quotes: result})
//   })
// })


app.post('/registration', (req, res) => {
  if(req.body.email && req.body.username && req.body.password&& req.body.phonenumber){
  db.collection('user').findOne({username:req.body.username},(err,user)=>{
    if(err){
      throw err;
    }
    if(!user){
      db.collection('user').findOne({phonenumber:req.body.phonenumber},(err,phone)=>{
        if(err){
          throw err;
        }
        if(!phone){
          db.collection('user').findOne({email:req.body.email},(err,email)=>{
            if(err){
              throw err;
            }
            if(!email){
              var pass=bcrypt.hashSync(req.body.password,10)
              var obj={
                username:req.body.username,
                email:req.body.email,
                phonenumber:req.body.phonenumber,
                password:pass
              }
              db.collection('user').save(obj, (err, result) => {
                if (err) return console.log(err)
                console.log('saved to database')
                res.json({message:"data saved"})
              })
            }
            else{
              res.json({message:"email alredy exist.try whith other email"})
            }
          })
        }
        else{
          res.json({message:"phonenumber alredy exist.try whith other phonenumber"})
        }
      })
    }
    else{
      res.json({message:"username alredy exist.try whith other username"})
    }
  })
}
else{
  res.json({message:"email|password|username|phonenumber credentials missing.plzz check."});
}
})

app.post('/login', (req, res) => {
  db.collection('user').findOne({email:req.body.email}, function(err, userInfo){
    if(err){
      next(err);
    } 
    else{
      if(bcrypt.compareSync(req.body.password, userInfo.password)) {//secretKey
        // const token = jwt.sign({id: userInfo._id}, 'value-app-secret', { expiresIn: '1h' });
        var places_can_visit={
            1:"fort aguada",
            2:"calangute beach",
            3:"cagator beach",
            4:"chapora fort",
            5:"bogdeahwara temple",
            6:"kala academy",
            7:"reis magos fort",
            8:"anjuna flee market",
            9:"museum of goa",
            10:"arambol beach",
            11:"morjim beach",
            12:"miramar beach",
            13:"mapusa market",
            14:"bom jesu church",
            15:"se cathedral",
            16:"palolem beach",
            17:"goa chitra",
            18:"church convent of saint cajetan",
            19:"dudh sagar falls",
            20:"shri mangueshi temple."
        }
        res.json(places_can_visit);
      }
      else{
        res.json({status:"error", message: "Invalid email/password!!!", data:null});
      }
    }
  });
})

app.get('/logout', function(req, res){
  res.json({message:"logout successfull."})
});
