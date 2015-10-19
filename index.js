'use strict';

var path = require('path');
var fs = require('fs');
var app = require('app');
var BrowserWindow = require('browser-window');
var shell = require('shell');
var menu = require('menu');

require('electron-debug')();
require('crash-reporter').start();

let mainWindow;
const loginUrl = 'https://trello.com/login';

function updateBadge(title) {
  if (!app.dock) {
    return;
  }

  const notificationCount = (/\(([0-9]+)\)/).exec(title);
  app.dock.setBadge(notificationCount ? notificationCount[1] : '');
}

function createMainWindow() {
  const win = new BrowserWindow({
    'title': app.getName(),
    'show': false,
    'width': 1100,
    'height': 700,
    'min-width': 600,
    'min-height': 400,
    'title-bar-style': 'hidden-inset',
    'icon': path.join(__dirname, 'media', 'Icon.png'),
    'web-preferences': {
      'node-integration': false,
      'web-security': false,
      'plugins': true
    }
  });

  win.loadUrl(loginUrl);
  win.on('closed', app.quit);

  return win;
}

app.on('ready', () => {
  mainWindow = createMainWindow();

  const page = mainWindow.webContents;

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf-8'));
    mainWindow.show();
  });

  page.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
});