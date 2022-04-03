require('dotenv').config({ path: '../../../.env' });

module.exports = {
    mail: {
        from: {
            host: 'smtp-mail.outlook.com', // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: 'aiguoli2021@outlook.com', // please use outlook, high delivery success rate
                pass: 'Dewyze0612',
            },
        },
        to: ['aiguoli0612@gmail.com'],
    },
};
