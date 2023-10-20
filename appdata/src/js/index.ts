import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import visitor from './routes/visitor';
import badgeholder from './routes/badgeholder';

const app = express();
app.use(express.json());

app.use('/visitor', visitor);
app.use('/badgeholder', badgeholder);

app.listen(3000, () => {
  // 変数チェック
  if(!process.env.DB_ENDPOINT) {
    throw new Error("invalid environment = DB_ENDPOINT");
  }

  console.log('Listen started at port 3000.');
  console.log(expressListEndpoints(app));
});

export default app;
