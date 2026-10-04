import { Router } from 'express';
import { createConversation, getConversation } from './conversation.service';

const router = Router();

router.post('/chat', (req,res)=>{
  const userId = req.body.userId || 'guest';
  const message = req.body.message || '';
  res.json(createConversation(userId,message));
});

router.get('/:userId', (req,res)=>{
  res.json(getConversation(req.params.userId));
});

export default router;
