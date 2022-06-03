'use strict'

module.exports = (app) => {
  const { router, controller } = app

  router.post('/weapp/login', controller.weapp.login)
  router.get(
    '/weapp/getGoodsWithCategory',
    controller.weapp.getGoodsWithCategory
  )
  router.get(
    '/weapp/getDefaultFreightPlan',
    controller.weapp.getDefaultFreightPlan
  )
  router.get(
    '/weapp/getDeliveryTimeTypeList',
    controller.weapp.getDeliveryTimeTypeList
  )
  router.post('/weapp/queryOrderBill', controller.weapp.queryOrderBill)
  router.post('/weapp/getOrderBill', controller.weapp.getOrderBill)
  router.post('/weapp/createBill', controller.weapp.createBill)
  router.post('/weapp/cancelBill', controller.weapp.cancelBill)
  router.post('/weapp/auditBill', controller.weapp.auditBill)
  router.post('/weapp/completeBill', controller.weapp.completeBill)
  router.get('/weapp/getAddress', controller.weapp.getAddress)
  router.get('/weapp/getDefaultAddress', controller.weapp.getDefaultAddress)
  router.post('/weapp/setDefaultAddress', controller.weapp.setDefaultAddress)
  router.post('/weapp/deleteAddress', controller.weapp.deleteAddress)
  router.get('/weapp/getAddressList', controller.weapp.getAddressList)
  router.post('/weapp/saveNewAddress', controller.weapp.saveNewAddress)
  router.post('/weapp/saveModifyAddress', controller.weapp.saveModifyAddress)
  router.get('/weapp/getMerchant', controller.weapp.getMerchant)
}
