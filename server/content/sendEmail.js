import { createTransport } from "nodemailer";

async function sendEmail(res, data) {
  const { subject, user, html } = data;
  const transporter = createTransport({
    service: "gmail",
    host: process.env.EM_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EM_LOGIN,
      pass: process.env.EM_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `"Senderson Company" <${process.env.EM_OWNER}>`,
    to: user,
    subject,
    html,
  });
}

export { sendEmail };
