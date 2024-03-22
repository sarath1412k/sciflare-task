const mongoose = require('mongoose')




const organizationSchema = mongoose.Schema({
    name: String,
    email:String,
    adress: String,
    description: String,
    contactInformation:String,
    FoundingDate:Date
  },{versionKey:false,collection:'organization'});
  

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
    },
    role:{
        type : String,
        required:true
    },
    organization:{
        type:String,
        required:true
    }
    },{versionKey:false,collection:'user'});
  
  const User = mongoose.model('user',userSchema)
  const Organization = mongoose.model('organization',organizationSchema)


  module.exports={ User, Organization }