import config from "./config";
import express from "express";
import routes from "./routes";
import { connectToMongo } from "./database/db";

async function startServer() {
  const app = express();

  //   /**
  //    * A little hack here
  //    * Import/Export can only be used in 'top-level code'
  //    * Well, at least in node 10 without babel and at the time of writing
  //    * So we are using good old require.
  //    **/

  // await require("./loaders").default({ expressApp: app });

//temp connection code  which will be removed later we will user instance Or we will use Loader Folder


connectToMongo()


app.use(config.api.prefix, routes());


  app.listen(config.port, () => {
    console.log("App is working on Port", config.port);
  });
}

startServer();








