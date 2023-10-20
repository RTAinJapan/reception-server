import * as Express from 'express';
import sendMail from './sendmail';
import QRCode from 'qrcode';
import fs from "fs-extra";
import path from 'path';

const router = Express.Router();

const post = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  console.log('post visitor');
  const token = process.env.TOKEN; // 認証用

  try {
    const body: {
      /** 入場コード。指定した場合はコードのQR画像を送信する */
      code?: string;
      /** メールアドレス */
      address: string;
      /** メールタイトル */
      subject: string;
      /** メール本文 */
      text: string;
    } = req.body;  
    const reqtoken = req.headers["x-app-token"];


    // validation
    // if(!body.code) {
    //   throw new Error("codeが指定されていません");
    // }
    if(!body.address) {
      throw new Error("addressが指定されていません");
    }
    if(!body.subject) {
      throw new Error("addressが指定されていません");
    }
    if(!body.text) {
      throw new Error("addressが指定されていません");
    }
    
    if(token && token !== reqtoken) {
      throw new Error("invalid token");
    }

    // QR画像作る
    let filepath = "";
    if(body.code) {
      filepath = `data/${body.code}.png`;
      await createQr(filepath, body.code);
    }
    // メール
    await sendMail(body.address, body.subject, body.text, filepath);

    // response
    return res.status(201).send({
      status: "ok",
      data: body
    });
  
  } catch(e) {
    return res.status(500).send({
      status: "ng",
      data: e.message
    });
  }

};

/**
 * QR画像ファイルを作成
 * @param qrpath ファイルパス
 * @param code コード
 */
const createQr = async (qrpath: string, code: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(path.dirname(qrpath))) {
      fs.mkdirpSync(path.dirname(qrpath));
    }

    const option: QRCode.QRCodeToFileOptions = {
      type: "png",
      errorCorrectionLevel: "H"
    };

    QRCode.toFile(qrpath, code, option, (err: any) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};


// router.get('/');
router.post('/', post);

export default router;
