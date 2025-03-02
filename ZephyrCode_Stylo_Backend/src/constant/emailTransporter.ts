import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dmasnaff@gmail.com', // Replace with your email
    pass: 'jfdr hmib nwcl nvpw',   // Replace with your app-specific password
  },
});

export default transporter;
