import React from 'react';

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export const WelcomeEmailTemplate: React.FC<WelcomeEmailProps> = ({
  name,
  email,
}) => (
  <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#63264B', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#FDDEDD', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        Welcome to Onbloom!
      </h1>
    </div>
    
    <div style={{ padding: '40px 20px', backgroundColor: '#FDDEDD' }}>
      <h2 style={{ color: '#63264B', fontSize: '24px', marginBottom: '20px' }}>
        Hello {name}!
      </h2>
      
      <p style={{ color: '#572834', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Thank you for joining Onbloom. We&apos;re excited to have you as part of our community.
      </p>
      
      <p style={{ color: '#572834', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
        Your account has been set up with the email address: <strong>{email}</strong>
      </p>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL}
          style={{
            backgroundColor: '#63264B',
            color: '#FDDEDD',
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
        >
          Get Started
        </a>
      </div>
      
      <p style={{ color: '#572834', fontSize: '14px', lineHeight: '1.6' }}>
        If you have any questions, feel free to reach out to our support team.
      </p>
    </div>
    
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#40265C' }}>
      <p style={{ color: '#FDDEDD', fontSize: '12px', margin: '0' }}>
        © 2024 Onbloom. All rights reserved.
      </p>
    </div>
  </div>
);

export const renderWelcomeEmail = (props: WelcomeEmailProps): string => {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #63264B; padding: 40px 20px; text-align: center;">
        <h1 style="color: #FDDEDD; margin: 0; font-size: 28px; font-weight: bold;">
          Welcome to Onbloom!
        </h1>
      </div>
      
      <div style="padding: 40px 20px; background-color: #FDDEDD;">
        <h2 style="color: #63264B; font-size: 24px; margin-bottom: 20px;">
          Hello ${props.name}!
        </h2>
        
        <p style="color: #572834; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining Onbloom. We&apos;re excited to have you as part of our community.
        </p>
        
        <p style="color: #572834; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Your account has been set up with the email address: <strong>${props.email}</strong>
        </p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a
            href="${process.env.NEXT_PUBLIC_APP_URL}"
            style="background-color: #63264B; color: #FDDEDD; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;"
          >
            Get Started
          </a>
        </div>
        
        <p style="color: #572834; font-size: 14px; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
      
      <div style="padding: 20px; text-align: center; background-color: #40265C;">
        <p style="color: #FDDEDD; font-size: 12px; margin: 0;">
          © 2024 Onbloom. All rights reserved.
        </p>
      </div>
    </div>
  `;
};