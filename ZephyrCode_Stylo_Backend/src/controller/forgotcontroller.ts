import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from '../constant/emailTransporter';
import { prisma, dbDisconnector } from '../prisma/database';


const JWT_SECRET = '5EGmFYEAet6R8Cx5iuQpm736OEQFP8hOvoStHtZAEFs=';

const users: Record<string, { password: string; verificationCode?: string }> = {};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
  
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return res.status(404).json({ message: 'User with this email does not exist.' });
        }
        
      const mailOptions = {
        from: 'dmasnaff@gmail.com',
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info);
      
      // Optionally store verification code
      users[email] = { ...users[email], verificationCode };
      
      res.json({ message: 'Verification code sent.',verificationCode });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ 
        message: 'Failed to send email.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

export const verifyCode = (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: 'Email and code are required.' });

  if (users[email]?.verificationCode === code) {
    return res.json({ message: 'Code verified.' });
  }
  res.status(400).json({ message: 'Invalid verification code.' });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
  
      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error.' });
    } finally {
      // Ensure database disconnection
      dbDisconnector();
    }
  };
