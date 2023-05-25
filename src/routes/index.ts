import { Router } from 'express';

import auth from './auth';
import user from './user';
import inventry from './inventry';
import customer from './customer'


const route = Router();

export default () => {
 
  auth(route);
 user(route);
 inventry(route);
 customer(route);
  return route
};
