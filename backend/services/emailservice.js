import { Resend } from 'resend';

const resend_api_key = process.env.RESEND_API_KEY

console.log(process.env.EMAIL_FROM);
console.log(process.env.FRONT_END_URL);
const resend = new Resend(resend_api_key);

export async function sendVerificationEmail(to, token) {
    const verifyUrl = `${process.env.FRONT_END_URL}/verify?token=${token}`;
    
    const text = `
    Hi ${to},

    Please verify your email for Devaki Travels.
    Click the link below:
    
    ${verifyUrl}

    This link expires in 15 minutes.


    Thank you,
    Devaki Travels.
    `;
    
    try {
        
        const {data, error} = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to,
          subject: 'Verify Account for Devaki Travels',
          text,
        });

        console.log("Verification email sent to:", to);
        if (error) {
            return console.error({error});
        }

        console.log({data});

    } catch (err) {
        console.error("Error sending email", err);
        throw new Error("Unable to send verification email")
    }
    
}

