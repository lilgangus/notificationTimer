const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('runBashScript', (event) => {
    const scriptPath = '/timer.sh';

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            event.sender.send('bashOutput', `Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            event.sender.send('bashOutput', `Stderr: ${stderr}`);
            return;
        }

        console.log(`Stdout: ${stdout}`);
        event.sender.send('bashOutput', `Stdout: ${stdout}`);
    });
});