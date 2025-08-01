import { renderWelcomeEmail } from '@/components/email-templates/welcome-email';

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export const emailTemplates = {
  welcome: (data: WelcomeEmailData) => ({
    subject: 'Welcome to Onbloom!',
    html: renderWelcomeEmail(data),
    text: `Welcome to Onbloom, ${data.name}! Thank you for joining our community. Your account has been set up with the email address: ${data.email}. Visit ${process.env.NEXT_PUBLIC_APP_URL} to get started.`,
  }),
} as const;