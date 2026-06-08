import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
  console.log("Verification URL:", verificationUrl); // Log the verification URL for debugging
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Verify your email</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">You're one step away from getting started</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Thanks for signing up! Click the button below to verify your email address and activate your account.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${verificationUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef9c3;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;color:#854d0e;font-size:13px;">
                      ⏳ This link expires in <strong>24 hours</strong>. If it expires, you'll need to request a new one.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                      🔗 If the button doesn't work, open this page in your browser:
                    </p>
                    <a href="${verificationUrl}"
                       style="color:#6366f1;font-size:12px;word-break:break-all;text-decoration:none;">
                      ${verificationUrl}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.5;">
                If you didn't create an account, you can safely ignore this email.<br>
                This email was sent automatically — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  });
};
