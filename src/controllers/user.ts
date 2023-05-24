import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import helpers from "../helpers";

// import User from '../models/user';


export const Register = async (req: Request, res: Response) => {
  try {
    // Destructuring data from request
    const { email, password } = req.body;

    let isUserRegisterd = await User.findOne({ email });
    if (isUserRegisterd) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const encriptedPass = await helpers.bcryptHelper.generateHash(password);

    //Registering Employee in the Db
    const RegisterdUser = await User.create({
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
        firstname: RegisterdUser.firstname,
        lastname: RegisterdUser.lastname,
        email:RegisterdUser.email,
        role:RegisterdUser.role
      },
    };

  
    // //sending Registerd User response
    res.json({
      message: " Successfully Registerd",
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

    
const loggedinUser: any = await User.find({ email });

    if (!loggedinUser) {
      return res.status(400).json({
        error: "Please try to login with correct credentials",
        success: false,
      });
    }else{

      console.log("in the else block ");
      console.log("in the else block ",password,loggedinUser);
      // const passwordCompare = await bcrypt.compare(password, loggedinUser[0].password);
      const passwordCompare = await helpers.bcryptHelper.comparePassword(password, loggedinUser[0].password);

      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Please try to login with correct credentials",
        });
      }

      const user = {
        id: loggedinUser[0]?._id,
        role: loggedinUser[0]?.role,
      };

      const token = helpers.jwtHelper.generateTokens(user);

      const Response = {
        token,
        user: {
          firstname: loggedinUser[0].firstname,
          lastname: loggedinUser[0].lastname,
          email: loggedinUser[0].email,
          role: loggedinUser[0].role,
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

