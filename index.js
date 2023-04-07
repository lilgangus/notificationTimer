const {app, BrowserWindow, ipcMain} = require('electron');
// const {exec} = require('child_process');

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

//this quits application completely when closed
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

ipcMain.on('startTimer', (e) => {

    //when we start our timer, we send the time that it starts
    e.sender.send('output', 'Timer Running: ' + getTime())
    
    //every 20 minutes we show/focus the window 
    timerScript = setTimeout(() => {
        win.show()
        win.focus()
        //we could use a function to continuously send the time until alarm goes off
        e.sender.send('output', 'Take A Small Break')
        e.sender.send('acknowledge')
    }, 1200000)

})

//when we stop the timer, we clear the timout
ipcMain.on('stopTimer', (e) => {
    clearTimeout(timerScript)
    e.sender.send('output', 'Timer Not Running.')
})

function getTime() {
    const date = new Date()
    const time = date.toLocaleTimeString()
    return time
}

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