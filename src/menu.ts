import {
  app,
  Menu,
  shell,
  MenuItemConstructorOptions,
  BrowserWindow,
  // globalShortcut,
  ipcMain,
  dialog,
} from 'electron';
import fs from 'fs';

const saveFile = () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send('editor-event', 'save');
  }
};

const openFile = async () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      title: 'Pick a markdown file',
      filters: [
        { name: 'Markdown files', extensions: ['md'] },
        { name: 'Text files', extensions: ['txt'] },
      ],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const content = fs.readFileSync(result.filePaths[0]).toString();
      window.webContents.send('load', content);
    }
  }
};

app.on('ready', () => {
  // globalShortcut.register('CommandOrControl+S', () => {
  //   saveFile();
  // });
  // globalShortcut.register('CommandOrControl+O', () => {
  //   openFile();
  // });
});

ipcMain.on('editor-reply', (event, arg) => {
  // tslint:disable-next-line: no-console
  console.log(`Recieved reply from web page: ${arg}`);
});

ipcMain.on('save', (event, arg) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    dialog
      .showSaveDialog(window, {
        title: 'Save markdown file',
        filters: [
          {
            name: 'MyFile',
            extensions: ['md'],
          },
        ],
      })
      .then((result) => {
        if (!result.canceled && result.filePath) {
          fs.writeFileSync(result.filePath, arg);
        }
      });
  }
});

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click() {
          openFile();
        },
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click() {
          saveFile();
        },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Toggle Bold',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          if (window) {
            window.webContents.send('editor-event', 'toggle-bold');
          }
        },
      },
      {
        label: 'Toggle Italic',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          if (window) {
            window.webContents.send('editor-event', 'toggle-italic');
          }
        },
      },
      {
        label: 'Toggle Strike Through',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          if (window) {
            window.webContents.send('editor-event', 'toggle-strike-through');
          }
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About Editor Component',
        click() {
          shell.openExternal('https://simplemde.com/');
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }],
  });
}

if (process.env.NODE_ENV === 'development') {
  template.push({
    label: 'Debugging',
    submenu: [
      { label: 'Dev Tools', role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'reload' },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);

export default menu;
