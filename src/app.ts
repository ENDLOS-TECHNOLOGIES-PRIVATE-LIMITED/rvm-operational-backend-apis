import config from "./config";
import express from "express";
import routes from "./routes";
import { connectToMongo } from "./database/db";
import bodyParser from "body-parser";
// let cors = require("cors");
import cors from 'cors'

async function startServer() {
  const app = express();

  connectToMongo();

  //for cors error


  // const corsOpts = {
  //   origin: "*",
  //   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  // };
  // app.use(cors(corsOpts));

  app.use(cors())

  // Parse URL-encoded bodies
  app.use(bodyParser.urlencoded({ extended: false }));

  // Parse JSON bodies
  app.use(bodyParser.json());

  app.get('/',(req,res)=>{
    res.send('server is working')
  })

  app.use(config.api.prefix, routes());

  app.listen(config.port, () => {
    console.log("App is working on Port", config.port);
  });
}

startServer();








