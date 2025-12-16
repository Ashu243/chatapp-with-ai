import mongoose from "mongoose";

import { db_Name } from "../../constants.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${db_Name}`)
        console.log(`MongoDb connected!! Host:${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection error !" ,error)
        process.exit(1)
    }
}

export default connectDb