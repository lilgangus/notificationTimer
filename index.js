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

    setInterval(() => {
        win.show()
        win.focus()
    }, 10000)
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    //this is to close for nonmacos
    if (process.platform !== 'darwin') {
        app.quit();
    }
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
    });
});

function getTime() {
    const date = new Date()
    const time = date.toLocaleTimeString()
    return time
}
