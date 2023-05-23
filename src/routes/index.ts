import { Router } from 'express';

import auth from './auth';
import user from './user';


const route = Router();

export default () => {
 
  auth(route);
 user(route);
  return route
};
