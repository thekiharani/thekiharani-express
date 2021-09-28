import nodemailer from 'nodemailer'
import config from '../config/app'

const sendEmail = async (
  subject: string,
  email: string,
  message: string
): Promise<void> => {
  let transport
  if (process.env.NODE_ENV === 'development') {
    transport = nodemailer.createTransport(config.devMail)
  } else {
    transport = nodemailer.createTransport(config.mail)
  }

  const mailOptions = {
    from: '"Joe Gitonga" <mail@thevlage.com>',
    to: email,
    subject: subject,
    html: message,
  }

  await transport
    .sendMail(mailOptions)
    .then((r) => {
      console.log(r)
    })
    .catch((e) => {
      console.log(e)
    })
}

export default { sendEmail }
