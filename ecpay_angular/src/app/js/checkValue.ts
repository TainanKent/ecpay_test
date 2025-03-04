import sha256 from 'crypto-js/sha256';
  
// 產生CheckValue 用來給綠界檢查
const generateCheckValue = (params: { [s: string]: unknown; } | ArrayLike<unknown>) => {
  //將 params 從 Object 換成 Array
  const entries = Object.entries(params);

  //第一步，將 params 按照 key 值得字母順序排列
  entries.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  //第二步，用 key1=value1&key2=value2... 這樣的 pattern 將所有 params 串聯成字串
  //並前後加上 HashKey & HashIV 的 value
  let result =
    `HashKey=pwFHCqoQZGmho4w6&` +
    entries.map((x) => `${x[0]}=${x[1]}`).join('&') +
    `&HashIV=EkRm7iFT261dpevs`;

  //第三步，encode URL 並轉換成小寫
  result = encodeURIComponent(result).toLowerCase();

  //第四步，因爲綠姐姐的 URL encode 是 follow RFC 1866
  //使用 js 的encodeURIComponent() 還需要處理一下
  //follow guidence from ECPay https://www.ecpay.com.tw/CascadeFAQ/CascadeFAQ_Qa?nID=1197
  result = result
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');

  //第五步，轉成 SHA256
  result = sha256(result).toString();

  //最後，轉成大寫
  return result.toUpperCase();
}

export default generateCheckValue