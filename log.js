import winston from 'winston';

export const TdScheduleLogger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/td-schedule.log' })
  ]
});

export const TdLogger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/td.log' })
  ]
});

export const BackupLogger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/backup.log' })
  ]
});

export const AdminLogger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/admin.log' })
  ]
});
