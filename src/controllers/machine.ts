import { Request, Response, NextFunction } from "express";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
// import User from '../models/user';
import models from "../models";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}

export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {
    

    const { inventoryDetails ,machineId,branchId} = req.body;


    // const isMachineExist = await models.Machine.findOne({ machineId: req.body.machineId });

    // if (isMachineExist) {

    //   const responseError = {
    //     req: req,
    //     result: -1,
    //     message: messages.MACHINE_EXIST,
    //     payload: {},
    //     logPayload: false,
    //   };
      
    //  return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
    //      .json(utility.createResponseObject(responseError));

   
    // } 


    
    let  inventryIds;
  if(inventoryDetails){        
 inventryIds = inventoryDetails.map((item) => new mongoose.Types.ObjectId(item._id.toString()));

const inventryAvailability = await models.Inventory.find({
           "_id": { $in: inventryIds },
         }).exec();
         if (inventryAvailability.length > 0) {

          const isError = inventryAvailability.filter(element=>element.machineId)

         
// console.log({isError});
          if(isError.length>0){

            
                const responseCatchError = {
                req: req,
                result: -1,
                message: messages.INVENTRY_ALREDY_ADDED_MACHINE,
                payload: {},
                logPayload: false,
              };
              
             return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
                 .json(utility.createResponseObject(responseCatchError));
          }
         }

        }
        
        
        


    const isExist = await models.Machine.findOne({ machineId: req.body.machineId });

    if (isExist) {

      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));

   
    } else {

      const Machine = await models.Machine.create({
        machineId:machineId,
        branchId:branchId,
        customerId:req.body.customerId,
        resellerId:req.body.resellerId,
        warrentyStart:req.body.warrentyStart,
        warrentyExpire:req.body.warrentyExpire
      
      })

// const InventryAddedToMachine  = await models.Inventory.updateMany(
// { _id: { $in: inventryIds } },
// { $set: { machineId: Machine._id ,resellerWarrantyStart:req.body.resellerWarrantyStart,resellerWarrantyExpire:req.body.resellerWarrantyExpire} }
// );



if (inventoryDetails) {
  const inventoryIds = await Promise.all(
    inventoryDetails.map(async (item) => {
      const updatedInventory = await models.Inventory.findByIdAndUpdate(
        item._id,
        {
          machineId: Machine._id,
          status:"Machine",
          ...item
        },
        {
          new: true
        }
      );
      return updatedInventory._id;
    })
  );

  // Access the inventoryIds array here after all promises have resolved
}

// const inventryAvailability = await models.Inventory.find({
//            "_id": { $in: inventryIds },
//          }).exec();
//          if (inventryAvailability.length > 0) {

//           const isError = inventryAvailability.filter(element=>element.machineId)

         


//         }


      // }


   

      const payload = {
        Machine,
      };





      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.MACHINE_CREATED,
        payload: payload,
        logPayload: false,
    
      };

    return  res
        .status(enums.HTTP_CODES.OK)
        .json(utility.createResponseObject(data4createResponseObject));

}
  } catch (error: any) {

    console.log(error);
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));

  
  }
};


export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const { type, branchId,allData ,id} = req.query;

            
    const matchStage:any = {
    };
    if (allData==='false'|| !allData) {
      matchStage.isDeleted =false;
    }

    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }

    if(type=="all"){
    
      const AllMachines = await models.Machine.aggregate([
  
  
        { $match: matchStage}, 



{
  $lookup: {
    from: "invetries",
    let: { machineId: "$_id" },
    pipeline: [
      {
    $match: {
          $expr: {
            $and: [
              { $eq: ["$machineId", "$$machineId"] },

              // allData === 'false'|| allData ?{}: { $eq: ['$isDeleted', false] }
      ]
          }
        }
      },

      {
                $lookup: {
                  from: 'invetrybrands',
                  localField: 'brandId',
                  foreignField: '_id',
                  as: 'brandDetails'
                }
              },


 
                      {
              $lookup: {
                from: 'invetrytypes',
                localField: 'brandDetails.inventryTypeId',
                foreignField: '_id',
                as: 'invetrytypes'
              }
            },

            {
                      $group: {
                        _id: '$_id',
                    // invoiceNo: { $first: '$invoiceNo' },
                    // invoiceDate: { $first: '$invoiceDate' },
                    purchaseRate: { $first: '$purchaseRate' },
                    serialNumber: { $first: '$serialNumber' },
                    purchaseDate: { $first: '$purchaseDate' },
                    warrantyExpire: { $first: '$warrantyExpire' },
                    resellerWarrantyStart: { $first: '$resellerWarrantyStart' },
                    resellerWarrantyExpire: { $first: '$resellerWarrantyExpire' },
                    isDisabled: { $first: '$isDisabled' },
                    status: { $first: '$status' },
                    
             
                 brand: {
                    $first: { $arrayElemAt: ["$brandDetails", 0] }
                  },
             
                  invetrytypes: {
                    $first: { $arrayElemAt: ["$invetrytypes", 0] }
                  },


            
                     
                      },
                      
              
              
                    },
        
                    {
                      $project: {

                        _id:"$_id",
                        serialNumber:"$serialNumber",
                        purchaseDate:"$purchaseDate",
                        warrantyExpire:"$warrantyExpire",
                        resellerWarrantyStart:"$resellerWarrantyStart",
                        resellerWarrantyExpire:"$resellerWarrantyExpire",
                        status:"$status",
                        // isDisabled:"$isDisabled",
                        // status:"Active", // need to work on status part 
                        brand:{
                          _id:"$brand._id",
                          name:"$brand.name"
                        },
                        invetrytypes:{
                          _id:"$invetrytypes._id",
                          name:"$invetrytypes.name"
                        }
                  ,

                      }
                    }
    ],
    as: "inventoryDetails",
  },
},










      
  

      {
        $lookup: {
          from: 'vendors',
          localField: 'resellerId',
          foreignField: '_id',
          as: 'reseller'
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branch'
        }
      },


  




        {
                $group: {
                  _id: '$_id',
                  machineId: { $first: '$machineId' },
              
                  branch: {
                    $first: { $arrayElemAt: ["$branch", 0] }
                  },
                  customer: {
                    $first: { $arrayElemAt: ["$customer", 0] }  
                  },
                  reseller: {
                    $first: { $arrayElemAt: ["$reseller", 0] }  
                  },
                  warrentyStart: { $first: '$warrentyStart' },
                  warrentyExpire: { $first: '$warrentyExpire' },
                  inventoryDetails: { $first: '$inventoryDetails' },
                  
                
        
                },
                
        
        
              },
        
        
        
                
        
              {
        
        
                $project: {
                  machineId:"$machineId",
                      
                  warrentyStart:"$warrentyStart",
                  warrentyExpire:"$warrentyExpire",
                  branch: {
                    name: "$branch.name",
                    _id: "$branch._id"
                  },
                  customer: {
                    name: "$customer.name",
                    _id: "$customer._id"
                  },
                  reseller: {
                    name: "$reseller.name",
                    _id: "$reseller._id"
                  },
                  machineStatus: {
                    $cond: {
                      if: { $lt: ["$warrentyExpire", new Date()] },
                      then: "Out Of Warranty",
                      else: "In Warranty"
                    }
                  },
                  inventoryDetails:"$inventoryDetails"
                }
              
        
              }





              

      // {
      //   $lookup: {
      //     from: 'invetries',
      //     let: { inventryId: '$inventry._inventry', warrantyExpire: '$inventry.resellerWarrantyExpire' },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ['$_id', '$$inventryId']
      //           }
      //         }
      //       },

      //       {
      //         $lookup: {
      //           from: 'invetrybrands',
      //           localField: 'brandId',
      //           foreignField: '_id',
      //           as: 'brandDetails'
      //         }
      //       },
      //       {
      //         $lookup: {
      //           from: 'invetrytypes',
      //           localField: 'brandDetails.inventryTypeId',
      //           foreignField: '_id',
      //           as: 'invetrytypes'
      //         }
      //       },

      //       {
      //         $addFields: {
      //           "resellerwarrantyExpire": {
      //             $arrayElemAt: ['$$warrantyExpire', {
      //               $indexOfArray: ['$$inventryId', '$_id']
      //             }]
      //           },
      //           brandName: { $arrayElemAt: ['$brandDetails.name', 0] },
      //           inventryType: { $arrayElemAt: ['$invetrytypes.name', 0] }
                
      //         }
      //       },


      //       {
      //         $group: {
      //           _id: '$_id',


      //           invoiceNo: { $first: '$invoiceNo' },
      //           // resellerWarrantyStart: { $first: '$resellerWarrantyStart' },
      //           // rsellerWarrantyExpire: { $first: '$rsellerWarrantyExpire' },
      //           serialNumber: { $first: '$serialNumber' },
      //           manufacturerwarrantyExpire: { $first: '$warrantyExpired' },
      //           resellerwarrantyExpire: { $first: '$resellerwarrantyExpire' },
      //           brandName: { $first: '$brandName' },
      //           inventryType: { $first: '$inventryType' },
                
             
      //         },
              
      
      
      //       },

      //       {
      //         $project: {
      //           brandDetails: 0,
      //           invetrytypes: 0
      //         }
      //       }
      //     ],
      //     as: 'inventoryDetails'
      //   }
      // },

  
     
      // { $unwind: '$inventoryDetails' }, // Unwind the inventory array


// {
//         $lookup: {
//           from: 'branches',
//           localField: 'branchId',
//           foreignField: '_id',
//           as: 'branch'
//         }
//       },
//       {
//         $lookup: {
//           from: 'customers',
//           localField: 'branch.customer._customerId',
//           foreignField: '_id',
//           as: 'customer'
//         }
//       },

//       {
//         $lookup: {
//           from: 'vendors',
//           localField: 'customer.vendorId',
//           foreignField: '_id',
//           as: 'vendor'
//         }
//       },




//    {
//         $group: {
//           _id: '$_id',
//           machineId: { $first: '$machineId' },
//           // machineId: { $first: '$machineId' },
//           inventry: { $first: '$inventry' },
//           branch: {
//             $first: { $arrayElemAt: ["$branch", 0] }
//           },
//           customer: {
//             $first: { $arrayElemAt: ["$customer", 0] }  
//           },
//           vendor: {
//             $first: { $arrayElemAt: ["$vendor", 0] }  
//           },
//           warrentyStart: { $first: '$warrentyStart' },
//           warrentyExpire: { $first: '$warrentyExpire' },
//           inventoryDetails: { $first: '$inventoryDetails' },
          
//           //   inventoryDetails: {
//           //   $push: "$inventoryDetails"
//           // }

//         },
        


//       },



        

//       {


//         $project: {
//           machineId:"$machineId",
              
//           warrentyStart:"$warrentyStart",
//           warrentyExpire:"$warrentyExpire",
//           inventry:"$inventry",
//           branch: {
//             name: "$branch.name",
//             _id: "$branch._id"
//           },
//           customer: {
//             name: "$customer.name",
//             _id: "$customer._id"
//           },
//           reseller: {
//             name: "$vendor.name",
//             _id: "$vendor._id"
//           },
//           machineStatus: {
//             $cond: {
//               if: { $lt: ["$warrentyExpire", new Date()] },
//               then: "Out Of Warranty",
//               else: "In Warranty"
//             }
//           },
//           inventoryDetails:"$inventoryDetails"
//         }
      

//       }


  
  
      ]);







 


    

    
  const payload = {
      AllMachines
  };    


  

  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.MACHINE_FETCHED,
    payload: payload,
    logPayload: false,

  };

return  res
    .status(enums.HTTP_CODES.OK)
    .json(utility.createResponseObject(data4createResponseObject));



  




    }

    else if (branchId) {
      const Machines = await models.Machine.find({ isDeleted: false, "branch._branchId": branchId });
      const payload = {
        Machines,
       
      };



      
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_FETCHED,
      payload: payload,
      logPayload: false,
  
    };

  return  res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));

  

  
    } else {



      
      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseCatchError));


    
    }
 

 
  } catch (error: any) {


    console.log({error});
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
   
  }
};

export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {


      
      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));

    } else {
      const deletedInventry = await models.Machine.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $set: {
            isDeleted: true,
          },
        },

        {
          new: true,
        }
      );



      if(!deletedInventry){


        const responseCatchError = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
        
        return  res.status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utility.createResponseObject(responseCatchError));

      }

      const payload = {
        deletedInventry,
      };




      
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_DELETED,
      payload: payload,
      logPayload: false,
  
    };

   return res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));











    }
  } catch (error: any) {
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
    
  }
};


export const Assign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let {branchId} = req.body;

    let {machineId}=req.query;

    if ((!machineId || !branchId)) {

      

      const responseError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));



    }

    else{
          // Assigning Machine 
        const assignedMachine = await models.Machine.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(machineId.toString()),
            
          },
          {
            $set: {
              branchId: req.body.branchId,
            },
          },

          {
            new: true,
          }
        );


        const payload = {
          assignedMachine,
        };


        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.MACHINE_ASSIGNED,
          payload: payload,
          logPayload: false,
      
        };
  
       return res
          .status(enums.HTTP_CODES.OK)
          .json(utility.createResponseObject(data4createResponseObject));
  

    }
    
       
  } catch (error: any) {
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
   
  }
};
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {

       
      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));
     
    } else {
      // checking the serila number exist or not
        const isMachineIdExist = await models.Machine.findOne({ machineId: req.body.machineId });

      
        if (isMachineIdExist&& isMachineIdExist?._id.toString() !== id) {

          
      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_EXIST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utility.createResponseObject(responseError));

        } else {


          console.log("Printing the machind information");

          const inventryAssocited = await models.Inventory.updateMany({machineId:id},{ $unset: { machineId: 1 } })

          const updatedMachine = await models.Machine.findOneAndUpdate(
            {
              // _id: new mongoose.Types.ObjectId(id.toString()),
              _id: id,
            },
            {
              $set: {
                ...req.body,
              
              },
            },

            {
              new: true,
            }
          );


          if(!updatedMachine){


            const responseCatchError = {
              req: req,
              result: -1,
              message: messages.NOT_FOUND,
              payload: {},
              logPayload: false,
            };
            
            
            return  res.status(enums.HTTP_CODES.BAD_REQUEST)
              .json(utility.createResponseObject(responseCatchError));
    
          }
    



          const payload = {
            updatedMachine,
          };

          
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_UPDATED,
      payload: payload,
      logPayload: false,
  
    };

   return res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));


        }

}
  } catch (error: any) {
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
    
  }
};

