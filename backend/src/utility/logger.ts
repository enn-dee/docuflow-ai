const winston = require('winston');
const path = require('path');

// const errorLogFile = path.join(__dirname, `error-${new Date().toISOString().split('T')[0]}.log`);

 const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // new winston.transports.File({ filename: errorLogFile, level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger