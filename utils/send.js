import nodemailer from 'nodemailer'


export function send( to, subject, text ) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.bikeshoping@gmail.com',
            pass: 'vobutxazlfeyvkmm'
        }
    });

    let mailOptions = {
        from: 'info.bikeshoping@gmail.com',
        to: `${to}`,
        subject: `${subject}`,
        text: `${text}`,
    };
    
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err)
        if (data) console.log(data)
    });
}

