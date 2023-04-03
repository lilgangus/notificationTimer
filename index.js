const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

let scriptRunning = false

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
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

    if (scriptRunning) { 
        // Check if the script is already running
        event.sender.send('bashOutput', 'Script is already running.')
        return
    }

    const scriptPath = 'timer.sh'
    scriptRunning = true
    event.sender.send('bashOutput', 'Script Running.')

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
        scriptRunning = false
        event.sender.send('bashOutput', 'Script Not Running.')

        // if (error) {
        //     console.error(`Error: ${error.message}`)
        //     event.sender.send('bashOutput', `Error: ${error.message}`)
        //     return;
        // }

        // if (stderr) {
        //     console.error(`Stderr: ${stderr}`);
        //     event.sender.send('bashOutput', `Stderr: ${stderr}`)
        //     return;
        // }

        // console.log(`Stdout: ${stdout}`);
        // event.sender.send('bashOutput', `Stdout: ${stdout}`)
    });
});