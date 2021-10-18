import mongoose from "mongoose";
import config from "./config";

const mongo = config.mongoDB;

const connectionString = `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`;
export default class MongooseConnect {
  public static async connection() {
    await mongoose
      .connect(connectionString, {
        user: mongo.username,
        pass: mongo.pasword,
        useNewUrlParser: true,
        // poolSize: 5,
        authSource: "admin",
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log(`******************* mongo is connected *****************`);
      })
      .catch((err) => {
        console.error("*****************   Mongo not connected");
        console.log(err);
      });
  }
}

// export const mongoogeConnect: MongooseConnect = new MongooseConnect();

// /*DB Status*/
// const dbConnection = mongoose.connection;
// dbConnection.on('error', function (err) {
//     console.error('!!!@@@ Mongoose Server Connection on ERROR @@@!!! %j ', err);
// });
// dbConnection.once('open', function callback() {
//     console.log('@@@ Mongoose Server Connection on OPEN @@@');
// });

// dbConnection.on('connected', function () {
//     console.log('@@@ Mongoose Server Connection ON CONNECTED @@@');
// });

// dbConnection.on('disconnected', function () {
//     console.error('!!!@@@ Mongoose Server Connection on disconnected @@@!!! ');
// });

// process.on('SIGINT', function () {
//     dbConnection.close(function () {
//         console.error('!!!!!! Terminated Application nodejs and mongoose disconnected  !!!!!! ');
//         process.exit(0);
//     });
// });
