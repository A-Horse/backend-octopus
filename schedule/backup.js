import R from 'ramda';
import fs from 'fs';
import nodemailer from 'nodemailer';
import moment from 'moment';
import appRoot from 'app-root-path';
import { BackupLogger } from '../log';

function backupDatabaseByEmail() {
  const emailpassword = fs.readFileSync(appRoot + '/.emailpassword');

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
    text: `Master, there is ${moment().format('YYYY-MM-DD')} database backup.`,
    attachments: [
      {
        filename: `${moment().format('YYYY-MM-DD')}-Database.sqlite`,
        streamSource: fs.createReadStream(appRoot + '/db/db-DEV.sqlite')
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    BackupLogger.info('Message %s sent: %s', info.messageId, info.response);
  });
}

export function handleTodoWhenEveryDayBegin() {
  backupDatabaseByEmail();
}
