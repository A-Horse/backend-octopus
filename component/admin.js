import fs from 'fs';
import nodemailer from 'nodemailer';
import R from 'ramda';

const emailpassword = fs.readFileSync('.emailpassword');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'fwrobot@163.com',
    pass: emailpassword
  }
});

const mailOptions = {
  from: '"Octopus 👻" <fwrobot@163.com>', // sender address
  to: 'chenfangwei@outlook.com', // list of receivers
  subject: 'Backup Datebase', // Subject line
  text: 'hi'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
});
