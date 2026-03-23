import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import {
  QUESTIONS,
  ANSWER_KEYS,
  PRODUCTS,
  type QuizAnswers,
  type ProductKey,
} from "@/resources/quizData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, answers, resultKeys } = body as {
      name: string;
      email: string;
      phone: string;
      answers: QuizAnswers;
      resultKeys: ProductKey[];
    };

    if (!name || !email || !phone) {
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

    const quizSummaryRows = QUESTIONS.map((q, i) => {
      const key = ANSWER_KEYS[i];
      const val = answers[key];
      const label =
        val !== null ? q.options.find((o) => o.value === val)?.label ?? "—" : "—";
      return `<tr>
        <td style="padding:8px 12px;color:#666;border-bottom:1px solid #f0f0f0;">${q.question}</td>
        <td style="padding:8px 12px;font-weight:600;color:#333;border-bottom:1px solid #f0f0f0;">${label}</td>
      </tr>`;
    }).join("");

    const productRows = (resultKeys ?? [])
      .map((key) => {
        const product = PRODUCTS[key];
        const linksHtml =
          product.links.length > 0
            ? product.links
                .map(
                  (l) =>
                    `<a href="${l.url}" style="color:#0070f3;text-decoration:none;display:block;margin-bottom:4px;">→ ${l.label}</a>`
                )
                .join("")
            : `<span style="color:#999;font-style:italic;">Oferta wkrótce dostępna</span>`;
        return `<div style="margin-bottom:16px;padding:16px;border:2px solid rgba(0,112,243,.2);border-radius:8px;background:rgba(0,112,243,.03);">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">${key}</p>
          <p style="margin:0 0 10px;font-weight:600;color:#333;">${product.name}</p>
          ${linksHtml}
        </div>`;
      })
      .join("");

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#333;max-width:640px;margin:0 auto;padding:20px;">

  <div style="background:linear-gradient(135deg,#0070f3 0%,#0051cc 100%);color:white;padding:30px;border-radius:10px 10px 0 0;text-align:center;">
    <h1 style="margin:0;font-size:26px;">🌡️ Zapytanie z Dobornika Pompy Ciepła</h1>
  </div>

  <div style="background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px;">

    <!-- Contact info -->
    <h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Dane kontaktowe</h2>
    <div style="background:white;border-radius:8px;border-left:4px solid #0070f3;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 6px;"><strong>Imię i nazwisko:</strong> ${name}</p>
      <p style="margin:0 0 6px;"><strong>E-mail:</strong> <a href="mailto:${email}" style="color:#0070f3;">${email}</a></p>
      <p style="margin:0;"><strong>Telefon:</strong> <a href="tel:${phone}" style="color:#0070f3;">${phone}</a></p>
    </div>

    <!-- Quiz answers -->
    <h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Odpowiedzi z dobornika</h2>
    <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      ${quizSummaryRows}
    </table>

    <!-- Recommended products -->
    <h2 style="margin:0 0 16px;font-size:16px;color:#0070f3;text-transform:uppercase;letter-spacing:.5px;">Rekomendowane produkty</h2>
    ${productRows || '<p style="color:#999;font-style:italic;">Brak dopasowania</p>'}

    <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:2px solid #eee;color:#999;font-size:13px;">
      Zgłoszenie otrzymano ${new Date().toLocaleString("pl-PL")}
    </div>
  </div>

</body>
</html>`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_DAIKIN_SUPPORT,
      subject: `🌡️ Zapytanie z dobornika – ${name}`,
      html: htmlContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz inquiry email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
