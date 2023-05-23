import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

// import User from '../models/user';

class UserController {
  Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
  const {  email, password } = req.body;

      let isUserRegisterd = await User.findOne({ email });
      if (isUserRegisterd) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const RegisterdUser = User.create({
        ...req.body,
      });

      res.send("Registering the user 2.0");
    } catch (e) {
      return next(e);
    }
  };
}

export default new UserController();
