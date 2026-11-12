const connectDB = async () => {
    try {
        console.log("Checking MongoDB configuration...");

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env file");
        }

        console.log("MongoDB URI loaded successfully");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!");
        console.error(error);
    }
};