import { Request, Response } from 'express'
import { dbDisconnector, prisma } from '../prisma/database'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');

const JWT_SECRET = '5EGmFYEAet6R8Cx5iuQpm736OEQFP8hOvoStHtZAEFs=';


export const registerContoller = async (req: Request, res: Response) => {

  const {userName, email, password } = req.body
try {
    const existingUser = await prisma.user.findUnique({ where: { email: email } })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const hashedPasword= await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {userName,email,password:hashedPasword  }
    })

    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    dbDisconnector()
  }
}



// Login route
export const loginContoller = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
      // if (password !== user.password) {
      //   return res.status(401).json({ message: 'Invalid credentials' });
      // }
  

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Return token and user info
    // res.json({ token, user: { id: user.id, email: user.email, userName:user.userName } });
    res.json({ token, id: user.id, email: user.email, userName:user.userName });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

