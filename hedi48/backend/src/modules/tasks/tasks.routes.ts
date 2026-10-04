import { Router } from 'express';
const router = Router();
const tasks:any[] = [];
router.get('/', (_req,res)=>res.json(tasks));
router.post('/', (req,res)=>{ const task={id:Date.now(),...req.body}; tasks.push(task); res.status(201).json(task);});
export { router as tasksRouter };
