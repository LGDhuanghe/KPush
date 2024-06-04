const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
  /**
   * 获取mobi电子书搜索列表
   * 
   * @param {string} query - 查询关键词
   * @return {array} - 返回电子书列表
   * 
   * 返回数组元素为mobi对象，包含3个字段，均为string
   * mobi.id - mobi电子书唯一id
   * mobi.desc - mobi电子书描述（标题、简介等）
   * mobi.cover? - mobi电子书封面（可选）
   */
  async getList(query) {
    const res = await axios.get(`https://zh.singlelogin.re/s/`+encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
      },
      params: {
        'extensions[]': 'MOBI'
      }
    })
    const $ = cheerio.load(res.data)
    const $li = $('#searchResultBox .resItemBox')
    const list = []
    for(let i = 1; i < $li.length; i++) {
      const $td = $li.eq(i).find('td')
      const $item = $td.eq(2).find('a')
      const $cover = $td.eq(0).find('img')
      const cover = $cover.attr('data-src')
      list.push({
        id: $item.attr('href'),
        desc: $item.text(),
        cover: cover !== '/img/cover-not-exists.png' ? cover : ''
      })
    }
    return list
  },
  /**
   * 通过id换取下载链接
   * 
   * @param {string} id - mobi电子书唯一id
   * @return {string} - 返回mobi电子书下载用url
   */
  async getUrl(id) {
    const res = await axios.get(`https://zh.singlelogin.re${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
      }
    })
    const $ = cheerio.load(res.data)
    return `https://zh.singlelogin.re${$('.dlButton').attr('href')}`
  }
}
