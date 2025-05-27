import nodemailer, { SendMailOptions } from 'nodemailer';
import { SMTP_USER, SMTP_PASSWORD } from '../config';
//We can go to the website: 'https://ethereal.email' and get the cred, or use the below to get cred. One time only
// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }
// createTestCreds();

type Tsmtp = {
  user: string;
  pass: string;
  port: number;
  host: string;
  // secure: boolean;
};

const smtp: Tsmtp = {
  user: SMTP_USER,
  pass: SMTP_PASSWORD,
  host: 'smtp.gmail.com',
  port: 465,
  // secure: false,
};

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  // secure: false,
  service: 'gmail',
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

async function sendEmail(payload: SendMailOptions) {
  //   const message = {
  //     from: payload.from,
  //     to: payload.to,
  //     subject: payload.subject,
  //     text: payload.text,
  //   };
  try {
    //     transporter.sendMail(message, (err, info) => {
    //       if (err) {
    //         log.error(err);
    //       } else {
    //         log.info(info);
    //         log.info(nodemailer.getTestMessageUrl(info));
    //       }
    //     });
    const ret = await transporter.sendMail(payload);
    console.log('Mailed');
    // console.log(nodemailer.getTestMessageUrl(ret));
  } catch (err) {
    console.log({ err });
  }
}

// sendEmail({
//   from: "navisureka23@gmail.com",
//   to: "navisureka23@gmail.com",
//   subject: "hello",
//   text: "hi there",
// });

export default sendEmail;
