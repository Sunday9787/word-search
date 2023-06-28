import fs from 'node:fs'
import path from 'node:path'
import got from 'got'
import { cloneDeep } from 'lodash-es'

/**
 * @param {Word.Config} originalConfig
 */
export async function getOwner(originalConfig) {
  const owner = await Promise.all(
    originalConfig.site.map(function (site) {
      return (async function () {
        const html = await got(site.url, { method: 'get' }).text()
        const str = html.match(/appOwner.+;/)[0]

        return str.match(/\d+/)[0]
      })()
    })
  )

  const config = cloneDeep(originalConfig)

  config.site.forEach((item, index) => {
    item.owner = owner[index]
  })

  return config
}

/**
 * @param {Word.Data} response
 * @param {string} keyWord
 */
export function filterData(response, keyWord) {
  return response.page.records
    .filter(item => item.content)
    .map(item => {
      const regex = /<[^>]+>|style="[^"]*"/g
      return { ...item, content: item.content.replace(regex, '') }
    })
    .filter(item => {
      const regex = new RegExp(keyWord, 'g')
      return regex.test(item.content)
    })
}

const logFile = path.resolve(process.cwd(), 'result.txt')

/**
 * @param {string} text
 */
export function log(text) {
  if (fs.existsSync(logFile)) {
    fs.appendFileSync(logFile, text)
  } else {
    fs.writeFileSync(logFile, text)
  }
}
