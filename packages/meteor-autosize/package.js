Package.describe({
  name: 'meteor-autosize',
  summary: 'Automatically adjust textarea height based on user input.',
  version: '5.0.1',
  git: "https://github.com/DeDeSt/meteor-autosize.git",
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.addFiles(['lib/autosize.js'], 'client');
});
