import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_CODE_EMAIL_TEMPLATE,
  WELCOME_TEMPLATE,
} from "./emailTemplates.js";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.username.split(" ")[0];
    this.url = url;
    this.verificationCode = user.verificationCode;
    this.from = `Ahmed Dahir <${process.env.EMAIL_FROM}>`;
  }

  // ✅ Create email transporter (supports Gmail or local SMTP)
  createTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
    }

    // Development environment (e.g. Mailtrap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // ✅ Utility to replace placeholders dynamically
  renderTemplate(template, variables) {
    let html = template;
    for (const key in variables) {
      html = html.replace(new RegExp(`{${key}}`, "g"), variables[key]);
    }
    return html;
  }

  // ✅ Generic send function
  async send(templateHTML, subject, variables = {}) {
    const html = this.renderTemplate(templateHTML, variables);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.createTransport().sendMail(mailOptions);
  }

  // ✅ Send verification code email
  async sendVerificationCode() {
    await this.send(
      VERIFICATION_CODE_EMAIL_TEMPLATE,
      "Your Email Verification Code",
      {
        firstName: this.firstName,
        verificationCode: this.verificationCode,
        year: new Date().getFullYear(),
      }
    );
  }

  async sendWelcome() {
    await this.send(WELCOME_TEMPLATE, "Welcome to Our App!", {
      firstName: this.firstName,
      DashboadURL: this.url,
    });
  }
  // ✅ Send password reset email
  async sendResetPassword() {
    await this.send(PASSWORD_RESET_REQUEST_TEMPLATE, "Reset your password", {
      firstName: this.firstName,
      resetURL: this.url,
    });
  }
}
