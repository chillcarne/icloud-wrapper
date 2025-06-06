const { app, BrowserWindow, Menu, dialog } = require('electron');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');

// Settings path
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// Base variables
let mainWindow;
let settings = {
    useAltMaximize: false,
    readyToShow: true,
    restoreLastPage: true
};

// Load settings
function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath);
            settings = JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading settings:', e);
    }
}

// Save settings
function saveSettings() {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

// Create menu
function createMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
        {
            label: 'Startup',
            submenu: [
                {
                    label: 'Continue where you left off',
                    type: 'checkbox',
                    checked: settings.restoreLastPage,
                    click: (menuItem) => {
                        settings.restoreLastPage = menuItem.checked;
                        saveSettings();
                    }
                }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Open window maximized on startup',
                    type: 'checkbox',
                    checked: settings.maximizeWindow,
                    click: (menuItem) => {
                        settings.maximizeWindow = menuItem.checked;
                        saveSettings();
                    }
                },
                {
                    label: 'Show when ready (avoids white screen)',
                    type: 'checkbox',
                    checked: settings.readyToShow,
                    click: (menuItem) => {
                        settings.readyToShow = menuItem.checked;
                        saveSettings();
                    }
                },
                {
                    label: 'Reload page',
                    accelerator: 'F5',
                    click: () => {
                        if (mainWindow && mainWindow.webContents) {
                            mainWindow.webContents.reload();
                        }
                    }
                },
                {
                    label: 'Reload window',
                    accelerator: isMac ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.close();
                        }
                        createWindow();
                        createMenu();
                    }
                },
            ]
        },
        {
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: 'info',
                    title: '',
                    message: 'iCloud Wrapper',
                    detail: [
                        'Version: 1.0.2',
                        'Author: Chillcarne',
                        'GitHub: https://github.com/chillcarne/icloud-wrapper'
                    ].join('\n'),
                    buttons: ['Close']
                });
            }
        }

    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Create window
function createWindow() {
    const urlToLoad = settings.restoreLastPage && settings.lastURL
        ? settings.lastURL
        : 'https://www.icloud.com/';

    // Create main window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'iCloud',
        icon: path.join(__dirname, 'resources/icon.png'),
        autoHideMenuBar: true,
        show: !settings.readyToShow,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Ready-to-show and maximize
    if (settings.readyToShow) {
        mainWindow.once('ready-to-show', () => {
            if (settings.maximizeWindow) {
                mainWindow.maximize();
            }
            mainWindow.show();
        });
    } else {
        if (settings.maximizeWindow) {
            mainWindow.maximize();
        }
    }

    // Load URL
    mainWindow.loadURL(urlToLoad);

    // Events to save last URL
    const wc = mainWindow.webContents;
    wc.on('did-navigate', (event, url) => {
        settings.lastURL = url;
        saveSettings();
    });

    wc.on('did-navigate-in-page', (event, url) => {
        settings.lastURL = url;
        saveSettings();
    });

}

// Init
app.whenReady().then(() => {
    loadSettings();
    createMenu();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
