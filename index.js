const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

let scriptRunning = false

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
    app.quit()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('runBashScript', (event) => {

    if (scriptRunning) { // Check if the script is already running
        event.sender.send('bashOutput', 'Script is already running.')
        return
    }

    const scriptPath = 'timer.sh'
    scriptRunning = true

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        
        scriptRunning = false

        if (error) {
            console.error(`Error: ${error.message}`)
            event.sender.send('bashOutput', `Error: ${error.message}`)
            return;
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            event.sender.send('bashOutput', `Stderr: ${stderr}`)
            return;
        }

        console.log(`Stdout: ${stdout}`);
        event.sender.send('bashOutput', `Stdout: ${stdout}`)
    });
});