// Production email service that calls backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export const sendVerificationEmail = async (
  email: string, 
  token: string, 
  name: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token, name }),
    });

    const result: EmailResponse = await response.json();
    
    if (result.success) {
      console.log('✅ Verification email sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send verification email:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string, 
  resetToken: string, 
  name: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-password-reset-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, resetToken, name }),
    });

    const result: EmailResponse = await response.json();
    
    if (result.success) {
      console.log('✅ Password reset email sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send password reset email:', result.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};