const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendEmail = async (email, messages, callback) => {
  const options = {
    from: "Sekolah Marica <no-reply@gmail.com>",
    to: email,
    subject: "Marica Registration",
    text: `Halooo, terimakasih karena sudah melakukan registrasi pada website kami, untuk selanjutnya, mohon untuk melakukan validasi email anda dengan mengklik link dibawah ini, terimakasih 🙏 
    ${messages}`,
  };
  await transporter.sendMail(options, function (err, info) {
    callback(err, info);
  });
};
