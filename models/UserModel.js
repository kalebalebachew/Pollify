const mongoose = require('mongoose')



UserSchema = new mongoose.Schema({

username:{
type: String,
required:True
},
email:{
    type: String,
    required:True
},
password:{
    type: String,
    required:True
}


})