const emailUtils = require('./emailUtils');
const { EMAIL_MSG } = require('./email.msg');

function send() {
    emailUtils.sendEmail(
        EMAIL_MSG.START_INIT_BASIC_DATA.SUBJECT,
        EMAIL_MSG.START_INIT_BASIC_DATA.CONTENT
    );
}

send();
