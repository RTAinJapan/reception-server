import * as Express from 'express';
import axios from "axios";

const router = Express.Router();

const post = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const token = process.env.TOKEN; // 認証用
  const dbEndpoint = process.env.DB_ENDPOINT;

  try {
    const body: {
      /** 名前 */
      name: string;
      /** カテゴリ */
      category: string;
      start_at: string;
      end_at: string;
      identifier: string;
      /** 入場コード */
      code: string;
    } = req.body;  
    const reqtoken = req.headers["x-app-token"];

    if(token && token !== reqtoken) {
      throw new Error("invalid token");
    }

    // validation
    if(!body.name) {
      throw new Error("パラメータ未指定 name");
    }
    if(!body.category) {
      throw new Error("パラメータ未指定 category");
    }
    if(!body.start_at) {
      throw new Error("パラメータ未指定 start_at");
    }
    if(!body.end_at) {
      throw new Error("パラメータ未指定 end_at");
    }
    if(!body.identifier) {
      throw new Error("パラメータ未指定 identifier");
    }
    if(!body.code) {
      throw new Error("パラメータ未指定 code");
    }

    // post
    const postBody = {
      ...body
    };
    const portRes = await axios.post(`${dbEndpoint}/badgeholder`, postBody);
    console.log(portRes.data);

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

// router.get('/');
router.post('/', post);

export default router;
