const model = require('./model')
const mail = require('./mail')
const fs = require('fs')
const ejs = require('ejs')
const errorView = fs.readFileSync('views/error.html')
const homeView = fs.readFileSync('views/home.html')
const searchView = fs.readFileSync('views/search.ejs', { encoding: 'utf-8' })
const pushView = fs.readFileSync('views/push.ejs', { encoding: 'utf-8' })

module.exports = {
  async error (ctx, next) {
    try { await next() } catch (e) {
      ctx.type = 'text/html'
      ctx.body = errorView
    }
  },
  async home (ctx) {
    ctx.type = 'text/html'
    ctx.body = homeView
  },
  async search (ctx) {
    const list = await model.list(ctx.query)
    ctx.body = ejs.render(searchView, { query: ctx.query.q, list })
  },
  async push (ctx) {
    const path = await model.path(ctx.query)
    const err = await mail(path)
    ctx.body = ejs.render(pushView, { err })
  }
}