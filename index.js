const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

let scriptRunning = false
let time
let timerScript

function createWindow() {
    const win = new BrowserWindow({
        width: 350,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    win.loadFile('index.html')
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
    app.quit()
})

app.on('before-quit', () => {
    if (timerScript) {
        timerScript.kill()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

ipcMain.on('runBashScript', (event) => {

    if (scriptRunning) { 
        // Check if the script is already running
        event.sender.send('bashOutput', 'Script is already running.' + time)
        return
    }

    scriptRunning = true
    time = getTime()
    event.sender.send('bashOutput', 'Script Running: ' + time)

    timerScript = exec(`bash ${'timer.sh'}`, (error, stdout, stderr) => {
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

function getTime() {
    const date = new Date()
    const time = date.toLocaleTimeString()
    return time
}
