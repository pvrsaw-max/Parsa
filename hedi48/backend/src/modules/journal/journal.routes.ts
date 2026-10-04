import { Router } from 'express';
const router = Router();
const entries:any[] = [];
router.get('/', (_req,res)=>res.json(entries));
router.post('/', (req,res)=>{ const entry={id:Date.now(),...req.body}; entries.push(entry); res.status(201).json(entry);});
export { router as journalRouter };
