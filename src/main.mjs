import { config, blackWordList } from './config.mjs'
import { searchWord } from './request.mjs'
import * as utils from './utils.mjs'

/**
 * @param {Word.Config} config
 * @param {Word.Site} site
 */
function entry(config, site) {
  return new Promise((resolve, reject) => {
    /**
     * @type {Word.Record[]}
     */
    const result = []

    let next = Promise.resolve()

    const keywordLoop = function (index) {
      if (index > blackWordList.length - 1) {
        resolve(result)
        return
      }

      console.log(site.url, '查询第', index + 1, '个关键词', blackWordList[index])

      next = next
        .then(() =>
          searchWord({
            config,
            site,
            blackWord: blackWordList[index]
          })
        )
        .then(response => {
          result.push(...response)
          keywordLoop(index + 1)
        })
    }

    keywordLoop(0)
  })
}

/**
 * @param {Word.Config} config
 */
async function bootstrap(originalConfig) {
  const config = await utils.getOwner(originalConfig)

  let next = Promise.resolve()
  /**
   * @type {Record<string, Word.Log[]>}
   */
  const result = Object.create(null)

  const loop = function (index) {
    if (index > config.site.length - 1) return

    const site = config.site[index]
    result[site.url] = []
    console.log('开始查询第', index + 1, '个网站', site.url)

    next = next
      .then(() => entry(config, site))
      .then(response => {
        if (response) {
          result[site.url] = response

          utils.log('查询网站： ' + site.url + '\r\n')

          response.forEach(item => {
            utils.log('学校： ' + item.ownerName + '\r\n')
            utils.log('关键词： ' + item.keyWord + '\r\n')
            utils.log('文章地址： ' + item.url + '\r\n')
            utils.log('文章标题： ' + item.title + '\r\n')
            utils.log('\r\n')
          })
        }

        loop(index + 1)
      })
  }

  loop(0)
}

bootstrap(config)
