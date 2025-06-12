export interface EmailTemplateData {
  name: string;
  category: string;
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent?: string;
  variables?: Record<string, any>;
  isPublic?: boolean;
}

export const defaultEmailTemplates: EmailTemplateData[] = [
  // ==================== System Templates ====================
  {
    name: 'Subscription Confirmation',
    category: 'system',
    subject: 'Please confirm your subscription',
    preheader: 'Confirm your email address to start receiving our emails',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Subscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #333333; font-size: 28px; margin: 0 0 20px 0; text-align: center;">Confirm Your Subscription</h1>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi {{firstName}},
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Thank you for subscribing to our mailing list. Please confirm your email address by clicking the button below:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{confirmationUrl}}" style="display: inline-block; padding: 14px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">Confirm Subscription</a>
                  </td>
                </tr>
              </table>

              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 30px 0 0 0; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <a href="{{confirmationUrl}}" style="color: #007bff; word-break: break-all;">{{confirmationUrl}}</a>
              </p>

              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 20px 0 0 0; text-align: center;">
                If you didn't subscribe to this list, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    textContent: `Confirm Your Subscription

Hi {{firstName}},

Thank you for subscribing to our mailing list. Please confirm your email address by clicking the link below:

{{confirmationUrl}}

If you didn't subscribe to this list, you can safely ignore this email.`,
    variables: {
      firstName: 'string',
      confirmationUrl: 'string'
    }
  },

  {
    name: 'Welcome Email',
    category: 'system',
    subject: 'Welcome to {{companyName}}!',
    preheader: 'Thank you for joining us',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to {{companyName}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #007bff; padding: 30px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0; text-align: center;">Welcome to {{companyName}}!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 18px; line-height: 28px; margin: 0 0 20px 0;">
                Hi {{firstName}},
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                We're thrilled to have you on board! You've just joined a community of thousands who are already benefiting from our services.
              </p>

              <h2 style="color: #333333; font-size: 24px; margin: 30px 0 20px 0;">What's Next?</h2>

              <ul style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Complete your profile to get personalized recommendations</li>
                <li style="margin-bottom: 10px;">Explore our features and discover what works best for you</li>
                <li style="margin-bottom: 10px;">Join our community forum to connect with other users</li>
              </ul>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{dashboardUrl}}" style="display: inline-block; padding: 14px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">Get Started</a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 30px 0 0 0;">
                If you have any questions, our support team is here to help. Just reply to this email or visit our help center.
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                Best regards,<br>
                The {{companyName}} Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                You received this email because you signed up for {{companyName}}.<br>
                <a href="{{unsubscribeUrl}}" style="color: #999999;">Unsubscribe</a> |
                <a href="{{preferencesUrl}}" style="color: #999999;">Update Preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    textContent: `Welcome to {{companyName}}!

Hi {{firstName}},

We're thrilled to have you on board! You've just joined a community of thousands who are already benefiting from our services.

What's Next?
- Complete your profile to get personalized recommendations
- Explore our features and discover what works best for you
- Join our community forum to connect with other users

Get Started: {{dashboardUrl}}

If you have any questions, our support team is here to help. Just reply to this email or visit our help center.

Best regards,
The {{companyName}} Team

---
You received this email because you signed up for {{companyName}}.
Unsubscribe: {{unsubscribeUrl}}
Update Preferences: {{preferencesUrl}}`,
    variables: {
      firstName: 'string',
      companyName: 'string',
      dashboardUrl: 'string',
      unsubscribeUrl: 'string',
      preferencesUrl: 'string'
    }
  },

  {
    name: 'Password Reset',
    category: 'system',
    subject: 'Reset your password',
    preheader: 'Reset your password for {{companyName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #333333; font-size: 28px; margin: 0 0 20px 0; text-align: center;">Reset Your Password</h1>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi {{firstName}},
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{resetUrl}}" style="display: inline-block; padding: 14px 30px; background-color: #dc3545; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 30px 0 0 0; text-align: center;">
                This link will expire in 24 hours.
              </p>

              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 20px 0 0 0; text-align: center;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    textContent: `Reset Your Password

Hi {{firstName}},

We received a request to reset your password. Click the link below to create a new password:

{{resetUrl}}

This link will expire in 24 hours.

If you didn't request this, you can safely ignore this email.`,
    variables: {
      firstName: 'string',
      resetUrl: 'string'
    }
  },

  // ==================== Marketing Templates ====================
  {
    name: 'Newsletter',
    category: 'marketing',
    subject: '{{monthName}} Newsletter: {{headline}}',
    preheader: 'Your monthly update from {{companyName}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{monthName}} Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #333333;">
              <h1 style="color: #ffffff; font-size: 36px; margin: 0;">{{companyName}}</h1>
              <p style="color: #cccccc; font-size: 18px; margin: 10px 0 0 0;">{{monthName}} Newsletter</p>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; font-size: 28px; margin: 0 0 20px 0;">{{headline}}</h2>
              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                {{heroText}}
              </p>
              <a href="{{heroLink}}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;">Learn More</a>
            </td>
          </tr>

          <!-- Articles Section -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <h3 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Featured Articles</h3>

              <!-- Article 1 -->
              <div style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eeeeee;">
                <h4 style="color: #333333; font-size: 20px; margin: 0 0 10px 0;">
                  <a href="{{article1Link}}" style="color: #007bff; text-decoration: none;">{{article1Title}}</a>
                </h4>
                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0;">
                  {{article1Summary}}
                </p>
              </div>

              <!-- Article 2 -->
              <div style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eeeeee;">
                <h4 style="color: #333333; font-size: 20px; margin: 0 0 10px 0;">
                  <a href="{{article2Link}}" style="color: #007bff; text-decoration: none;">{{article2Title}}</a>
                </h4>
                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0;">
                  {{article2Summary}}
                </p>
              </div>

              <!-- Article 3 -->
              <div>
                <h4 style="color: #333333; font-size: 20px; margin: 0 0 10px 0;">
                  <a href="{{article3Link}}" style="color: #007bff; text-decoration: none;">{{article3Title}}</a>
                </h4>
                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0;">
                  {{article3Summary}}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
              <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                Follow us on:
              </p>
              <p style="margin: 0 0 20px 0;">
                <a href="{{facebookUrl}}" style="color: #007bff; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="{{twitterUrl}}" style="color: #007bff; text-decoration: none; margin: 0 10px;">Twitter</a>
                <a href="{{linkedinUrl}}" style="color: #007bff; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </p>
              <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 0;">
                {{companyName}} | {{companyAddress}}<br>
                <a href="{{unsubscribeUrl}}" style="color: #999999;">Unsubscribe</a> |
                <a href="{{preferencesUrl}}" style="color: #999999;">Update Preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    isPublic: true,
    variables: {
      monthName: 'string',
      headline: 'string',
      heroText: 'string',
      heroLink: 'string',
      article1Title: 'string',
      article1Summary: 'string',
      article1Link: 'string',
      article2Title: 'string',
      article2Summary: 'string',
      article2Link: 'string',
      article3Title: 'string',
      article3Summary: 'string',
      article3Link: 'string',
      companyName: 'string',
      companyAddress: 'string',
      facebookUrl: 'string',
      twitterUrl: 'string',
      linkedinUrl: 'string',
      unsubscribeUrl: 'string',
      preferencesUrl: 'string'
    }
  },

  {
    name: 'Product Announcement',
    category: 'marketing',
    subject: 'Introducing {{productName}} - {{tagline}}',
    preheader: 'Be the first to try our latest innovation',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Announcement</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header Image -->
          <tr>
            <td style="background-color: #007bff; padding: 60px 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 42px; margin: 0 0 10px 0;">{{productName}}</h1>
              <p style="color: #ffffff; font-size: 20px; margin: 0;">{{tagline}}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 18px; line-height: 28px; margin: 0 0 20px 0;">
                Hi {{firstName}},
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                We're excited to announce the launch of {{productName}}, our latest innovation designed to {{productBenefit}}.
              </p>

              <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Key Features:</h2>

              <ul style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">{{feature1}}</li>
                <li style="margin-bottom: 10px;">{{feature2}}</li>
                <li style="margin-bottom: 10px;">{{feature3}}</li>
              </ul>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{ctaLink}}" style="display: inline-block; padding: 16px 40px; background-color: #28a745; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 4px;">{{ctaText}}</a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 30px 0 0 0; text-align: center;">
                <em>{{specialOffer}}</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px;">
              <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                {{companyName}} | {{companyAddress}}<br>
                <a href="{{unsubscribeUrl}}" style="color: #999999;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    isPublic: true,
    variables: {
      firstName: 'string',
      productName: 'string',
      tagline: 'string',
      productBenefit: 'string',
      feature1: 'string',
      feature2: 'string',
      feature3: 'string',
      ctaText: 'string',
      ctaLink: 'string',
      specialOffer: 'string',
      companyName: 'string',
      companyAddress: 'string',
      unsubscribeUrl: 'string'
    }
  },

  // ==================== Transactional Templates ====================
  {
    name: 'Order Confirmation',
    category: 'transactional',
    subject: 'Order Confirmation #{{orderNumber}}',
    preheader: 'Thank you for your order',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; border-bottom: 2px solid #28a745;">
              <h1 style="color: #28a745; font-size: 28px; margin: 0; text-align: center;">Order Confirmed!</h1>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #333333; font-size: 18px; margin: 0 0 20px 0;">
                Hi {{firstName}},
              </p>

              <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Thank you for your order! We've received your payment and will begin processing your order right away.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8f9fa; padding: 20px; border-radius: 4px;">
                <tr>
                  <td>
                    <p style="color: #333333; font-size: 16px; margin: 0 0 10px 0;">
                      <strong>Order Number:</strong> #{{orderNumber}}<br>
                      <strong>Order Date:</strong> {{orderDate}}<br>
                      <strong>Total Amount:</strong> {{totalAmount}}
                    </p>
                  </td>
                </tr>
              </table>

              <h2 style="color: #333333; font-size: 20px; margin: 30px 0 20px 0;">Order Summary</h2>

              {{orderItems}}

              <table role="presentation" width="100%" cellspacing="0" cellpadding="10" border="0" style="margin-top: 20px;">
                <tr>
                  <td style="text-align: right; color: #666666; font-size: 16px;">Subtotal:</td>
                  <td style="text-align: right; color: #666666; font-size: 16px; width: 100px;">{{subtotal}}</td>
                </tr>
                <tr>
                  <td style="text-align: right; color: #666666; font-size: 16px;">Shipping:</td>
                  <td style="text-align: right; color: #666666; font-size: 16px;">{{shipping}}</td>
                </tr>
                <tr>
                  <td style="text-align: right; color: #666666; font-size: 16px;">Tax:</td>
                  <td style="text-align: right; color: #666666; font-size: 16px;">{{tax}}</td>
                </tr>
                <tr>
                  <td style="text-align: right; color: #333333; font-size: 18px; font-weight: bold; padding-top: 10px; border-top: 2px solid #eeeeee;">Total:</td>
                  <td style="text-align: right; color: #333333; font-size: 18px; font-weight: bold; padding-top: 10px; border-top: 2px solid #eeeeee;">{{totalAmount}}</td>
                </tr>
              </table>

              <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                <h3 style="color: #333333; font-size: 18px; margin: 0 0 10px 0;">Shipping Address</h3>
                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0;">
                  {{shippingAddress}}
                </p>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 40px;">
                <tr>
                  <td align="center">
                    <a href="{{trackOrderUrl}}" style="display: inline-block; padding: 14px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">Track Your Order</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                Questions? Contact our support team at<br>
                <a href="mailto:{{supportEmail}}" style="color: #007bff;">{{supportEmail}}</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                {{companyName}} | {{companyAddress}}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    variables: {
      firstName: 'string',
      orderNumber: 'string',
      orderDate: 'string',
      totalAmount: 'string',
      orderItems: 'string',
      subtotal: 'string',
      shipping: 'string',
      tax: 'string',
      shippingAddress: 'string',
      trackOrderUrl: 'string',
      supportEmail: 'string',
      companyName: 'string',
      companyAddress: 'string'
    }
  }
];

/**
 * Get default templates by category
 */
export function getDefaultTemplatesByCategory(category: string): EmailTemplateData[] {
  return defaultEmailTemplates.filter(template => template.category === category);
}

/**
 * Get all default template categories
 */
export function getDefaultTemplateCategories(): string[] {
  const categories = new Set(defaultEmailTemplates.map(template => template.category));
  return Array.from(categories);
}
