import * as Mongoose from "mongoose";

let database: Mongoose.Connection;
export const connect = () => {
    const uri = "mongodb://localhost:27017/perp";

    Mongoose.connect(uri, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    database = Mongoose.connection;
    database.once("open", async () => {
        console.log("Connected to database");
    });
    database.on("error", (err) => {
        console.log("Error connecting to database", err);
    });
};
export const disconnect = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
};