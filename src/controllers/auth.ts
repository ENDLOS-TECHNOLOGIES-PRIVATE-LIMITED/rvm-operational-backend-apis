import { Request, Response, NextFunction } from 'express';
import helpers from "../helpers";



export const RefreshToken = async (req: Request, res: Response) => {
  try {
    // Destructuring data from request
    const { refreshToken } = req.body;


const refreshtoken = await helpers.jwtHelper.refreshAccessToken(refreshToken);
const Response = {
  refreshtoken,
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

