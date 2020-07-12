const { app, BrowserWindow } = require('electron');
const path = require('path');

process.on('uncaughtException', error => {
    console.error(error);
    app.exit();
});

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
    const { width, height } = { width: 800, height: 600 };
    const win = new BrowserWindow({
        width,
        height,
        title: process.env.npm_package_title || 'Quest App',
        icon: process.env.npm_package_icon,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false
        },
        frame: true,
        show: false,
    });
    win.on('ready-to-show', () => win.show());
    if (process.env.NODE_ENV === 'development') {
        win.loadURL(process.argv[2]);
    } else {
        win.loadFile(path.join(__dirname, 'index.html'));
    }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

