
module.exports = {
  name: 'Databank Tools',
  version: '1.0.5',
  description: 'Databank Tools',
  author: 'Shuang.qin',
  manifest_version: 2,
  icons: { '16': 'icons/acxiom_logo.ico','48': 'icons/acxiom_logo.ico','128': 'icons/acxiom_logo.ico'},
  permissions: [
    // '<all_urls>',
    'https://databank.tmall.com/',
    // 'activeTab',
    // 'tabs',
    'cookies',
    // 'background',
    // 'contextMenus',
    // 'unlimitedStorage',
    // 'storage'
    // 'notifications',
    // 'identity',
    // 'identity.email'
  ],
  browser_action: {
    default_title: 'title',
    default_popup: 'pages/popup.html'
  },
  // background: {
  //   persistent: false,
  //   page: 'pages/background.html'
  // },
  // devtools_page: 'pages/devtools.html',
  // options_page: 'pages/options.html',
  // content_scripts: [{
  //   js: [ 'js/inject.js' ],
  //   run_at: 'document_end',
  //   matches: ['https://databank.tmall.com/*'],
  //   all_frames: true
  // }],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  // web_accessible_resources: [ 'panel.html', 'js/content.js' ]
}
