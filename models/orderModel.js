const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

orderItems:[
    {
   product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
   } ,
    

quantity:{
    type:Number,
    required:true
},
price:{
    type:Number,
    required:true
}
}
],

},

{ versionKey:false,
    timestamps:true
}
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);