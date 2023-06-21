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
import solution  from './solution';

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
 problem(route);
 solution(route);

 


 return route
};
