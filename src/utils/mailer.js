require('dotenv').config();
const nodemailer = require('nodemailer');
const getLogger = require('../utils/logger');
const logger = getLogger('MAILER');

const sendMail = async (to, subject, text, html) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_AUTH_USER,
            pass: process.env.MAIL_AUTH_PASSWORD,
        },
    });
    const options = {
        from: process.env.MAIL_AUTH_USER,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        const info = await transport.sendMail(options);
        logger.info(`Message sent: ${info.response}`);
    } catch (error) {
        logger.error(`Error: ${error}`);
    }
}

module.exports = {sendMail};