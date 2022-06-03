'use strict'

module.exports = (app) => {
  require('./router/admin')(app)
  require('./router/common')(app)
  require('./router/weapp')(app)
}
