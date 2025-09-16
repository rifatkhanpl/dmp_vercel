const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Send verification email endpoint
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { email, token, name } = req.body;

    if (!email || !token || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, token, and name are required'
      });
    }

    // Validate email domain
    if (!email.endsWith('@practicelink.com')) {
      return res.status(400).json({
        success: false,
        message: 'Only @practicelink.com email addresses are allowed'
      });
    }

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@practicelink.com',
      to: [email],
      subject: 'Verify Your PracticeLink Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PracticeLink</h1>
            <p style="color: #e8f4fd; margin: 10px 0 0 0;">Career Management Platform</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2563eb; margin-top: 0;">Welcome to PracticeLink!</h2>
            
            <p>Hello ${name},</p>
            
            <p>Thank you for registering with PracticeLink's Data Collection Portal. To complete your account setup and start accessing our platform, please verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            
            <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Important Security Information:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>This verification link will expire in 24 hours</li>
                <li>Only use this link if you recently registered for a PracticeLink account</li>
                <li>If you didn't create this account, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>The PracticeLink Team</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} PracticeLink. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      emailId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send password reset email endpoint
app.post('/api/send-password-reset-email', async (req, res) => {
  try {
    const { email, resetToken, name } = req.body;

    if (!email || !resetToken || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, resetToken, and name are required'
      });
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@practicelink.com',
      to: [email],
      subject: 'Reset Your PracticeLink Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PracticeLink</h1>
            <p style="color: #e8f4fd; margin: 10px 0 0 0;">Career Management Platform</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2563eb; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hello ${name},</p>
            
            <p>We received a request to reset your password for your PracticeLink account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Important Security Information:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>This password reset link will expire in 24 hours</li>
                <li>Only use this link if you requested a password reset</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will not be changed until you click the link and set a new one</li>
              </ul>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>The PracticeLink Team</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} PracticeLink. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
      emailId: data.id
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});