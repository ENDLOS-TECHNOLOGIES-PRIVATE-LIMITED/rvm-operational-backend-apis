import { Request, Response, NextFunction } from 'express';
// import User from '../models/user';
import models from '../models'
import helpers from "../helpers";
import mongoose from 'mongoose';

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
      return res.status(400).json({ error: "Email already exists" });
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

    const Response = {
      token,
      user: {


        name: RegisterdUser.name,
        email:RegisterdUser.email,
        role:RegisterdUser.role
      },
    };

  
    //sending Registerd User response
    res.json({
      message: " Successfully Registerd",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const Register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Destructuring data from request
    const { email, password } = req.body;

    let isUserRegisterd = await models.User.findOne({ email });
    if (isUserRegisterd) {
      return res.status(400).json({ error: "Email already exists" });
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

    const Response = {
      token,
      user: {
        name: RegisterdUser.name,
        email:RegisterdUser.email,
        role: Role?.roleName,
      },
    };

    //sending Registerd User response
    res.json({
      message: "Successfully Registerd",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const Login = async (req: Request, res: Response) => {
  try {
    //Destructuring data from request
    const { email, password } = req.body;

    console.log(req.body);

    
const loggedinUser: any = await models.User.findOne({ email });

console.log({loggedinUser});

    if (!loggedinUser) {
      return res.status(400).json({
        error: "Please try to login with correct credentials",
        success: false,
      });
    }
    


    else if(!loggedinUser.isActive){
      
      return res.status(400).json({
        error: "Your account has been disabled. Please contact the administrator for further assistance.",
        success: false,
      });
      
    }
    
    else{

    const passwordCompare = await helpers.bcryptHelper.comparePassword(password, loggedinUser.password);

      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct credentials",
        });
      }



const Role = await models.UserRole.findOne({_id:new mongoose.Types.ObjectId(loggedinUser.role.toString())})
    
      const user = {
        id: loggedinUser?._id,
        role: Role?.roleName,
      };

      const token = helpers.jwtHelper.generateTokens(user);

      const Response = {
        token,
        user: {
          name: loggedinUser.name,
          email: loggedinUser.email,
          role:  Role?.roleName,
        },
      };

      res.json({
        message: " Successfully Logged in ",
        data: Response,
        success: true,
      });
    }

  
   
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
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



 const Response = {
       
        allUsers,
        
      };

      res.json({
        message: "All User fetched Successfully",
        data: Response,
        success: true,
      });
    

  
   
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const deleteUser = async (req: Request, res: Response) => {


  try {
    const userId = req.params.id;
    // Find the user by ID and update the isActive field to false
    const user = await models.User.findByIdAndUpdate(userId, { isActive: false });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // res.json({ message: 'User disabled successfully' });


    const Response = {
       user
    };

    res.json({
      message: "User disabled successfully",
      data: Response,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
      return res.status(400).json({ message: 'Email already exists' });
    }
  }

// Find the user by ID and update the specified fields
const user = await models.User.findByIdAndUpdate(userId, updates, { new: true });

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

const Response = {
 user
};

      res.json({
        message: " User Updated Successfully",
        data: Response,
        success: true,
      });
    

  
   
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};




