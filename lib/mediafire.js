
const axios = require('axios')
const cheerio = require('cheerio')

const mediafireDl = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('#download_link > a.retry').attr('href')
const size = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text()
const nama = $('body > main > div.content > div.center > div > div.dl-info > div.intro.icon.apk.archive.application_zip > div.filename').text()
mime = nama.split('.')
mime = mime[1]
hasil.push({ nama, mime, size, link })
return hasil
}


module.exports = { mediafireDl,mediafire:mediafireDl }