import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, text, from = "Ferran<ferran@updates.zeke.so>" }: EmailOptions) {
  try {
    // Ensure at least one content type is provided
    if (!html && !text) {
      throw new Error('Either html or text content must be provided');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailData: any = {
      from,
      to,
      subject,
    };

    if (html) emailData.html = html;
    if (text) emailData.text = text;

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export { resend };
