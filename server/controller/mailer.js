import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

let nodeConfig = {
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  }
}

let transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js"
  }
});



export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the mail
  var email = {
    body: {
      name: username,
      intro: text || 'Welcome to my world, watch me excel as a software engineer very soon! I mean very SOON!',
      outro: "Let's get it going"
    }
  };

  var emailBody = mailGenerator.generate(email);
  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody
  };

  try {
    // send mail
    await transporter.sendMail(message);
    return res.status(200).send({ msg: "You should receive an email from us shortly" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
