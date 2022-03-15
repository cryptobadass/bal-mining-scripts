const nodemailer = require('nodemailer');
const config = require('../config/email.config');

module.exports = {
    sendEmail: async (subject, html, res) => {
        try {
            let transporter = nodemailer.createTransport(config.mail.from);

            let info = await transporter.sendMail(
                {
                    from: config.mail.from.auth.user,
                    to: config.mail.to.join(','),
                    subject: subject,
                    html: html,
                },
                (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('send email success');
                        res.status(200).send(info);
                    }
                }
            );
        } catch (err) {
            res.status(500).send(err);
        }
    },
};
