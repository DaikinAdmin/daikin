import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, info, slot } = body as {
      name: string;
      phone: string;
      email?: string;
      info?: string;
      slot: string;
    };

    if (!name || !phone || !slot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#333;max-width:640px;margin:0 auto;padding:20px;">

  <div style="background:linear-gradient(135deg,#0070f3 0%,#0051cc 100%);color:white;padding:30px;border-radius:10px 10px 0 0;text-align:center;">
    <h1 style="margin:0;font-size:26px;">📅 Zgłoszenie wizyty w salonie</h1>
  </div>

  <div style="background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px;">

    <h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Dane kontaktowe</h2>
    <div style="background:white;border-radius:8px;border-left:4px solid #0070f3;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 6px;"><strong>Imię i nazwisko:</strong> ${name}</p>
      <p style="margin:0 0 6px;"><strong>Telefon:</strong> <a href="tel:${phone}" style="color:#0070f3;">${phone}</a></p>
      ${email ? `<p style="margin:0 0 6px;"><strong>E-mail:</strong> <a href="mailto:${email}" style="color:#0070f3;">${email}</a></p>` : ""}
    </div>

    <h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Wybrany termin</h2>
    <div style="background:white;border-radius:8px;border-left:4px solid #22c55e;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-weight:700;font-size:18px;color:#333;">📅 ${slot}</p>
    </div>

    ${
      info
        ? `<h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Informacje dodatkowe</h2>
    <div style="background:white;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #eee;">
      <p style="margin:0;color:#555;">${info.replace(/\n/g, "<br>")}</p>
    </div>`
        : ""
    }

    <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:2px solid #eee;color:#999;font-size:13px;">
      Zgłoszenie otrzymano ${new Date().toLocaleString("pl-PL")}
    </div>
  </div>

</body>
</html>`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: ["a.ivanovic@ammproject.com", "m.sokolowska@ammproject.com"],
      subject: `📅 Zgłoszenie wizyty – ${name} – ${slot}`,
      html: htmlContent,
      ...(email ? { replyTo: email } : {}),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visit inquiry email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
