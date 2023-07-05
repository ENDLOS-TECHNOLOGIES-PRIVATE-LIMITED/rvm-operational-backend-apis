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
    // Destructuring data from request
    const { roleName, description } = req.body;

    let isUserRegisterd = await models.UserRole.findOne({ roleName });
    if (isUserRegisterd) {
      return res.status(400).json({ error: "Role already exists" });
    }

   
    //Registering UserRole in the Db
    const userRole = await models.UserRole.create({
      ...req.body,   
    });

  

    const payload = {
    userRole
  
    };

    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.USER_ROLE_CREATED,
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
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const {allData} =req.query;
   
    const matchStage:any = {
    };

if (allData==='false'|| !allData) {
    matchStage.isActive =true;
  }

  const userRole= await models.UserRole.aggregate([
    { $match: matchStage}, // Filter customers with isDelete set to false
    { $sort: { createdAt: -1 } },
{
      $lookup: {
        from: "users",
        let: { roleId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$role", "$$roleId"] },

                  // allData === 'false'|| allData ?{}: { $eq: ['$isActive', false] }
                  // { $eq: ['$isActive', true] }
          ]
              }
            }
          }
        ],
        as: "users",
      },
    },
   


  ]).exec();

    //   const userRole = await models.UserRole.find({
    //   isActive:true 
    // });


    const payload = {
    userRole
  
    };


    
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.USER_ROLE_FETCHED,
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
export const getById = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;
  //Registering User in the Db
    const userRole = await models.UserRole.findById({_id:new mongoose.Types.ObjectId(id.toString())});


    const payload = {
    userRole
  };




  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.USER_ROLE_FETCHED,
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
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

    const {roleName}= req.body;


  
    const isExist = await models.UserRole.findOne({roleName:roleName});


    if(isExist && isExist._id.toString() !== id){


      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.USER_ROLE_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));

 
    }

    else {


       const userRole = await models.UserRole.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    ...req.body

},{
  new:true
}
);


const payload = {
userRole
};





const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.USER_ROLE_UPDATED,
  payload: payload,
  logPayload: false,

};

return  res
  .status(enums.HTTP_CODES.OK)
  .json(utility.createResponseObject(data4createResponseObject));


    }


  


//     if(isExist.length>0){

//  // upading  UserRole in the Db
//  const userRole = await models.UserRole.findOneAndUpdate(
//   {_id:new mongoose.Types.ObjectId(id.toString())},
//   {
//     ...req.body

// },{
//   new:true
// }
// );


// const Response = {
// userRole
// };

// //sending Registerd User response
// res.json({
//   message: " User Role Updated Successfully ",
//   data: Response,
//   success: true,
// });

//     } else{
//       return res.status(409).json({ error: "Bad Request" });

//     }

//     if(!(isExist._id.toString() == id)){
//       return res.status(400).json({ error: "User Role already exist" });

//     }else{

//  // upading  UserRole in the Db
//  const userRole = await models.UserRole.findOneAndUpdate(
//   {_id:new mongoose.Types.ObjectId(id.toString())},
//   {
//     ...req.body

// },{
//   new:true
// }
// );


// const Response = {
// userRole
// };

// //sending Registerd User response
// res.json({
//   message: " User Role Updated Successfully ",
//   data: Response,
//   success: true,
// });

//     }
 
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
export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

   




const isUserExist = await models.User.findOne({"role":new mongoose.Types.ObjectId(id.toString()),isActive:true})


      
    
if(isUserExist){


  const responseError = {
    req: req,
    result: -1,
    message: messages.USER_ROLE_DELETE_ERROR,
    payload: {},
    logPayload: false,
  };
  
return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
     .json(utility.createResponseObject(responseError));


}



 // upading  UserRole in the Db
 const userRole = await models.UserRole.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    isActive:false

},{
  new:true
}
);


const payload = {
userRole
};




const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.USER_ROLE_DELETED,
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


