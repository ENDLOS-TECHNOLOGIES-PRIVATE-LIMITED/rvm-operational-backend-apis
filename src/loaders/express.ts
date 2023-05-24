// import express from 'express';
// import cors from 'cors';
// import routes from '../routes';
// import config from '../config';
// import responseHandler from 'express-response-handler';
// import { isCelebrateError } from 'celebrate';
// // import handleAPIDocs from './swagger';
// // import compression from 'compression';
// // import { logger } from '../helpers/logger';
// // import { Decrypt } from '../helpers/CryptoJS';
// var session = require('express-session');
// export default ({ app }: { app: express.Application }) => {
//   /**
//    * Health Check endpoints
//    * @TODO Explain why they are here
//    */
//   app.get('/', (req, res) => {
//     res.status(200).end();
//   });
//   app.get('/status', (req, res) => {
//     res.status(200).end();
//   });
//   app.head('/status', (req, res) => {
//     res.status(200).end();
//   });

//   // Compress all responses
//   // app.use(compression());

//   // Custom Error Code
//   var customCodes = [
//     ['Unauthorized', 'error', 209],
//     ['success', 'success', 200],
//     ['Created', 'success', 201],
//     ['Accepted', 'success', 202],
//     ['Updated', 'success', 203],
//     ['NoContent', 'success', 204],
//     ['ResetContent', 'success', 205],
//     ['PartialContent', 'success', 206],
//     ['Deleted', 'success', 207],
//     ['PartialContent', 'error', 208],
//     ['AlreadyExists', 'error', 409],
//     ['Default', 'error', 500],
//   ];
//   app.use(responseHandler(customCodes));

//   // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
//   // It shows the real origin IP in the heroku or Cloudwatch logs
//   app.enable('trust proxy');

//   // The magic package that prevents frontend developers going nuts
//   // Alternate description:
//   // Enable Cross Origin Resource Sharing to all origins by default
//   app.use(cors());

//   // Some sauce that always add since 2014
//   // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
//   // Maybe not needed anymore ?
//   app.use(require('method-override')());

//   // Middleware that transforms the raw string of req.body into json
//   app.use(express.json({ limit: '100mb' }));
//   app.use(express.urlencoded({ limit: '100mb', extended: true }));
//   // Load API routes

//   // app.use(
//   //   session({
//   //     secret: 'k5Zurj4',
//   //     cookie: {
//   //       httpOnly: true,
//   //       secure: true,
//   //     },
//   //     resave: true,
//   //     saveUninitialized: true,
//   //   }),
//   // );
//   // app.use((req, res, next) => {
//   //   if (Object.keys(req.body).length) {
//   //     req.body = Decrypt(req.body.data);
//   //   }
//   //   next();
//   // });

//   app.use(config.api.prefix, routes());

//   // Load Swagger docs middleware
//   // handleAPIDocs.forEach(e => {
//   //   e(app);
//   // });

//   app.use((error, req, res, next) => {
//     // logger.error(
//     //   'Method:[' +
//     //     req.method +
//     //     '] url:[' +
//     //     req.url +
//     //     '] QueryString:[' +
//     //     JSON.stringify(req.query) +
//     //     '] error:' +
//     //     JSON.stringify(error),
//     // );

//     // if (isCelebrateError(error)) {
//     //   const errorParams = error.details.get('params');
//     //   const errorBody = error.details.get('body');
//     //   const errorHeader = error.details.get('headers');
//     //   if (errorParams) {
//     //     const {
//     //       details: [errorDetails],
//     //     } = errorParams;
//     //     return res.error[400](errorDetails.message);
//     //   } else if (errorBody) {
//     //     const {
//     //       details: [errorDetails],
//     //     } = errorBody;
//     //     return res.error[400](errorDetails.message);
//     //   } else if (errorHeader) {
//     //     const {
//     //       details: [errorDetails],
//     //     } = errorHeader;
//     //     return res.error[400](errorDetails.message);
//     //   }
//     // }

//     res.error[error.status || 500](error.message || 'Something Went Wrong');
//   });
// };
