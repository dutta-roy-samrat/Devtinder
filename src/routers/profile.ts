import { Router,Request,Response } from "express";

import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";

const router=Router();

router.use(JWTAuthentication)

router.get("/",asyncHandler(async(req:Request,res:Response)=>{
    const user=req.user;
    
}))                             

export default router;
