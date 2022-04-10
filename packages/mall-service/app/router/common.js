'use strict'

module.exports = (app) => {
    const { router, controller } = app
    router.post('/utils/upload', controller.utils.upload.upload)
}
