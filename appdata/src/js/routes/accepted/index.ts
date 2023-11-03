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
    const portRes = await axios.get(`${dbEndpoint}/accepted`);
    console.log(portRes.data);

    // response
    return res.status(200).send({
      status: "ok",
      data: portRes.data
    });
  
  } catch(e) {
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

    const data = req.body;
    const portRes = await axios.post(`${dbEndpoint}/accepted`, data);
    console.log(portRes.data);

    // response
    return res.status(201).send({
      status: "ok",
      data: portRes.data
    });
  
  } catch(e) {
    return res.status(500).send({
      status: "ng",
      data: e.message
    });
  }
};

router.get('/', get);
router.post('/', post);


export default router;
