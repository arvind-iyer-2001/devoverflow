import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI) {
    console.log("MISSING MONGODB_URI");
    throw Error("MISSING MONGODB_URI in environment");
  }
  if (isConnected) {
    console.log("MongoDB is already connected", mongoose.models);
    return mongoose;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "devflow",
    });
    isConnected = true;
    console.log("MongoDB is connected", db.models);
    return mongoose;
  } catch (err) {
    console.log("MongoDB Connection Failed", err);
    throw Error("MongoDB Connection Failed");
  }
};
