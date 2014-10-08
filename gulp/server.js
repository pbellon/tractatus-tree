'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://server/context/'; // The location of your backend

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

/* proxyMiddleware forwards static file requests to BrowserSync server
   and forwards dynamic requests to your real backend */
function proxyMiddleware(req, res, next) {
  if (/\.(html|css|js|json|png|jpg|jpeg|gif|ico|xml|rss|txt|eot|svg|ttf|woff)(\?((r|v|rel|rev)=[\-\.\w]*)?)?$/.test(req.url)) {
    next();
  } else {
    proxy.web(req, res);
  }
}

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      middleware: proxyMiddleware
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'app',
    '.tmp',
  ], [
    'app/*.html',
    'app/data/*.json',
    'app/styles/**/*.css',
    '.tmp/styles/**/*.css',
    'app/src/**/*.coffee',
    './tmp/js/*.js',
    'app/partials/**/*.html',
    'app/images/**/*'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});