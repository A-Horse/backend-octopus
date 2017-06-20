import winston from 'winston';

export const scheduleLogger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/schedule.log' })
  ]
});
