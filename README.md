# ZenGuard Core SDK for Safe Accounts

[![License](https://img.shields.io/badge/license-GPL3-blue.svg)](https://github.com/zenguardxyz/core-sdk/blob/main/LICENSE)

## Description

JS SDK to use modules for Safe Accounts and use module marketplace

## Features

- APIs to use 7579 modules on existing Safe Accounts
- Use all the existing modules of Rhinestone, ZeroDev, Biconomy etc

## Usage

1. Clone the repository:

    ```bash
    npm i @zenguard/core-sdk 
    ```

2. Import and initialize:

    ```bash
    import { SafeCore7579 } from '@zenguard/core-sdk';

    onst chainId = 11155111;
    const safeAddress = '';
    const ownerAddress = '0xa2C0bf9712a65859D42634C932FBdA332DeDe967';

    const initializer = new SafeCore7579(chainId, safeAddress, ownerAddress);

    await initializer.init()
    ```



## Build locally

1. Clone the repository:

    ```bash
    git clone https://github.com/zenguardxyz/core-sdk.git
    ```

2. Run test:

    ```bash
    npm install
    npm run test
    ```


## License

This project is licensed under the [GPL-3.0 license](./LICENSE).
