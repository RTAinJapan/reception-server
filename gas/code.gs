const spreadSheet = SpreadsheetApp.openById("★Sheet Id★");
const sheet = spreadSheet.getSheetByName("入場登録");
const form = FormApp.openById("★Form ID★");

const MAIL_URL = "http://★endpoint★";
const DB_URL = "http://★endpoint★";
const TOKEN = ""

/** メール件名 */
const SUBJECT_BASE = "RTA in Japan 観客入場について";
/** メール本文 */
const TEXT_BASE = `RTA in Japan の入場に必要な情報です

------------------
RTA in Japan
`;


function onSubmit(e) {
  console.log(JSON.stringify(e));
  if(!e) {
    throw new Error("実行契機がたぶんおかしい");
  }

  const questions = e.response.getGradableItemResponses();
  const responseId = e.response.getId();
  const responses = form.getResponses();

  // フォームの回答からシート書き込み対象の行を決定
  let row  = 1;
  for (const response of responses) {
    row++;
    if (response.getId() === responseId) {
      break;
    }
  }
  console.log(`row = ${row}`);

  const timestamp = e.response.getTimestamp();
  const address = e.response.getRespondentEmail();
  let name = "";
  let isVaccinate = false;
  let status = "";
  // 入場コード
  const code = "10" + Utilities.getUuid().replace(/\-/g, "");

  // フォームの回答から値を取得
  for (const question of questions) {
    const title = question.getItem().getTitle();
    const answer = question.getResponse();
    console.log(`${title} ${answer}`);

    switch(title) {
      case "名前（ハンドルネーム）/ Handle Name":
        name = answer;
        break;
      case "新型コロナウイルスワクチンの接種について":
        isVaccinate = !!answer;
        break;
    }
  }
  
  // コードの有効期限 ★今回は全日★
  const start_at = "2023/12/26 00:00:00";
  const end_at = "2023/12/31 23:59:59";
  const category = "観客 全日";
  const identifier = "★人ごとに唯一性を保つための仕組み★"

  // メール送信内容
  const subject = SUBJECT_BASE;
  const text = TEXT_BASE.replace("${code}", code);

  let isFail = false;
  try {
    const options = {
      method: "POST",
      contentType: "application/json",
      headers: {
        "x-app-token": TOKEN
      },
      payload: JSON.stringify({
        code: code,
        address: address,
        subject: subject,
        text: text
      }),
    };
    console.log(`${MAIL_URL} body=${options.payload}`);
    const res = UrlFetchApp.fetch(MAIL_URL, options);

    console.log(JSON.stringify(res.getContentText()));
    const resjson = JSON.parse(res.getContentText());
    if(resjson.status === "ng") throw new Error(res.getContentText());
  } catch(e) {
    status += "メール送信失敗。" + JSON.stringify(e);
  }

  if(!isFail) {
    try {
      const options = {
        method: "POST",
        contentType: "application/json",
        headers: {
          "x-app-token": TOKEN
        },
        payload: JSON.stringify({
          name: name,
          category: category,
          start_at: start_at,
          end_at: end_at,
          identifier: identifier,
          code: code
        }),
      };
      console.log(`${DB_URL} body=${options.payload}`)
      const res = UrlFetchApp.fetch(DB_URL, options);

      const resjson = JSON.parse(res.getContentText());
      console.log(JSON.stringify(resjson));
      if(resjson.status === "ng") throw new Error(res.getContentText());
    } catch(e) {
      status += " DB登録失敗。" + e.toString();
    }
  } else {
    status += " DB登録をスキップ";
  }

  // シート書き込み
  const data = [[timestamp, address, isVaccinate, name, code, status]];
  console.log(JSON.stringify(data));
  sheet.getRange(row, 1, 1, 6).setValues(data);
}

const __test_post = () => {
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "x-app-token": TOKEN
    },
    payload: JSON.stringify({
      name: "test name",
      category: "testCategory",
      start_at: "2023/10/10 11:11:11",
      end_at: "2023/10/10 11:11:11",
      identifier: "aaaaaaaaaaa",
      code: "aaaaaaaaaaa"
    }),
    muteHttpExceptions: true,
  };
  const res = UrlFetchApp.fetch(DB_URL, options);
  // const resjson = JSON.parse(res.getContentText());
  console.log(res.getContentText());
}
