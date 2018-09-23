# GoodWe API (oct 2018)

_This is a work in progress_

This node-based import script can be used to import data from the latest GoodWe API and upload it to PVOutput.org

## Environment
These variables should be set from environment-variables or can be passed using CLI-arguments
```
GOODWE_LOGIN_API=https://globalapi.sems.com.cn/api/v1/
GOODWE_API_URI=https://euapi.sems.com.cn/api/
GOODWE_API_VERION=v2.0.4
GOODWE_CLIENT_TYPE=ios
CACHE_ID=7c3c61277bd8b4aa5efd3a5c755e6db5
CACHE_FOLDER=./db
GOODWE_USERNAME=<your goodwe-username>
GOODWE_PASSWORD=<your goodwe-password>
```

## CLI args
`--list-powerstations` prints a list of powerstations connected to your account
`--get-last-output` prints the last PAC value, expects the station-id in --station-id <station-id> *unfinished*
