import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../Configs/config.js";

const brevo = new BrevoClient({
    apiKey: env.BREVO_API_KEY,
    timeoutInSeconds: 10,
    maxRetries: 2,
});

export const sendVerificationEmail = async ({
    email,
    username,
    otp,
}) => {
    return await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            name: env.BREVO_SENDER_NAME,
            email: env.BREVO_SENDER_EMAIL,
        },

        to: [
            {
                email,
                name: username,
            },
        ],

        subject: "Verify your CODEZ account",

        textContent: `
Hello ${username},

Your CODEZ verification OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not create a CODEZ account, you can safely ignore this email.

Regards,
CODEZ Team
        `.trim(),

        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your CODEZ account</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;padding:40px;border-radius:12px;">

    <h1>Welcome to CODEZ 🚀</h1>

    <p>Hello ${username},</p>

    <p>Use the following OTP to verify your email address:</p>

    <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        text-align:center;
        padding:20px;
        margin:25px 0;
        background:#f4f4f5;
        border-radius:8px;
    ">
        ${otp}
    </div>

    <p>This OTP will expire in <strong>10 minutes</strong>.</p>

    <p>
        If you didn't create a CODEZ account,
        you can safely ignore this email.
    </p>

    <p>
        Regards,<br>
        CODEZ Team
    </p>

</div>

</body>
</html>
        `.trim(),
    });
};

export const sendForgotPasswordEmail = async ({
    email,
    username,
    otp,
}) => {
    return await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            name: env.BREVO_SENDER_NAME,
            email: env.BREVO_SENDER_EMAIL,
        },

        to: [
            {
                email,
                name: username,
            },
        ],

        subject: "Reset your CODEZ password",

        textContent: `
Hello ${username},

Your CODEZ password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
CODEZ Team
        `.trim(),

        htmlContent: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;padding:40px;border-radius:12px;">

    <h1>Reset your CODEZ password 🔐</h1>

    <p>Hello ${username},</p>

    <p>Use the following OTP to reset your password:</p>

    <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        text-align:center;
        padding:20px;
        margin:25px 0;
        background:#f4f4f5;
        border-radius:8px;
    ">
        ${otp}
    </div>

    <p>This OTP will expire in <strong>10 minutes</strong>.</p>

    <p>
        If you didn't request a password reset,
        you can safely ignore this email.
    </p>

    <p>
        Regards,<br>
        CODEZ Team
    </p>

</div>

</body>
</html>
        `.trim(),
    });
};