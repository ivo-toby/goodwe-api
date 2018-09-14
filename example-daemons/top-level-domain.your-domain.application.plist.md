# Mac Launchd Node service

[taken from stackoverflow](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/25998406#25998406)

If you are running OSX, then the easiest way to produce a true system process is to use launchd to launch it.

Build a plist like this, and put it into the `/Library/LaunchDaemons` with the name `top-level-domain.your-domain.application.plist` (you need to be root when placing it):

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>top-level-domain.your-domain.application</string>

    <key>WorkingDirectory</key>
    <string>/your/preferred/workingdirectory</string>

    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>your-script-file</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

When done, issue this (as root):
 
```
launchctl load /Library/LaunchDaemons/top-level-domain.your-domain.application.plist
launchctl start top-level-domain.your-domain.application
```
and you are running.

And you will still be running after a restart.

For other options in the plist look at the man page [here](https://developer.apple.com/library/mac/documentation/Darwin/Reference/Manpages/man5/launchd.plist.5.html)

