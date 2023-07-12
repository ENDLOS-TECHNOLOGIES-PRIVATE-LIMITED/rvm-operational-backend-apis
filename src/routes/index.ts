import { Router } from 'express';

import auth from './auth';
import user from './user';
import inventry from './inventry';
import customer from './customer'
import branch from "./branch";
import invetryType from "./inventryType";
import machine from "./machine";
import userRole from './userRole';
import problem  from './problem';
import vendor  from './vendor';
import solution  from './solution';
import inventryBrand  from './inventryBrand';
import ticket  from './ticket';
import localVendor  from './localVendor';
import stock  from './stock';

const route = Router();

export default () => {
 
auth(route);
 user(route);
 inventry(route);
 customer(route);
 branch(route);
 invetryType(route);
 machine(route);
 userRole(route); //need to work on permission and new payload response then it will be enabled again for the user 
 problem(route);
 solution(route);
 vendor(route);
 inventryBrand(route);
 ticket(route);
 localVendor(route);
 stock(route);

 


 return route
};
