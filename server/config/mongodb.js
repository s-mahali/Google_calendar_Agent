import mongoose from "mongoose";

export const connectDB = async () => {
    try {
       
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if(connection){
            console.log("Connected to MongoDB");
        }else{
            process.exit(1);
        }
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

