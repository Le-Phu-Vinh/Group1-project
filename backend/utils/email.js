// backend/utils/email.js

const nodemailer = require('nodemailer');

// Hàm gửi email chung
const sendEmail = async (options) => {
    // 1. Tạo transporter (cần cấu hình mail server/service)
    // CẤU HÌNH: Dùng dịch vụ miễn phí như Gmail, hoặc dịch vụ SMTP chuyên nghiệp.
    // LƯU Ý: Phải bật Less secure app access (hoặc dùng App Passwords) cho Gmail.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // 587 cho TLS hoặc 465 cho SSL
        secure: process.env.NODE_ENV !== 'development', // true cho port 465, false cho các port khác (587)
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD 
        }
    });

    // 2. Định nghĩa các tùy chọn email
    const mailOptions = {
        from: `API AUTH <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.htmlMessage // Bạn có thể thêm nội dung HTML tại đây
    };

    // 3. Gửi email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
