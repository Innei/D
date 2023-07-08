export const configs = {
  title: '森',
  subtitle: '记录 生活中的想法',
  website: 'https://innei.in',

  previewHost: 'https://innei.in',
  footer: {
    info: [
      '原站已迁移到 <a href="//innei.in">innei.in</a>',

      '<a href="http://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙 ICP 备 20028356 号</a>',
    ],
  },
  apiBase:
    import.meta.env.VITE_APP_APIBASE?.toString() ?? 'https://api.innei.ren/v2',
}
