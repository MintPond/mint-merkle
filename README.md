mint-merkle
==========

This module contains merkle root utilities for NodeJS used by [MintPond Mining Pool](https://mintpond.com).

## Install ##
__Install as Dependency in NodeJS Project__
```bash
# Install from Github git package

sudo apt-get install build-essential
npm install mintpond/mint-merkle --save
```
-or-
```bash
# Install from Github NPM repository

npm config set @mintpond:registry https://npm.pkg.github.com/mintpond
npm config set //npm.pkg.github.com/:_authToken <MY_GITHUB_AUTH_TOKEN>

npm install @mintpond/mint-merkle@1.0.0 --save
```

__Install & Test__
```bash
# Install nodejs v10
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs -y

# Download mint-merkle
git clone https://github.com/MintPond/mint-merkle

# build & test
cd mint-merkle
npm install
npm test
``` 