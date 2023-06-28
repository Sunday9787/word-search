import path from 'node:path'
import axios from 'axios'
import moment from 'moment'
import { filterData } from './utils.mjs'

const endDate = moment().format('YYYY-MM-DD')

/**
 * @param {number} current
 * @param {object} options
 * @param {Word.Config} options.config
 * @param {Word.Site} options.site
 * @param {string} options.blackWord
 */
function request(current, options) {
  const site = options.site
  const config = options.config
  const keyWord = options.blackWord

  return axios
    .post(
      path.join(config.urlPrefix, 'webber/search/search/search/queryPage'),
      {
        aliasName: 'article',
        keyWord,
        lastkeyWord: keyWord,
        searchKeyWord: false,
        orderType: 'score',
        searchType: 'text',
        searchScope: 3,
        searchOperator: 0,
        searchDateType: '',
        searchDateName: 'time.any_time',
        beginDate: '',
        endDate,
        showId: '',
        auditing: ['1'],
        owner: site.owner,
        token: '\n\n\n\n\n\n\n\n\n\n\ntourist\n',
        urlPrefix: config.urlPrefix,
        page: {
          current,
          size: 10,
          pageSizes: [2, 5, 10, 20, 50, 100],
          total: 0,
          totalPage: 0,
          indexs: []
        },
        advance: false,
        advanceKeyWord: '',
        lang: 'i18n_zh_CN'
      },
      {
        params: { r: Math.random() },
        baseURL: site.url,
        headers: {
          // Accept: 'application/json, text/javascript, */*; q=0.01',
          Authorization: 'tourist',
          // Host: site.url.replace('http://', ''),
          'Content-Type': 'application/json;charset=UTF-8'
          // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        }
      }
    )
    .then(response => response.data.data)
    .catch(error => {
      console.log(error)
    })
}

/**
 * @param {object} options
 * @param {Word.Config} options.config
 * @param {Word.Site} options.site
 * @param {string} options.blackWord
 */
export function searchWord(options) {
  return new Promise((resolve, reject) => {
    /**
     * @type {Word.Record[]}
     */
    const result = []

    const requestLoop = async function (current = 0) {
      console.log(options.site.url, '开始查询第', current + 1, '页')
      /**
       * @type {Word.Data}
       */
      const response = await request(current, options)

      if (response.page.records) {
        /**
         * @type {Word.Record[]}
         */
        const data = filterData(response, options.blackWord)

        if (data.length) {
          console.log(options.site.url, '已查询到关键词', options.blackWord)
          /**
           * @type {Word.Log[]}
           */
          const temp = data.map(item => ({
            url: 'http:' + item.url,
            ownerName: item.ownerName,
            title: item.keyword,
            keyWord: options.blackWord
          }))

          console.log(temp)

          result.push(...temp)
        }

        const totalPage = Math.ceil(response.page.total / 10)

        if (response.page.current < totalPage - 1) {
          setTimeout(function () {
            requestLoop(response.page.current + 1)
          }, Math.floor(Math.random() * 1000))
          // requestLoop(response.page.current + 1);
        } else {
          resolve(result)
        }
      } else {
        resolve(result)
      }
    }

    requestLoop(0)
  })
}
