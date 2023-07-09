import nodemailer from "nodemailer";

const sendResetPasswordEmail = (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rajasekharabudda009@gmail.com",
                pass: "fbaydktpqysfmjfv"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "rajasekharabudda009@gmail.com",
            to: email,
            subject: "Reset Password",
            html: `<div>Hi ${name},<br>
            To reset your password please <a href="http://localhost:3000/resetPassword/${token}" target="_blank">click here</a>.
            <br>
            Thank you,<br>
            Regards,<br>
            Pokemon App.
            </div>`


        }

        transporter.sendMail(mailOptions, (error, res) => {
            if (error) {
                console.log(error);
            }
            console.log(`Mail Sent to the use named ${name}, with email ${email}`)
            transporter.close()
        })
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
        console.log(error);
    }
}

export default sendResetPasswordEmail;