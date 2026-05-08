import nodemailer from "nodemailer";

const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || "aryanrshah2109@gmail.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  if (!hasSmtpConfig()) {
    return response.status(500).json({
      error: "Email service is not configured. Add SMTP details in Vercel environment variables."
    });
  }

  try {
    const data = validateContactBody(request.body || {});

    if (!data.ok) {
      return response.status(400).json({ error: data.error });
    }

    const { name, email, message } = data.value;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from: `"Aryan Shah Portfolio" <${process.env.SMTP_USER}>`,
      to: CONTACT_RECEIVER,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2>New portfolio message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `
    });

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Something went wrong. Please try again later." });
  }
}

function validateContactBody(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Please enter a valid name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (message.length < 10 || message.length > 3000) {
    return { ok: false, error: "Message must be between 10 and 3000 characters." };
  }

  return { ok: true, value: { name, email, message } };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
