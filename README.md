<div align="center">
  <br />
  <p>
    <img src="https://i.imgur.com/D3fXN0w.png" alt="Moon" />
  </p>
  <br />
  <p>
    <b>Moon</b> is a plugin-based <b>AdventureQuest Worlds</b> and <b>AdventureQuest 3D</b> Man-In-The-Middle proxy server.
  </p>
</div>

### Table of contents

- [Getting Started](#getting-started)
  - [Project Setup](#Project-Setup)
  - [Features](#Features)
  - [Disclaimer](#disclaimer)

### Getting Started

* [Node.js](https://nodejs.org)
* [Yarn](https://yarnpkg.com/en/docs/install)
* Text editor or IDE

### Features

* Plugin Support
* Proxy Process
* Web Server

### Project Setup

```bash
git clone https://github.com/spirtiks/moon
cd moon
```

Install dependencies and bootstrap the project
```bash
yarn # install dependencies
yarn start # starts the project
```

Setting up the configuration file

```bash
  web: {
    port: 80,
    enabled: true,
  },
  server: {
    name: 'Moon',
    protocol: 'aqw',
    port: 5588,
    debug: false,
    remote: {
      host: '',
      port: 5588,
    },
  },
  settings: {
    messageOfTheDay: 'Welcome to Moon!',
    prefix: '!',
  },
```
If you are using **Moon** for AdventureQuest Worlds only and have completed the following steps, you can play via [localhost](http://localhost)

You will need to include the target server address and port before attempting to connect

Setting up [Windows Hosts](https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992) for AdventureQuest 3D use only

```bash
::1	server ip here
```

You can find AdventreQuest 3D's server addresses using their public [API](http://cdn.aq3d.com/api/game/serverlist)

### Contributing

When contributing a feature or bug fix make sure to test and stylecheck your code.

### Disclaimer

Moon is for education/research purposes only. The author takes NO responsibility and/or liability for how you choose to use any of the tools/source code/any files provided. The author and anyone affiliated with will not be liable for any losses and/or damages in connection with use of ANY files provided with Moon. By using Moon or any files included, you understand that you are AGREEING TO USE AT YOUR OWN RISK. Once again Moon and ALL files included are for EDUCATION and/or RESEARCH purposes ONLY. Moon is ONLY intended to be used on your own servers, or with explicit consent from the owner of the property being tested.