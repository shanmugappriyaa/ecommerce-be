const nodeMailer = require("nodemailer");
const crypto = require("crypto");
const { error } = require("console");

const randomStringGenerate = () => {
  // return crypto.randomBytes(len).toString("hex");
 return  Math.random().toString(36).substr(2, 6)
};

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: "pspri03@gmail.com",
    pass: "ixdbtbkyzkumiqlh",
  },
});

const mailOptions = {
  from: "pspri03@gmail.com",
  to: "",
  subject: " Reset Password",
  text: "",
  html: "",
};

module.exports = { transporter, mailOptions , randomStringGenerate};
