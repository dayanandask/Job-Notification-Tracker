import nodemailer from 'nodemailer';

export async function sendJobAlert(to: string, companyName: string, jobTitle: string) {
    // Mock SMTP configuration - in a real B2B app, these come from .env
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
            user: "alerts@kodenest.com",
            pass: "password",
        },
    });

    try {
        // In demo mode, we just log to console instead of trying to send through a fake SMTP
        console.log(`[ALERT] Sending email to ${to}: New opening at ${companyName} - ${jobTitle}`);

        /* 
        const info = await transporter.sendMail({
          from: '"Job Tracker Alert" <alerts@kodenest.com>',
          to,
          subject: `New Career Opportunity: ${companyName}`,
          text: `A new position for "${jobTitle}" was detected on the ${companyName} career page.`,
          html: `<h2 style="color: #8B0000;">New Opening Detected</h2><p><b>${companyName}</b> just posted: <b>${jobTitle}</b></p>`
        });
        */

        return true;
    } catch (error) {
        console.error("Email alert failed:", error);
        return false;
    }
}
