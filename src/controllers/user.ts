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
        fullName: RegisterdUser.fullName,
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
        fullName: RegisterdUser.fullName,
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

    
const loggedinUser: any = await models.User.findOne({ email });

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
          fullName: loggedinUser.fullName,
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
 
const allUsers: any = await models.User.find({});

 const Response = {
       
        allUsers
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

// export const update = async (req: Request, res: Response) => {
//   try {
 
// const allUsers: any = await models.User.find({});

//  const Response = {
       
//         allUsers
//       };

//       res.json({
//         message: "All User fetched Successfully",
//         data: Response,
//         success: true,
//       });
    

  
   
//   } catch (error: any) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };







// export const UpdatePassword = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     //Destructuring data from request
//     const { oldpassword, newpassword } = req.body;

//     const { user } = req;

//     let userDetails = await models.User.findById(user.id);

//         const passwordCompare = await helpers.bcryptHelper.comparePassword(oldpassword, userDetails.password);

//           if (!passwordCompare) {
//             return res.status(400).json({
//               success: false,
//               error: "Please correct old password credentials",
//             });
//           }



//           //generating new password

//             const encriptedPass = await helpers.bcryptHelper.generateHash(newpassword);

//             const  UpdateUser





 
//   } catch (error: any) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };


