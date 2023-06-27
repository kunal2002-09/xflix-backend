const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("Connection with MongoDB established");

    // Log the name of the connected database
    console.log("Connected to database:", mongoose.connection.name);

    // Retrieve the available collections
    mongoose.connection.db.listCollections().toArray((error, collections) => {
      if (error) {
        console.error("Failed to retrieve collections:", error.message);
        return;
      }

      // Log the available collections
      console.log("Available collections:");
      collections.forEach((collection) => {
        console.log(collection.name);
      });

      // Start the Express app
      const server = app.listen(config.port || 8082, () => {
        console.log("App started at PORT", config.port);
      });
    });
  })
  .catch((error) => {
    console.error("Connection with MongoDB failed:", error.message);
  });
 