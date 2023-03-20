# #!/bin/bash
while true
do
  osascript -e 'display notification "20 miutes have passed, take a break" with title "Timer"'
  osascript -e 'tell application "System Events" to display dialog "Do you want to start the timer again?" with title "Timer" buttons {"OK", "Cancel"} default button 1 giving up after 60' > /dev/null
  button=$(echo $?)
  if(( $button == 0 ))
  then
    sleep 1200 # wait for 20 minutes
  else
    exit 0 # end the script if Cancel button is clicked
  fi
done

