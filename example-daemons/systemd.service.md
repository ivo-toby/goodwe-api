# Linux Systemd Node service

From [this link](https://stackoverflow.com/questions/4681067/how-do-i-run-a-node-js-application-as-its-own-process/28542093#28542093)

Nearly every modern Linux distribution comes with systemd, which means _forever, monit_, etc. are no longer necessary - your OS already handles these tasks.

Make a myapp.service file (replacing 'myapp' with your app's name, obviously):

```[Unit]
Description=My app

[Service]
ExecStart=/var/www/myapp/app.js
Restart=always
User=nobody
# Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
Group=nobody
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/myapp

[Install]
WantedBy=multi-user.target
```
Note if you're new to Unix: `/var/www/myapp/app.js` should have `#!/usr/bin/env node` on the very first line.

Copy your service file into the `/etc/systemd/system` folder.

Tell systemd about the new service with `systemctl daemon-reload`.

Start it with `systemctl start myapp`.

Enable it to run on boot with `systemctl enable myapp`.

See logs with `journalctl -u myapp`

This is taken from [How we deploy node apps on Linux, 2018 edition](https://certsimple.com/blog/deploy-node-on-linux), which also includes commands to generate an AWS/DigitalOcean/Azure CloudConfig to build Linux/node servers (including the .service file).

