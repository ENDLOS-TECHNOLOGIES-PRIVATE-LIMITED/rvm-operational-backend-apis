import { Router } from 'express';
// import middlewares from '../middlewares';
// import Validation from '../validations';
// import Controller from '../controllers';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.get('/checkAuth',(req,res)=>{

    res.send('Checking Auth Route')

  })

 

};
