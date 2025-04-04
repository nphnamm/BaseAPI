import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  console.log("SMTP_HOST", process.env.SMTP_HOST);
  console.log("SMTP_PORT", process.env.SMTP_PORT);
  console.log("SMTP_EMAIL", process.env.SMTP_EMAIL);
  console.log("SMTP_PASSWORD", process.env.SMTP_PASSWORD);
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt("587"),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  // get the path to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  // render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
export default sendMail;
