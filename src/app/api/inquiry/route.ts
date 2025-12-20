import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interests, additional, credit } = body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Form interests text
    const interestsMap: Record<string, string> = {
      ac: "Klimatyzacje",
      heatpump: "Pompy ciepła",
      airpurifier: "Oczyszczacze powietrza",
      installation: "Montaż",
      maintenance: "Serwis",
    };

    const interestsList = interests
      .map((i: string) => interestsMap[i] || i)
      .join(", ");

    // HTML template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0070f3 0%, #0051cc 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0070f3;
          }
          .field-label {
            font-weight: 600;
            color: #0070f3;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .field-value {
            font-size: 16px;
            color: #333;
          }
          .interests-list {
            list-style: none;
            padding: 0;
          }
          .interests-list li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
          }
          .interests-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #0070f3;
            font-weight: bold;
          }
          .credit-badge {
            display: inline-block;
            background: #ffd700;
            color: #333;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Nowe zgłoszenie z strony</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Imię i nazwisko</div>
            <div class="field-value">${name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          <div class="field">
            <div class="field-label">Numer telefonu</div>
            <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          
          <div class="field">
            <div class="field-label">Co Cię interesuje</div>
            <div class="field-value">
              <ul class="interests-list">
                ${interests.map((i: string) => `<li>${interestsMap[i] || i}</li>`).join("")}
              </ul>
            </div>
          </div>
          
          ${
            additional
              ? `
          <div class="field">
            <div class="field-label">Dodatkowe informacje</div>
            <div class="field-value">${additional}</div>
          </div>
          `
              : ""
          }
          
          ${
            credit
              ? `
          <div class="field">
            <div class="field-label">Kredyt</div>
            <div class="field-value">
              <span class="credit-badge">⭐ Klient interesuje się kredytem</span>
            </div>
          </div>
          `
              : ""
          }
          
          <div class="footer">
            Zgłoszenie otrzymano ${new Date().toLocaleString("pl-PL")}
          </div>
        </div>
      </body>
    </html>
    `;

    // sending mail
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_DAIKIN_SUPPORT,
      subject: `🎯 Nowe zgłoszenie od ${name}`,
      html: htmlContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
