import nodemailer from "nodemailer";
const sendEmail = async (email, otp , attachments = []) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user:process.env.emailSender,
            pass: process.env.passwordEmailSender
        }
    });
    const mailOptions = { 
        from: process.env.emailSender,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
        attachments
    };
    await transporter.sendMail(mailOptions);
};
export default sendEmail