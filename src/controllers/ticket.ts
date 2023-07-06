import { Request, Response, NextFunction } from 'express';
import models from '../models'
import helpers from "../helpers";
import mongoose, { model } from 'mongoose';
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
interface AuthenticatedRequest extends Request {
  user?: {
    id:String,
    role:String
  }
}




export const add = async (req: AuthenticatedRequest, res: Response) => {
  try {


    
    //Registering Ticket in the Db
    const ticket = await models.ticket.create({
      ...req.body,   
    });

  

    const payload = {
      ticket
  
    };

    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.TICKET_CREATED,
      payload: payload,
      logPayload: false,
  
    };

  return  res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));

  
  } catch (error: any) {

console.log({error});

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
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const {id} =req.query;
   
    const matchStage:any = {
    };

    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }


  const tickets= await models.ticket.aggregate([
    { $match: matchStage}, // Filter customers with isDelete set to false
    { $sort: { createdAt: -1 } },

   


  ]).exec();

    //   const userRole = await models.UserRole.find({
    //   isActive:true 
    // });


    const payload = {
      tickets
  
    };


    
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.TICKET_FETCHED,
      payload: payload,
      logPayload: false,
  
    };

   return res
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

export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

    const { ticketNo, ...updateData } = req.body; 

const updatedTicket = await models.ticket.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  
    updateData

,{
  new:true
}
);


const payload = {
  updatedTicket
};





const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.TICKET_UPDATED,
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
