import { Request, Response, NextFunction } from 'express';
// import User from '../models/user';
import models from '../models'
import helpers from "../helpers";
import mongoose from 'mongoose';
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'

interface AuthenticatedRequest extends Request {
  user?: {
    id:String,
    role:String
  }
}



export const SuperAdminRegister = async (req: Request, res: Response) => {
  try {
    // Destructuring data from request
    const { email, password } = req.body;

    let isUserRegisterd = await models.User.findOne({ email });
    if (isUserRegisterd) {

 const responseCatchError = {
        req: req,
        result: -1,
        message: messages.USER_EXIST,
        payload: {},
        logPayload: false,
      };
      
   return   res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));

    
    }

    const encriptedPass = await helpers.bcryptHelper.generateHash(password);

    //Registering Employee in the Db
    const RegisterdUser = await models.User.create({
      ...req.body,
      password: encriptedPass,
    });


    //sign token 

    const token = await helpers.jwtHelper.generateTokens({
      id:RegisterdUser._id,
      role:RegisterdUser.role,
    })

    const payload = {
      token,
      user: {


        name: RegisterdUser.name,
        email:RegisterdUser.email,
        role:RegisterdUser.role
      },
    };


    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.REGISTER_SUCCESS,
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


export const Register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Destructuring data from request
    const { email, password } = req.body;

    let isUserRegisterd = await models.User.findOne({ email });
    if (isUserRegisterd) {


      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.USER_EXIST,
        payload: {},
        logPayload: false,
      };
      
   return   res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
     
    }

    const encriptedPass = await helpers.bcryptHelper.generateHash(password);

    //Registering User in the Db
    const RegisterdUser = await models.User.create({
     ...req.body,
      password: encriptedPass,
      createdBy: {
        _user: req?.user.id,
      },
    });



    const Role = await models.UserRole.findById({_id:RegisterdUser.role})

    //sign token

    const token = await helpers.jwtHelper.generateTokens({
      id: RegisterdUser._id,
      role: Role?.roleName
    
    });

    const payload = {
      token,
      user: {
        name: RegisterdUser.name,
        email:RegisterdUser.email,
        role: Role?.roleName,
      },
    };



    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.VENDOR_CREATED,
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



export const Login = async (req: Request, res: Response) => {
  try {
    //Destructuring data from request
    const { email, password } = req.body;

const loggedinUser: any = await models.User.findOne({ email });


    if (!loggedinUser) {




      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.INVALID_CREDENTIALS,
        payload: {},
        logPayload: false,
      };
      
      return res.status(enums.HTTP_CODES.UNAUTHORIZED)
         .json(utility.createResponseObject(responseCatchError));

}
    


    else if(!loggedinUser.isActive){


      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.USER_DISABLED,
        payload: {},
        logPayload: false,
      };
      
      return res.status(enums.HTTP_CODES.FORBIDDEN)
         .json(utility.createResponseObject(responseCatchError));

      
    }
    
    else{

    const passwordCompare = await helpers.bcryptHelper.comparePassword(password, loggedinUser.password);

      if (!passwordCompare) {



      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.INVALID_CREDENTIALS,
        payload: {},
        logPayload: false,
      };
      
      return res.status(enums.HTTP_CODES.UNAUTHORIZED)
         .json(utility.createResponseObject(responseCatchError));
      
      }



const Role = await models.UserRole.findOne({_id:new mongoose.Types.ObjectId(loggedinUser.role.toString())})
    
      const user = {
        id: loggedinUser?._id,
        role: Role?.roleName,
      };

      const token = helpers.jwtHelper.generateTokens(user);

      const payload = {
        token,
        user: {
          name: loggedinUser.name,
          email: loggedinUser.email,
          role:  Role?.roleName,
        },
      };



    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.LOGIN_SUCCESS,
      payload: payload,
      logPayload: false,
  
    };

  return  res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));

    
    }

  
   
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

export const getAll = async (req: Request, res: Response) => {
  try {

const allUsers = await models.User.aggregate([
  {
    $match: {
      
    },
  },
  {
    $lookup: {
      from: "userroles",
      localField: "role",
      foreignField: "_id",
      as: "role",
    },
  },

  {
    $unwind: "$role",
  },
 
  {
    $addFields: {
      Role: {
        _id:"$role._id",
        role:"$role.roleName",
      },

    },
  },
  {
    $project: {
      role: 0,
    },
  },
]);



 const payload = {
       
        allUsers,
        
      };



      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.USER_FETCHED,
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
export const deleteUser = async (req: Request, res: Response) => {


  try {
    const userId = req.params.id;
    // Find the user by ID and update the isActive field to false
    const user = await models.User.findByIdAndUpdate(userId, { isActive: false });

    if (!user) {

      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.USER_NOT_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.NOT_FOUND)
         .json(utility.createResponseObject(responseCatchError));


     
    }

    // res.json({ message: 'User disabled successfully' });


    const payload = {
       user
    };


    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.USER_DELETED,
      payload: payload,
      logPayload: false,
  
    };

  return  res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));

 
  } catch (error) {

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

export const update = async (req: Request, res: Response) => {
  try {
 

const userId = req.params.id;
const updates = req.body;



  // Check if the updated email already exists for another user
  if (updates.email) {
    const existingUser = await models.User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== userId) {


      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.INVALID_EMAIL,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
      
    }
  }

// Find the user by ID and update the specified fields
const user = await models.User.findByIdAndUpdate(userId, updates, { new: true });

if (!user) {


  const responseCatchError = {
    req: req,
    result: -1,
    message: messages.USER_NOT_EXIST,
    payload: {},
    logPayload: false,
  };
  
 return res.status(enums.HTTP_CODES.NOT_FOUND)
     .json(utility.createResponseObject(responseCatchError));
 
}

const payload = {
 user
};

const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.USER_UPDATED,
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




