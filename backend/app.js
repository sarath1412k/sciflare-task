const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const  {faker}  = require('@faker-js/faker');
const { ObjectId } = require('mongodb')

const LocalStrategy = require('passport-local').Strategy;

const { User, Organization } = require('./model')

const session = require('express-session');
const app = express();
const port = 8000

app.use(cors())
app.use(express.json());
app.use(passport.initialize());
app.use(session({
    secret: '1234567890qwerty',
    resave: false,
    saveUninitialized: false
  }));


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username,password)
      User.collection.findOne({ email: username }).then((user) => {
        if (!user || password !== user.password) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }
          return done(null, user);
      }).catch((err) => {
        if (err) { return done(err); }
      })
    }
  ));
  
passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    User.findById(email, (err, user) => {
        done(err, user);
    });
});



 //sigup method to store account details 
app.put('/signup',(req,resp) => {
    const newUser = new User(req.body);
    newUser.save().then((res) => {
        resp.status(200).send('created successfully')
    })
    .catch((err) => {
        console.log(err)
        resp.status(400).send('bad request')
    })
})

// Authentication successful
app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }), (req, resp) => {
    User.collection.findOne({ email: req.body.username }).then((res) => {
        resp.json({ success: true, message: 'Login successful',id:res._id })
    })
    .catch((err) => {
        resp.status(400).send('bad request')
    })
    
});

// If authentication fails send a failure response
app.get('/login-failure', (req, resp) => {
    resp.status(401).json({ success: false, message: 'Incorrect email or password' });
});


// initailiaze data with faker and get list of organizations
app.get('/organization-list',async(req,resp) => {
    let result =await Organization.find({}).exec()
    const users = [];
    if(result.length < 10){
        for (let i = 0; i < 10; i++) {
            users.push({
              name: faker.company.name(),
              email: faker.internet.email(),
              address: faker.location.streetAddress(),
              description: faker.company.catchPhrase(3),
              contactInformation:faker.phone.number(),
              foundingDate:faker.date.past({ years: 10 })
            });
          }
    }
    await Organization.insertMany(users).then((res) => {
        console.log('inserted successfully')
    }).catch((err) => {
        console.log('internal server error')
    }) 
    await Organization.aggregate([{$project:{_id:0,name:1}}])
    .then((res) => {
        resp.status(200).send(res)
    })
    .catch((err) => {
        resp.status(400).send('internal server error')
    })
})

//fetch the details for data table based on role
app.get('/details',(req,resp) => {
    const id = req.query.id
    console.log(id)
    User.aggregate([
        {$match:{_id:new ObjectId(id)}},
        {$project:{
            role:1,
            name:1,
            Organization:1,
            email:1
        }}])
    .then(async(res) => {
        if(res[0].role === 'admin'){
            let organization = await Organization.find({})
            let users = await User.aggregate([{$match:{$or:[{role:"admin"},{role:"user"}]}},{$project:{password:0}}])
            console.log(users)
            let combined = [...organization,...users]
            resp.status(200).send(combined)
        }
        else{
            resp.send(res)
        }       
    }).catch((err) => {
        console.log(err)
        resp.status(400).send('bad request')
    })   
})

//delete organization method
app.delete('/delete/:id',(req,resp) => {
    const id = req.params.id
    Organization.deleteOne({_id:new ObjectId(id)})
    .then((res) => {
         resp.send('deleted successfully')
    })
    .catch((err) => {
        console.log(err)
        resp.status(400).send('bad request')
    })

})


  
  
mongoose.connect('mongodb://localhost:27017/tech_company');

app.listen(port,() => console.log(`server is running on ${port}`))