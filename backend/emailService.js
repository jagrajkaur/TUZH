import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text, html) => {
    try {
        // Create a nodemailer transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        //Define the email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        //send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        
        return info;    // Return the result of sending the email
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export default sendEmail;