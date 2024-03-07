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
      rejectUnauthorized: false, // Accept self-signed certificates (not recommended for production)
    },
  });
  const mailGenerator = new mailgen({
    theme: 'default',
    product: {
      name: 'NoteApp',
      link: 'NoteApp.com',
    },
  });
  const response = {
    body: {
      name: 'welcome',
      intro: 'welcome to NoteApp Api !',
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
    from: 'mohamed <mohamedalbarbary0@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: subject, // Subject line
    text: 'Hello world?', // plain text body
    html: mail, // html body
  };
  transporter.sendMail(mailOptions);
});
