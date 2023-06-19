import { Request, Response, NextFunction } from 'express';
import models from '../models'
import helpers from "../helpers";
import mongoose, { model } from 'mongoose';

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

  

    const Response = {
    userRole
  
    };

    //sending Registerd User response
    res.json({
      message: "Successfully Added User Role",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
      const userRole = await models.UserRole.find({
      isActive:true 
    });


    const Response = {
    userRole
  
    };

    //sending Registerd User response
    res.json({
      message: "Successfully Added User Role",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const getById = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;
  //Registering User in the Db
    const userRole = await models.UserRole.findById({_id:new mongoose.Types.ObjectId(id.toString())});


    const Response = {
    userRole
  };

    //sending Registerd User response
    res.json({
      message: "Successfully Added User Role",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

    const {roleName}= req.body;


  
    const isExist = await models.UserRole.findOne({roleName:roleName});


    if(isExist && isExist._id.toString() !== id){

  return res.status(400).json({ error: "User Role already exist" });
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


const Response = {
userRole
};

//sending Registerd User response
res.json({
  message: " User Role Updated Successfully ",
  data: Response,
  success: true,
});



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
    res.status(500).json({ message: error.message, success: false });
  }
};
export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

   

 // upading  UserRole in the Db
 const userRole = await models.UserRole.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    isActive:false

},{
  new:true
}
);


const Response = {
userRole
};

//sending Registerd User response
res.json({
  message: " User Role Deleted Successfully ",
  data: Response,
  success: true,
});

    
 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


