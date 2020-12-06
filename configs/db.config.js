const mongoose = require("mongoose");

const { MONGO_ATLAS, MONGO_ATLAS_DEV, NODE_ENV } = process.env;

const connectDb = (mongoUri) =>
  mongoose
    .connect(mongoUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((x) => {
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });

NODE_ENV === "development" ? connectDb(MONGO_ATLAS_DEV) : connectDb(MONGO_ATLAS);