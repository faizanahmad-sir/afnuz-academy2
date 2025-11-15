import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Only POST allowed" });
  }

  const { name, email, whatsapp, message } = req.body;

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ msg: "All fields are required!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry from ${name}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>WhatsApp:</b> ${whatsapp}</p>
        <p><b>Message:</b> ${message || "No message"}</p>
      `,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Afnuz Academy 🎓",
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for contacting Afnuz Academy.</p>
        <p>Our team will contact you soon on WhatsApp.</p>
      `,
    });

    res.status(200).json({ msg: "Sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Mail sending failed!" });
  }
}
