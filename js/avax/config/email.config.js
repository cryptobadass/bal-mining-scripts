const dot = require('dotenv').config({ path: '../../../.env' });
console.log('dot=%s', JSON.stringify(dot));

module.exports = {
    mail: {
        from: {
            host: 'smtp-mail.outlook.com', // hostname
            secure: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: process.env.EMAIL_USER, // please use outlook, high delivery success rate
                pass: process.env.EMAIL_PASS,
            },
        },
        to: [process.env.EMAIL_RECEIVER],
    },
};
