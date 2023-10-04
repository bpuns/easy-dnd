import { defineUserConfig, defaultTheme } from 'vuepress'
// import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  base: '/easy-dnd-docs/',
  lang: 'zh-CN',
  title: 'easy-dnd',
  // plugins: [
  //   searchPlugin({
  //     isSearchable: () => true
  //   }),
  // ],
  theme: defaultTheme({
    contributors: false,
    lastUpdatedText: '最近更新时间',
    sidebarDepth: 4,
    // logo: '/images/logo.png',
    navbar: [
      {
        text: '指南',
        link: '/',
        children: [
          {
            text: '简介',
            link: '/',
          },
          '/quickStart',
          '/extras',
          '/react',
          '/vue'
        ]
      },
      {
        text: 'API',
        link: '/api/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/bpuns/easy-dnd'
      }
    ],
    sidebar: {
      '/': [
        {
          text: '简介',
          link: '/',
          collapsible: true
        },
        'quickStart',
        'extras',
        'vue',
        'react'
      ],
      '/api': [
        {
          text: '核心API',
          link: '/api/'
        },
        '/api/vue/',
        '/api/react/'
      ]
    }
  }),
})