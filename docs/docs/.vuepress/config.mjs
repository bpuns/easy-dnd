import { defineUserConfig, defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'easy-dnd',
  plugins: [
    searchPlugin({
      isSearchable: () => true
    }),
  ],
  theme: defaultTheme({
    sidebarDepth: 4,
    // logo: '/images/logo.png',
    navbar: [
      {
        text: 'API',
        link: '/api'
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
        {
          text: '快速上手',
          link: '/quickStart'
        },
        {
          text: 'React下使用',
          link: '/react'
        },
        {
          text: 'Vue下使用',
          link: '/vue'
        },
      ],
      '/api': [
        {
          text: 'html',
          link: '/api',
        },
        {
          text: 'vue',
          children: ['/reference/cli.md', '/reference/config.md'],
        },
        {
          text: 'react',
          children: ['/reference/cli.md', '/reference/config.md'],
        }
      ]
    }
  }),
})