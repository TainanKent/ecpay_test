import express from 'express'
import sha256 from 'crypto-js/sha256.js';
import moment from 'moment'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()
const port = 3000

app.use(express.json());
app.use(cors())

// 產生CheckValue 用來給綠界檢查
// 參考文件: 參考文件: https://developers.ecpay.com.tw/?p=2902 
const generateCheckValue = (params) => {
//第一步，將傳遞參數依照第一個英文字母，由A到Z的順序來排序(
//將 params 從 Object 換成 Array
const entries = Object.entries(params);

entries.sort((a, b) => a[0].localeCompare(b[0]));

//第二步，參數最前面加上HashKey、最後面加上HashIV
let result = `HashKey=pwFHCqoQZGmho4w6&`

result += entries.map((x) => `${x[0]}=${x[1]}`).join('&')
result += `&HashIV=EkRm7iFT261dpevs`
//第三步，將串字串進行URL encode與轉換為小寫
result = encodeURIComponent(result).toLowerCase();

//第四步，因爲綠界使用的 URL encode 是 follow RFC 1866
//使用 js 的encodeURIComponent() 需要更換部分字元
// URLEncode轉換表: https://developers.ecpay.com.tw/?p=2904
result = result
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');

//第五步，以SHA256加密方式來產生雜凑值
result = sha256(result).toString();

//最後，再轉大寫產生CheckMacValue
return result.toUpperCase();
}
// 取得訂單資料
app.post('/getOrder', async (req, res) => {
  let data = {
    "MerchantID": "3002607",
    "MerchantTradeNo": "test1740555308168",
    "TimeStamp": moment().unix(),
  }

  if (req.body.orderid) {
    data["MerchantTradeNo"] = req.body.orderid
  }

  const params = new URLSearchParams();
  params.append('MerchantID', '3002607');
  params.append('MerchantTradeNo', data.MerchantTradeNo);
  params.append('TimeStamp', moment().unix());
  params.append('CheckMacValue', generateCheckValue(data));
  
  const response = await fetch(
    'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5', 
    {
      method: 'POST', 
      body: params
    }
  );
  const resData = await response.text();

  let reData = {}
  let splitData = resData.split('&')
  // 轉換JSON
  splitData.map(data => {
    const d = data.split('=')

    reData[d[0]] = d[1]
  })

  res.json(reData)
})

app.get('/downloadOrder', async (req, res) => {
  const params = new URLSearchParams();
  params.append('MerchantID', '3002607');
  params.append('DateType', '6');
  params.append('BeginDate', "2025-02-01");
  params.append('EndDate', "2025-02-28");


  const response = await fetch(
    'https://vendor-stage.ecpay.com.tw/PaymentMedia/TradeNoAio', 
    {
      method: 'POST', 
      body: params
    }
  );

  const resData = await response;

  res.send(resData)
})

app.post('/downloadFile', async (req, res) => {
  const info = {
    "MerchantID": "3002607",
    "DateType": "2",
    "BeginDate": req.body.BeginDate,
    "EndDate": req.body.EndDate,
    "MediaFormated": "1"
  }

  const params = new URLSearchParams();
  params.append('MerchantID', '3002607');
  params.append('DateType', '2');
  params.append('BeginDate', req.body.BeginDate);
  params.append('EndDate', req.body.EndDate);
  params.append('MediaFormated', "1");
  params.append('CheckMacValue', generateCheckValue(info));

  const response = await fetch(
    'https://vendor-stage.ecpay.com.tw/PaymentMedia/TradeNoAio', 
    {
      method: 'POST', 
      body: params,
    }
  );

  const resData = await response;

  resData.arrayBuffer()
  .then((buffer) => {
    // 轉換成 big5 格式不然中文會顯示亂碼
    const decoder = new TextDecoder("big5");
    const text = decoder.decode(buffer);

    res.send({
      data: text
    })
  });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})