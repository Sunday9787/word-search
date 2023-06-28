import YAML from 'yaml'
import fs from 'node:fs'
import path from 'node:path'

const file = fs.readFileSync('./config.yaml', 'utf8')

/**
 * @type {Word.Config}
 */
export const config = YAML.parse(file)

function parseBlackWordList() {
  return fs
    .readFileSync(path.join(process.cwd(), 'blacklist.txt'), 'utf-8')
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean)
}

export const blackWordList = parseBlackWordList()
