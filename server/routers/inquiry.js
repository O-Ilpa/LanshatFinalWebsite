import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

const router = express.Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Helper: create transporter for info or sales
function getTransporter(type = "info") {
  console.log("SMTP Config:", {
    type,
    salesUser: process.env.ZOHO_USER_SALES,
    salesPass: process.env.ZOHO_PASS_SALES ? "***" : "missing",
    infoUser: process.env.ZOHO_USER_INFO,
    infoPass: process.env.ZOHO_PASS_INFO ? "***" : "missing"
  });
  
  if (type === "sales") {
    return nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER_SALES,
        pass: process.env.ZOHO_PASS_SALES,
      },
    });
  } else {
    return nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER_INFO,
        pass: process.env.ZOHO_PASS_INFO,
      },
    });
  }
}

// Main inquiry form (machines/products) - send to sales, confirm from info
router.post("/", async (req, res) => {
  const {
    message,
    name,
    email,
    phone,
    company,
    zip,
    country,
    isDealer,
    receiveOffers,
  } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "يرجى ملء جميع الحقول المطلوبة." });
  }

  try {
    // Send to sales@lanshat.com
    const salesTransporter = getTransporter("sales");
    const mailOptions = {
      from: `Lanshat Website <${process.env.ZOHO_USER_SALES}>`,
      to: "sales@lanshat.com",
      subject: `استفسار عن السعر من الموقع (${name})`,
      replyTo: email,
      html: `
        <h2>استفسار عن السعر</h2>
        <p><b>الاسم:</b> ${name}</p>
        <p><b>البريد الإلكتروني:</b> ${email}</p>
        <p><b>رقم الهاتف:</b> ${phone || "-"}</p>
        <p><b>اسم الشركة:</b> ${company || "-"}</p>
        <p><b>الرمز البريدي & المدينة:</b> ${zip || "-"}</p>
        <p><b>الدولة:</b> ${country || "-"}</p>
        <p><b>تاجر؟</b> ${isDealer ? "نعم" : "لا"}</p>
        <p><b>استلام عروض مماثلة؟</b> ${receiveOffers ? "نعم" : "لا"}</p>
        <hr />
        <p><b>الرسالة:</b></p>
        <pre style="font-family:inherit">${message}</pre>
      `,
    };
    await salesTransporter.sendMail(mailOptions);

    // Send confirmation from info@lanshat.com
    const infoTransporter = getTransporter("info");
    const confirmationHtml = `
      <div style="direction:rtl;font-family:'Cairo',Arial,sans-serif;background:#f7f7fa;padding:0;margin:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #0001;">
          <tr style="background:#2563eb;">
            <td style="padding:16px;text-align:center;">
              <img src='https://lanshat.com/assets/logo.webp' alt='لنشات' style='height:48px;margin-bottom:8px;'/><br/>
              <span style="color:#fff;font-size:22px;font-weight:bold;">لنشات</span>
            </td>
          </tr>
          <tr><td style="padding:24px 24px 8px 24px;">
            <h2 style="color:#2563eb;margin:0 0 12px 0;font-size:20px;">شكرًا لتواصلك معنا!</h2>
            <p style="color:#222;font-size:16px;margin:0 0 12px 0;">عزيزي/عزيزتي <b>${name}</b>،</p>
            <p style="color:#444;font-size:15px;margin:0 0 12px 0;">لقد استلمنا استفسارك وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
            <div style="background:#f1f5f9;border-radius:8px;padding:12px 16px;margin:16px 0;">
              <b>محتوى استفسارك:</b>
              <div style="color:#333;font-size:15px;margin-top:8px;white-space:pre-line;">${message}</div>
            </div>
            <p style="color:#2563eb;font-size:15px;margin:0 0 12px 0;">فريق لنشات يشكرك على ثقتك بنا.</p>
          </td></tr>
          <tr><td style="padding:0 24px 24px 24px;">
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;"/>
            <div style="text-align:center;">
              <a href="https://wa.me/201224070331" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://facebook.com/AltamayozforRealEstateInvestment" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://linkedin.com/YOUR_PAGE" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="mailto:info@lanshat.com" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" alt="Email" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://instagram.com/YOUR_PAGE" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" width="24" height="24" style="vertical-align:middle;"/></a>
            </div>
            <div style="color:#888;font-size:13px;margin-top:12px;text-align:center;">
              <div>القاهرة، مصر | info@lanshat.com | +20 122 407 0331</div>
              <div style="margin-top:4px;">© ${new Date().getFullYear()} لنشات. جميع الحقوق محفوظة.</div>
            </div>
          </td></tr>
        </table>
      </div>
    `;
    await infoTransporter.sendMail({
      from: `Lanshat Website <${process.env.ZOHO_USER_INFO}>`,
      to: email,
      subject: "تم استلام استفسارك - لنشات",
      html: confirmationHtml,
    });

    res.json({ success: true, message: "تم إرسال الاستفسار بنجاح!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء إرسال البريد الإلكتروني." });
  }
});

// Contact form endpoint with file upload and size limit
router.post("/contact", (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "الملف المرفق كبير جداً. الحد الأقصى 5 ميجابايت." });
    } else if (err) {
      return res.status(400).json({ success: false, message: "حدث خطأ أثناء رفع الملف." });
    }
    next();
  });
}, async (req, res) => {
  const { name, email, phone, inquiryType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "يرجى ملء جميع الحقول المطلوبة." });
  }

  try {
    // Send to info@lanshat.com
    const infoTransporter = getTransporter("info");
    const mailOptions = {
      from: `Lanshat Website <${process.env.ZOHO_USER_INFO}>`,
      to: "info@lanshat.com",
      subject: `رسالة تواصل من الموقع (${name}) - ${inquiryType || "استفسار"}`,
      replyTo: email,
      html: `
        <h2>رسالة تواصل من الموقع</h2>
        <p><b>الاسم:</b> ${name}</p>
        <p><b>البريد الإلكتروني:</b> ${email}</p>
        <p><b>رقم الهاتف:</b> ${phone || "-"}</p>
        <p><b>نوع الاستفسار:</b> ${inquiryType || "-"}</p>
        <hr />
        <p><b>الرسالة:</b></p>
        <pre style="font-family:inherit">${message}</pre>
      `,
    };
    // If file is attached, add as attachment
    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname,
        content: req.file.buffer
      }];
    }
    await infoTransporter.sendMail(mailOptions);

    // Send confirmation from info@lanshat.com
    const confirmationHtml = `
      <div style="direction:rtl;font-family:'Cairo',Arial,sans-serif;background:#f7f7fa;padding:0;margin:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #0001;">
          <tr style="background:#2563eb;">
            <td style="padding:16px;text-align:center;">
              <img src='https://lanshat.com/assets/logo.webp' alt='لنشات' style='height:48px;margin-bottom:8px;'/><br/>
              <span style="color:#fff;font-size:22px;font-weight:bold;">لنشات</span>
            </td>
          </tr>
          <tr><td style="padding:24px 24px 8px 24px;">
            <h2 style="color:#2563eb;margin:0 0 12px 0;font-size:20px;">شكرًا لتواصلك معنا!</h2>
            <p style="color:#222;font-size:16px;margin:0 0 12px 0;">عزيزي/عزيزتي <b>${name}</b>،</p>
            <p style="color:#444;font-size:15px;margin:0 0 12px 0;">لقد استلمنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
            <div style="background:#f1f5f9;border-radius:8px;padding:12px 16px;margin:16px 0;">
              <b>محتوى رسالتك:</b>
              <div style="color:#333;font-size:15px;margin-top:8px;white-space:pre-line;">${message}</div>
            </div>
            <p style="color:#2563eb;font-size:15px;margin:0 0 12px 0;">فريق لنشات يشكرك على ثقتك بنا.</p>
          </td></tr>
          <tr><td style="padding:0 24px 24px 24px;">
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;"/>
            <div style="text-align:center;">
              <a href="https://wa.me/201224070331" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://facebook.com/AltamayozforRealEstateInvestment" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://linkedin.com/YOUR_PAGE" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="mailto:info@lanshat.com" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" alt="Email" width="24" height="24" style="vertical-align:middle;"/></a>
              <a href="https://instagram.com/YOUR_PAGE" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" width="24" height="24" style="vertical-align:middle;"/></a>
            </div>
            <div style="color:#888;font-size:13px;margin-top:12px;text-align:center;">
              <div>القاهرة، مصر | info@lanshat.com | +20 122 407 0331</div>
              <div style="margin-top:4px;">© ${new Date().getFullYear()} لنشات. جميع الحقوق محفوظة.</div>
            </div>
          </td></tr>
        </table>
      </div>
    `;
    await infoTransporter.sendMail({
      from: `Lanshat Website <${process.env.ZOHO_USER_INFO}>`,
      to: email,
      subject: "تم استلام رسالتك - لنشات",
      html: confirmationHtml,
    });

    res.json({ success: true, message: "تم إرسال رسالتك بنجاح!" });
  } catch (err) {
    console.error("Contact email send error:", err);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء إرسال البريد الإلكتروني." });
  }
});

router.post("/quote", upload.single("file"), async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    const items = JSON.parse(req.body.items || "[]");
    // Save to DB (optional: create a QuoteRequest model)
    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: "Zoho",
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });
    let html = `<h2>طلب عرض سعر جديد</h2>
      <p><b>الاسم:</b> ${name}</p>
      <p><b>البريد الإلكتروني:</b> ${email}</p>
      <p><b>الهاتف:</b> ${phone || "-"}</p>
      <p><b>الشركة:</b> ${company || "-"}</p>
      <p><b>الرسالة:</b><br>${message.replace(/\n/g, "<br>")}</p>
      <h3>العناصر المطلوبة:</h3>
      <ul>${items.map(i => `<li>${i.name} (${i.machineType || i.type || "-"})</li>`).join("")}</ul>`;
    const mailOptions = {
      from: process.env.ZOHO_USER,
      to: process.env.QUOTE_RECEIVER || process.env.ZOHO_USER,
      subject: "طلب عرض سعر جديد من الموقع",
      html,
      attachments: req.file ? [{ filename: req.file.originalname, content: req.file.buffer }] : [],
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "فشل إرسال الطلب", error: err.message });
  }
});

export default router;
