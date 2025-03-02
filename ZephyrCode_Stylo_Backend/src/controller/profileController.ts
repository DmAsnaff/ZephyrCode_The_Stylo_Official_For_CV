import { Request, Response } from 'express';
import { prisma } from '../prisma/database';

export const getUserDetails = async (req: Request, res: Response) => {
    // const email = req.headers['x-user-email'];
    const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const updateUserProfile = async(req: Request, res: Response) =>{
    const { email, fullName, userName, address, phoneNumber } = req.body;

    try {
    //   let profilePicture = req.body.profilePicture;
  
      // If there's a new profile picture uploaded, handle the file upload
    //   if (req.file) {
        // Move file from temporary folder to desired location
        // const tempPath = req.file.path;
        // const targetPath = path.join(__dirname, 'uploads', `${Date.now()}_${req.file.originalname}`);
        // fs.renameSync(tempPath, targetPath);
  
        // Set the profile picture path to the target path
        // profilePicture = targetPath;
      
  
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          fullName,
          userName,
          address,
          phoneNumber,
        //   profilePicture,
        },
      });
  
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }

};