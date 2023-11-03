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
    const portRes = await axios.get(`${dbEndpoint}/visitor`);
    console.log(portRes.data);

    // response
    return res.status(201).send({
      status: "ok",
      data: portRes.data
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

export default router;
