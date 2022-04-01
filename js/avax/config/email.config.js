require('dotenv').config();

module.exports = {
    mail: {
        from: {
            host: 'smtp-mail.outlook.com', // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3',
            },
            auth: {
                user: process.env.EMAIL_USER, // please use outlook, high delivery success rate
                pass: process.env.EMAIL_PASS,
            },
        },
        to: [process.env.EMAIL_RECEIVER],
    },
};
