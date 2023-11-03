import * as Express from 'express';
import axios from "axios";

const router = Express.Router();

const get = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const token = process.env.TOKEN; // 認証用
  const dbEndpoint = process.env.DB_ENDPOINT;

  try {
    const reqtoken = req.headers["x-app-token"];

    if(token && token !== reqtoken) {
      throw new Error("invalid token");
    }
    const getRes = await axios.get(`${dbEndpoint}/accepted`);
    console.log(getRes.data);

    // response
    return res.status(200).send({
      status: "ok",
      data: getRes.data
    });
  
  } catch(e) {
    console.warn(e.message);
    return res.status(500).send({
      status: "ng",
      data: e.message
    });
  }
};

const post = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const token = process.env.TOKEN; // 認証用
  const dbEndpoint = process.env.DB_ENDPOINT;

  try {
    const reqtoken = req.headers["x-app-token"];

    if(token && token !== reqtoken) {
      throw new Error("invalid token");
    }

    // データ登録
    const data = req.body;
    const postRes = await axios.post(`${dbEndpoint}/accepted`, data);
    console.log(postRes.data);

    // 現在の全データを取得
    const getRes = await axios.get(`${dbEndpoint}/accepted`);

    // response
    return res.status(201).send({
      status: "ok",
      data: getRes.data
    });
  
  } catch(e) {
    console.warn(e.message);
    return res.status(500).send({
      status: "ng",
      data: e.message
    });
  }
};

router.get('/', get);
router.post('/', post);


export default router;
