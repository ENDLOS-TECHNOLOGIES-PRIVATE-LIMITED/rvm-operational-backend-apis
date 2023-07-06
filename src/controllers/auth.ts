import { Request, Response, NextFunction } from 'express';
import helpers from "../helpers";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'




export const RefreshToken = async (req: Request, res: Response) => {
  try {
    // Destructuring data from request
    const { refreshToken } = req.body;





            const refreshtoken = await helpers.jwtHelper.refreshAccessToken(refreshToken);
            const payload = {
              refreshtoken,
            };

  

            const data4createResponseObject = {
              req: req,
              result: 0,
              message: messages.REFRESH_TOKEN_GENERATED,
              payload: payload,
              logPayload: false,
          
            };
      
          return  res
              .status(enums.HTTP_CODES.OK)
              .json(utility.createResponseObject(data4createResponseObject));



  } catch (error: any) {

    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));

  }
};

