import fs from 'fs-extra';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

// .envで指定
// process.env.AWS_ACCESS_KEY_ID = "";
// process.env.AWS_SECRET_ACCESS_KEY = "";
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({ apiVersion: '2010-12-01', region: 'ap-northeast-1' }), // SESインスタンスを渡す
});

/**
 * メール送る
 * @param address 
 * @param subject 
 * @param text 
 * @param filepath 
 */
const sendMail = async (address: string, subject: string, text: string, filepath?: string) => {

  const attachments: any[] = [];
  if(filepath) {
    attachments.push({
      filename: 'code.png',
      path: filepath,
    });
  }

  const sendObj = {
    from: 'info@rtain.jp',
    to: address,
    subject: subject,
    text: text,
    // 添付ファイル
    attachments: attachments
  };

  fs.appendFileSync("data/senddump.log", JSON.stringify(sendObj, null, "  ") + ",\n");
  const result = await transporter.sendMail(sendObj);
  console.log(`${address} ${result.messageId}`);
}

export default sendMail;