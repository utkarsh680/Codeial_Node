const nodemailer = require("../config/nodemailer");

//this is another way of exporting method
exports.resetPasswordMail = async (email, subject, text, token) => {
  try {
    await nodemailer.transporter.sendMail(
      {
        from: "singrishu680@gmail.com",
        to: email,
        subject: subject,
        text,
      },
      (err, info) => {
        if (err) {
          console.log("error in sending  mail", err);
          return;
        }
        console.log("message sent", info);
        return;
      }
    );
  } catch (err) {
    req.flash("error", " Please try again.");
    return res.redirect("back");
  }
};
