import { Router } from 'express';

import auth from './auth';
import user from './user';
import inventry from './inventry';


const route = Router();

export default () => {
 
  auth(route);
 user(route);
 inventry(route);
  return route
};
