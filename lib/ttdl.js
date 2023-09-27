const axios = require('axios');

  
  
//--------------------------------------------------------------------------
 async function tiktok(url3) {
   return new Promise((resolve, reject) => { 
    let config = {
        method: 'post',
        maxBodyLength: 'Infinity',
        url: 'https://www.tikwm.com/api/?url='+url3+'https://www.tiktok.com/@bayashi.tiktok/video/7129095826332241154,&count= 12,&cursor= 0,&web= 1,&hd= 1',
        headers: { 
          'Content-Length': '0', 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36', 
          'Accept': '*/*', 
          'Accept-Encoding': 'gzip, deflate, br', 
          'Connection': 'keep-alive', 
          'Host': 'www.tikwm.com'
        }
        
      }; 
    axios.request(config).then((response) => {     
         var result = "${response.data.hdplay}"
         resolve(result)
        }).catch((error) => reject(error))})         
         }
 //-------------------------------------------------------------------------------

module.exports = {
  tiktok
 };



        
// axios.post('https://www.tikwm.com/api/', {}, { 
//   headers: { 
//       'accept': 'application/json, text/javascript, */*; q=0.01', 
//       'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
//       'cookie': 'current_language=en; _ga=GA1.1.512520618.1695715681; _gcl_au=1.1.1831499197.1695715682; _ga_5370HT04Z3=GS1.1.1695718051.2.0.1695718051.0.0.0', 
//        'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"', 
//        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36' 
//    }, 
 //   params: { 
//        url: url, 
 //       count: 12, 
 //       cursor: 0, 
//        web: 1, 
 //       hd: 1 
 //   }
//})