import { Router } from 'express';
const router = Router();
const habits:any[] = [];
router.get('/', (_req,res)=>res.json(habits));
router.post('/', (req,res)=>{ const habit={id:Date.now(),...req.body}; habits.push(habit); res.status(201).json(habit);});
export { router as habitsRouter };
