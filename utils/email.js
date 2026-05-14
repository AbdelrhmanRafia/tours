const nodemailer = require("nodemailer");
const process = require("node:process");
const htmlToText = require("html-to-text");
const path = require("path");
const pug = require("pug");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Abdelrhman Rafia <${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.firstName = user.name.split(" ")[0];
  }
  newTransport() {
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
  }
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "email",
      `${template}.pug`,
    );
    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)",
    );
  }
}
// const sendEmail = async function (options) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.BREVO_EMAIL,
//       pass: process.env.BREVO_SMTP_KEY,
//     },
//   });
//   const mailOptions = {
//     from: `Abdelrhman Rafia <${process.env.EMAIL_FROM}>`,
//     to: options.to,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   const info = await transporter.sendMail(mailOptions);
//   console.log(info);
// };
module.exports = Email;
