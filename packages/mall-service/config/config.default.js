/* eslint valid-jsdoc: "off" */

'use strict'

const isNumber = require('lodash/isNumber')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {})

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1648908007918_6590'

    // add your middleware config here
    config.middleware = ['errorHandler', 'auth']

    config.auth = {
        ignore: ['/user/login']
    }

    const userConfig = {
        myAppName: 'c-mall'
    }

    config.security = {
        csrf: {
            enable: false
        },
        domainWhiteList: ['*']
    }

    config.jwt = {
        secret: 'cmall20220402'
    }

    // 数据库
    config.mysql = {
        client: {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: 'QIUjun940324',
            database: 'cmall'
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false
    }

    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'cmall',
        host: '127.0.0.1',
        port: '3306',
        username: 'root',
        password: 'QIUjun940324',
        timezone: '+08:00',
        define: {
            timestamps: true, // 自动维护时间戳 [ created_at、updated_at ]
            createdAt: 'createdTime',
            updatedAt: false,
            freezeTableName: true, // 强制表名称等于模型名称
            underscored: false, // 列字段名称是否使用驼峰转下划线
            setterMethods: {
                version(value) {
                    if (isNumber(value)) {
                        this.setDataValue('version', value + 1)
                    }
                }
            }
        }
    }

    config.redis = {
        clients: {
            default: {
                host: '127.0.0.1',
                port: '6379',
                password: '',
                db: '0'
            },
            subscribe: {
                host: '127.0.0.1',
                port: '6379',
                password: '',
                db: '1'
            },
            session: {
                host: '127.0.0.1',
                port: '6379',
                password: '',
                db: '2'
            }
        },
        agent: true
    }

    config.sessionRedis = {
        name: 'session'
    }

    config.jwt = {
        secret: 'junecmall04'
    }

    config.multipart = {
        mode: 'stream' //  stream 流的模式
    }

    return {
        ...config,
        ...userConfig
    }
}
