# cliNotificationTimer
This is a break notification timer that runs in the background and notifies you every 20 minutes to take a break. 

To use app version of the timer, use the command "electron-packager . timer --platform=darwin --asar --name="timer" --icon=icon.icns" to build the app. (Change the platform flag accoring to your OS)

There is also a more minimalistic bash script timer version that pops up with a system notification. Just go to the directory where the script is located and run the following command: "./timer.sh" This only works on Mac OS.
