import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected");
    console.log("Database Name:", mongoose.connection.name);

  } catch (error) {
    console.error("Database Connection Error:", error);
  }
};

export default connectDb;