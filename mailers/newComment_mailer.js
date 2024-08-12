const nodemailer = require("../config/nodemailer");

//this is another way of exporting method
exports.newComment = async (comment) => {
  try {
    await nodemailer.transporter.sendMail(
      {
        from: "singrishu680@gmail.com",
        to: comment.user.email,
        subject: "New Comment Published!",
        html: `<h1>Yup, your comment is now published!</h1>`,
      }
      //   },
      //   (err, info) => {
      //     if (err) {
      //       console.log("error in sending  mail", err);
      //       return;
      //     }
      //     console.log("message sent", info);
      //     return;
      //   }
    );
  } catch (err) {
    req.flash("error", " Please try again.");
    return res.redirect("back");
  }
};
