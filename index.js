const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

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
        clearTimeout(timerScript)
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

    // time = getTime()
    e.sender.send('output', 'Timer Running: ' + getTime())
    
    //every 21 minutes we show/focus the window and update the timer start time
    timerScript = setTimeout(() => {
        win.show()
        win.focus()
        time = getTime()
        //we could use a function to continuously send the time until alarm goes off
        e.sender.send('output', 'Take A Small Break')
        e.sender.send('acknowledge')
    }, 5000)

})

ipcMain.on('stopTimer', (e) => {
    clearTimeout(timerScript)
    e.sender.send('output', 'Timer Not Running.')
})

function getTime() {
    const date = new Date()
    const time = date.toLocaleTimeString()
    return time
}
