import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import visitor from './routes/visitor';
import badgeholder from './routes/badgeholder';
import mail from './routes/mail';

const app = express();
app.use(express.json());

app.use('/visitor', visitor);
app.use('/badgeholder', badgeholder);
app.use('/mail', mail);

app.listen(3000, () => {
  // 変数チェック
  if(!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("invalid environment = AWS_ACCESS_KEY_ID");
  }
  if(!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("invalid environment = AWS_SECRET_ACCESS_KEY");
  }
  if(!process.env.DB_ENDPOINT) {
    throw new Error("invalid environment = DB_ENDPOINT");
  }

  console.log('Listen started at port 3000.');
  console.log(expressListEndpoints(app));
});

export default app;
