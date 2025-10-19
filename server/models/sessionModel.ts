import mongoose from "mongoose";



const sessionSchema = new mongoose.Schema({
  thread_id: {
    type: String,
    required: true,
    unique: true,
    },

   messages: [
     {
        role: {type: String, required: true},
        content: {type: String, required: true},
       
     }
    ],
 
}, {timestamps: true});



const Session = mongoose.model("Session", sessionSchema)


export default Session;
