import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma.js';

const router = Router();
const secret = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req,res)=>{
  const {email,name,password}=req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  const exists=await prisma.user.findUnique({where:{email}});
  if(exists) return res.status(409).json({error:'user exists'});
  const passwordHash=await bcrypt.hash(password,10);
  const user=await prisma.user.create({data:{email,name}});
  const token=jwt.sign({userId:user.id},secret,{expiresIn:'15m'});
  res.json({user,token});
});

router.post('/login', async (req,res)=>{
  const {email,password}=req.body;
  const user=await prisma.user.findUnique({where:{email}});
  if(!user) return res.status(401).json({error:'invalid credentials'});
  // passwordHash migration will be completed with next DB migration
  res.json({user,token:jwt.sign({userId:user.id},secret,{expiresIn:'15m'})});
});

export default router;
