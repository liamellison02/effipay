import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Extend global to cache the connection properly in TypeScript
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

// Ensure global.mongoose is defined
global.mongoose = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    }).catch((error) => {
      console.error("Database connection error:", error);
      global.mongoose.promise = null; // Reset promise to allow retries
      throw error;
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    console.error("Error establishing MongoDB connection:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
