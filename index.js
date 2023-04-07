const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');
const { clearInterval } = require('timers');

let timerRunning = false
// let time
let win
let timerScript

function createWindow() {
    win = new BrowserWindow({
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

//this quits application when closed
app.on('window-all-closed', () => {
    //this is to close for nonmacos
    if (process.platform !== 'darwin') {
        app.quit();
    }
    app.quit()
})

//maybe we should use beforeunload instead of before-quite
app.on('before-quit', () => {
    if (timerRunning) {
        clearInterval(timerScript)
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

// ipcMain.on('runBashScript', (event) => {

//     if (scriptRunning) { 
//         return
//     }

//     scriptRunning = true
//     time = getTime()
//     event.sender.send('output', 'Script Running: ' + time)

//     timerScript = exec(`bash ${'timer.sh'}`, (error, stdout, stderr) => {
//         scriptRunning = false
//         event.sender.send('output', 'Timer Not Running.')
//     });
// });

ipcMain.on('startTimer', (e) => {

    if (timerRunning) { 
        return
    }

    timerRunning = true
    
    // time = getTime()
    e.sender.send('output', 'Timer Running: ' + getTime())
    
    //every 21 minutes we show/focus the window and update the timer start time
    timerScript = setInterval(() => {
        win.show()
        win.focus()
        time = getTime()
        //we could use a function to continuously send the time until alarm goes off
        e.sender.send('output', 'Timer Running: ' + getTime())
    }, 10000)

})

ipcMain.on('stopTimer', (e) => {
    clearInterval(timerScript)
    e.sender.send('output', 'Timer Not Running.')
    timerRunning = false
})

function getTime() {
    const date = new Date()
    const time = date.toLocaleTimeString()
    return time
}
