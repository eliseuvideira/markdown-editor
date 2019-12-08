import { app, BrowserWindow, Menu } from 'electron';
import { join } from 'path';
import menu from './menu';

let window: BrowserWindow;

Menu.setApplicationMenu(menu);

app.on('ready', () => {
  window = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true },
  });
  window.loadFile(join(__dirname, '..', 'index.html'));
  window.on('ready-to-show', () => {
    window.show();
  });
});
