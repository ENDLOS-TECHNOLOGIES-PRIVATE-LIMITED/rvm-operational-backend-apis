import { Router } from 'express';

import auth from './auth';
import user from './user';
import inventry from './inventry';
import customer from './customer'
import branch from "./branch";
import invetryType from "./inventryType";
import machine from "./machine";
import userRole from './userRole';


const route = Router();

export default () => {
 
auth(route);
 user(route);
 inventry(route);
 customer(route);
 branch(route);
 invetryType(route);
 machine(route);
 userRole(route);

 


 return route
};
