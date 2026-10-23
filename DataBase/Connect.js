
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI_TEST ||
      process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI_TEST or MONGODB_URI must be defined"
      );
    }

    await mongoose.connect(mongoUri, {
      dbName:
        process.env.MONGO_DB_NAME ||
        undefined,
    });

    console.log("Database Connected");
    console.log(
      "Database Name:",
      mongoose.connection.name
    );
  } catch (error) {
    console.error("Database Connection Error:", error);
    throw error;
  }
};

export default connectDb;
