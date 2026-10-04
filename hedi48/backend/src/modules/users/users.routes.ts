import { Router } from 'express';
const router = Router();
router.get('/profile', (req,res)=>res.json({message:'User profile API ready'}));
export { router as usersRouter };
