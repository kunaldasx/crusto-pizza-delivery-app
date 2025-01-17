export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #dc143b, #e76a4c); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
			<img src="https://res.cloudinary.com/daascfoe7/image/upload/v1753539694/users/837ccf6c-ccf7-47ec-981e-cf0b4bc1712a_6_upnbyk.png" alt="Crusto logo" height="100">
		</div>
        <p>Hello,</p>
        <p>Thank you for signing up! Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e76a4c;">{verificationCode}</span>
        </div>
        <p>Enter this code on the verification page to complete your registration.</p>
        <p>This code will expire in 15 minutes for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #dc143b, #e76a4c); padding: 20px;    text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
			<img src="https://res.cloudinary.com/daascfoe7/image/upload/v1753539694/users/837ccf6c-ccf7-47ec-981e-cf0b4bc1712a_6_upnbyk.png" alt="Crusto logo" height="100">
		</div>
        <p>Hello,</p>
        <p>We're writing to confirm that your password has been successfully reset.</p>
        <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #e76a4c; color: white; width: 50px; height: 50px;    line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
                ✓
            </div>
        </div>
        <p>If you did not initiate this password reset, please contact our support team immediately.</p>
        <p>For security reasons, we recommend that you:</p>
        <ul>
            <li>Use a strong, unique password</li>
            <li>Enable two-factor authentication if available</li>
            <li>Avoid using the same password across multiple sites</li>
        </ul>
        <p>Thank you for helping us keep your account secure.</p>
        <p>Best regards,<br>Your App Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #dc143b, #e76a4c); padding: 20px;   text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
			<img src="https://res.cloudinary.com/daascfoe7/image/upload/v1753539694/users/837ccf6c-ccf7-47ec-981e-cf0b4bc1712a_6_upnbyk.png" alt="Crusto logo" height="100">
		</div>
        <p>Hello,</p>
        <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{resetURL}" style="background-color: #e76a4c; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>Your App Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Verify Your Email</title>
</head>

<body
	style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: linear-gradient(to right,#dc143b,#e76a4c); padding: 20px; text-align: center;">
		<h1 style="color: white; margin: 0; text-align: center;">Welcome to {companyName} 🍕</h1>
	</div>
	<div
		style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
		<div style="width: 100%; display: flex; justify-content: center; align-items: center;">
			<img src="https://res.cloudinary.com/daascfoe7/image/upload/v1753539694/users/837ccf6c-ccf7-47ec-981e-cf0b4bc1712a_6_upnbyk.png" alt="Crusto logo" height="100">
		</div>
		<p>Hi {customerName},</p>
		<p>Welcome to {companyName}, where delicious pizzas are just a tap away! 🎉</p>
		<div style="text-align: center; margin: 30px 0;">
			<a class="order-btn"
				style="font-size: 18px; font-weight:normal; color: whitesmoke; background-color: #dc143b; text-decoration: none; padding: 10px; border-radius: 5px;"
				onmouseover="this.style.backgroundColor= '#e76a4c'" onMouseOut="this.style.backgroundColor='#dc143b'"
				href={productPageURL}>
				Order Now
			</a>
		</div>
		<p>💥 Get started with a special treat! Use code WELCOME10 at checkout to enjoy 10% off your first order.</p>
		<p>📲 Start your pizza journey now!</p>

		<p>Happy eating,<br>The {companyName} Team</p>
	</div>
	<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
		<p>This is an automated message, please do not reply to this email.</p>
	</div>
</body>

</html>
`;

export const INGREDIENT_OUT_OF_STOCK_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingredient Low Stock Alert {ingredient_name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .alert-header {
            background-color: #dc3545;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin-bottom: 20px;
        }
        .info-section {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #dc3545;
            margin: 15px 0;
        }
        .actions-section {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }
        h2 {
            color: #dc3545;
            margin-top: 0;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .highlight {
            font-weight: bold;
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert-header">
            <h1>🚨 INGREDIENT LOW STOCK ALERT</h1>
        </div>
        
        <p>Dear Admin,</p>
        
        <p>This is an automated notification from your inventory management system [{companyName}].</p>
        
        <div class="info-section">
            <h2>Stock Alert Details</h2>
            <p><strong>Item:</strong> <span class="highlight">{ingredientName}</span></p>
            <p><strong>Current Stock Level:</strong> <span class="highlight">{stock} units</span></p>
        </div>
        
        <div class="info-section">
            <h2>Impact Assessment</h2>
            <p>This ingredient is required for <strong>{pizza_count}</strong> menu items and may affect order fulfillment.</p>
        </div>
        
        <div class="actions-section">
            <h2>Recommended Actions</h2>
            <ul>
                <li>Reorder immediately from supplier</li>
                <li>Update the ingredient stock</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>This alert was generated automatically on <strong>{date}</strong> at <strong>{time}</strong></p>
            <p>Inventory Management System {company_name}</p>
        </div>
    </div>
</body>
</html>
`;
