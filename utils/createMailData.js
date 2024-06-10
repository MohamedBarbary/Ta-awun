exports.createMailData = function (
  senderMail,
  receiverMail,
  content,
  mailHtml,
  subject
) {
  return {
    senderMail: senderMail,
    receiverMail: receiverMail,
    content: content,
    mailHtml: mailHtml,
    subject: subject,
  };
};
