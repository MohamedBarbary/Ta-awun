const nodemailer = require('nodemailer');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const mailgen = require('mailgen');
exports.sendMail = catchAsyncError(async (receiver, mailHtml, subject) => {
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
  const mailGenerator = new mailgen({
    theme: 'default',
    product: {
      name: 'Taawun',
      link: 'Taawun.com',
    },
  });
  const response = {
    body: {
      name: 'welcome',
      intro: 'welcome to Taawun!',
      table: {
        data: [
          {
            item: 'wish your good ',
          },
          {
            description: mailHtml,
          },
        ],
      },
      outro: 'thank you',
    },
  };
  const mail = mailGenerator.generate(response);

  const mailOptions = {
    from: 'mohamed <mohamedalbarbary0@gmail.com>',
    to: receiver,
    subject: subject,
    text: 'Hello world?',
    html: mail,
  };
  transporter.sendMail(mailOptions);
});
