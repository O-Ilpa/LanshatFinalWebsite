import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
// import speakeasy from "speakeasy";
// import nodemailer from "nodemailer";
import verifyMiddleWare from "./verifyMiddleWare.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// const sendCodeToEmail = (code, email) => {

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "omarilpa09@gmail.com",
//       pass: "fdecormslqjlysws",
//     },
//   });

//   var mailOptions = {
//     from: "omarilpa09@gmail.com",
//     to: email,
//     subject: "Verification Code for Note App",
//     text: "Enter the Code Below to Verify you Email \n " + code,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// };
// const generateOTPCode = () => {
//   const secret = speakeasy.generateSecret({ length: 20 });
//   const code = speakeasy.totp({
//     secret: secret.base32,
//     encoding: "base32",
//   });
//   return code;
// };
// const verifyOTP = (usersCode, newUser) => {
//   if (newUser.codeDigit != null)
//     return newUser.codeDigit.toString().trim() === usersCode.trim();
// };
router.get("/home", verifyMiddleWare, async (req, res) => {
  if (req.user == null) {
    res.status(500);
  }
});
const addUser = async (name, pass, email) => {
  const hashedPassword = await bcrypt.hash(pass, 10);
  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  await newUser.save();
  console.log(await User.find({}));
};
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Try to find user by email or customerNumber
    const user = await User.findOne({ $or: [ { email }, { customerNumber: email } ] });
    if (!user) {
      return res.json({ message: "User doesn't Exist", success: false });
    }
    const passIsTrue = await bcrypt.compare(password, user.password);
    if (passIsTrue) {
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.TOKEN_SECRET
      );
      return res.json({
        success: true,
        message: "User Loged in Succefully",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Wrong credentials" });
    }
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

router.get("/verify", verifyMiddleWare, async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});

setTimeout(async () => {
  const unVerifiedUsers = await User.find({ verified: false });
  unVerifiedUsers.forEach(async (user) => {
    await user.deleteOne();
  });
}, 5 * 60 * 1000);

// --- FAVORITES ENDPOINTS ---
// Get user's favorites
router.get("/favorites", verifyMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Toggle (add/remove) a favorite
router.post("/favorites", verifyMiddleWare, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "Missing productId" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const index = user.favorites.indexOf(productId);
    let action;
    if (index === -1) {
      user.favorites.push(productId);
      action = "added";
    } else {
      user.favorites.splice(index, 1);
      action = "removed";
    }
    await user.save();
    res.json({ success: true, action, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove a favorite by ID
router.delete("/favorites/:id", verifyMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.favorites = user.favorites.filter(fav => fav !== id);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user profile (name/password)
router.put("/profile", verifyMiddleWare, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (name) user.name = name;
    if (password) {
      const bcrypt = await import('bcrypt');
      user.password = await bcrypt.default.hash(password, 10);
    }
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { title, firstName, lastName, customerNumber, email, password, companyName, phone, location } = req.body;
    if (!title || !firstName || !lastName || !customerNumber || !email || !password) {
      return res.json({ success: false, message: "يرجى ملء جميع الحقول المطلوبة." });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { customerNumber }] });
    if (existingUser) {
      return res.json({ success: false, message: "البريد الإلكتروني أو رقم العميل مستخدم بالفعل." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      title,
      firstName,
      lastName,
      customerNumber,
      email,
      password: hashedPassword,
      companyName,
      phone,
      location,
      name: `${firstName} ${lastName}`,
    });
    await newUser.save();
    return res.json({ success: true, message: "تم إنشاء الحساب بنجاح!" });
  } catch (err) {
    return res.json({ success: false, message: "حدث خطأ أثناء التسجيل." });
  }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '718770835110-efpiqrebf5b4jg0d1oeo0lrc29o7qeoj.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google OAuth login/signup
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Missing Google token' });
    // Verify token
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ success: false, message: 'Invalid Google token' });
    const { email, name, given_name, family_name } = payload;
    if (!email) return res.status(400).json({ success: false, message: 'Google account missing email' });
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Generate a unique customer number
      let customerNumber;
      let unique = false;
      while (!unique) {
        customerNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
        unique = !(await User.findOne({ customerNumber }));
      }
      user = new User({
        email,
        name: name || `${given_name || ''} ${family_name || ''}`.trim(),
        firstName: given_name || '',
        lastName: family_name || '',
        title: 'Mr', // Default, you can improve this
        customerNumber,
        password: '', // Not used for Google users
      });
      await user.save();
    }
    // Issue JWT
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.TOKEN_SECRET
    );
    return res.json({ success: true, token: jwtToken, message: 'تم تسجيل الدخول عبر جوجل بنجاح' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'فشل التحقق من جوجل', error: err.message });
  }
});

export default router;
