const nodemailer = require("../config/nodemailer");

//this is another way of exporting method
exports.newComment = async (comment) => {
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')
  try {
    await nodemailer.transporter.sendMail(
      {
        from: "singrishu680@gmail.com",
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString,
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
