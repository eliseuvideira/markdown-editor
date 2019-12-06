import { app, BrowserWindow } from 'electron';
import { join } from 'path';

let window: BrowserWindow;

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
