import mongoose from "mongoose";

/**
 * Connects to MongoDB database
 * @returns Promise that resolves when connection is established
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

/**
 * Closes database connection
 */
export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};

// Handle connection events
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// TODO: Implement connection retry logic for production
// TODO: Add connection pooling configuration
