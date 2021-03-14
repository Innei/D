/*
 * @Author: Innei
 * @Date: 2020-06-11 12:25:50
 * @LastEditTime: 2021-03-14 12:05:48
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/utils/rules/index.ts
 * @Coding with Love
 */

import { mentions } from './mentions'
import { spoiler } from './spoiler'

export const plugins = { mentions, spoiler }

export default Object.values(plugins)
