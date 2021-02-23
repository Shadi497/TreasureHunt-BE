const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRATION_MS, JWT_SECRET } = require("../config/keys");
const nodemailer = require("nodemailer");

const sendEmail = async (newUser) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io", //mailtrap.io
    port: 587, //25,587,2525
    auth: {
      user: "1d32dc7c9dc7d1", // generated SMTP user
      pass: "979825c7af2357", // generated SMTP password
    },
  });

  let info = await transporter.sendMail({
    from: `"Treasure Hunters 👻" ${testAccount.user}`, // sender address
    to: `${newUser.email}`, // list of receivers
    subject: "Welcome HUNTER 👻", // Subject line
    text: "Thank you for joining our hunters team", // plain text body
  });
  console.log("Message sent: %s", info);
};
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    sendEmail(newUser);
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,

      email: user.email,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
