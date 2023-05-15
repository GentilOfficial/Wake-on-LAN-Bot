<p align="center">
  <img alt="Telegram logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png" width="100" />
</p>
<h1 align="center">
  Wake on LAN Bot
</h1>
<p align="center">
  Telegram bot that allows the PC to be switched on remotely with a Wake on LAN (Italian 🇮🇹 version).
</p>

## 🔍 What's inside?

A quick look at the top-level files and directories you'll see in this project.

    .
    ├── README.md
    ├── index.js
    ├── package-lock.json
    └── package.json


1. **`README.md`**: A text file containing useful reference information about your project.

2. **`index.js`**: Main file containing the code for the bot's operation.

3. **`package-lock.json`**: This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project.

4. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

## 🚀 Getting Started!

#### **📢 IMPORTANT FOR MAKING THE BOT WORK:**
Replace all text components in the file `index.js` that contained by `%`.

> Example:
> 
> const ip=`%IP_ADDRESS%` &#8594; const ip='`192.168.1.1`'

It is obvious but also important that the BOT resides in an always-on host (e.g., a Raspberry Py).

### Install dependencies

```bash
  npm i
```

### Start bot

```bash
  node index
```
