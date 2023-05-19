const mailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");

const transporter = mailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendEmail = async (email, nama, messages) => {
  console.group("Mailer is starting...");

  try {
    console.log("-- compiling transporter...");

    const reader = fs.readFileSync(__dirname + "/../html/email.html", {
      encoding: "utf-8",
    });

    console.log("-- html", reader.html);
    const template = handlebars.compile(reader),
      mailOptions = {
        from: "Sekolah Marica <sekolah.marica@gmail.com>",
        replyTo: "noreply.sekolah.marica@gmail.com",
        to: email,
        subject: "Marica Registration",
        html: template({
          nama: nama,
          link: messages,
        }),
        attachments: [
          {
            filename: "logo-compressed.png",
            path: __dirname + "/../../public/images/logo-compressed.png",
            cid: "logo@mani99a.ricarica",
          },
          {
            filename: "background-compressed.png",
            path: __dirname + "/../../public/images/background-compressed.png",
            cid: "background@mani99a.ricaricabg",
          },
        ],
      };
    const mailer = await transporter.sendMail(mailOptions);
    console.log("-- Email is sent!");
    console.groupEnd();
    return mailer.response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
