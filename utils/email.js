const nodemailer = require('nodemailer');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const Mailgen = require('mailgen');

exports.sendMail = catchAsyncError(async (mailData) => {
  const { senderMail, receiverMail, content, mailHtml, subject } = mailData;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.Sender,
      pass: process.env.App_Password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: `Ta'awun`,
      link: 'Taawun.com',
    },
  });

  const emailContent = {
    body: {
      name: ``,
      intro: `Wish you are good.`,
      table: {
        data: [
          {
            item: content,
          },
          {
            description: mailHtml,
          },
        ],
      },
      outro: 'Thanks',
    },
  };

  const emailBody = mailGenerator.generate(emailContent);

  const mailOptions = {
    from: senderMail,
    to: receiverMail,
    subject: subject,
    text: 'social media app',
    html: emailBody,
  };

  await transporter.sendMail(mailOptions);
});
