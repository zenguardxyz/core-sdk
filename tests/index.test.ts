// tests/index.test.ts

import { SafeCore7579 } from '../src/';

import {
  getOwnableValidator,
} from "@rhinestone/module-sdk";

test('Intializing SafeCore7579 Test', async () => {

const chainId = 11155111;
const safeAddress = '';
const ownerAddress = '0xa2C0bf9712a65859D42634C932FBdA332DeDe967';

const initializer = new SafeCore7579(chainId, safeAddress, ownerAddress);

await initializer.init()

});

test('Module Install Test', async () => {

  const chainId = 11155111;
  const privateKey = '47cfffe655129fa5bce61a8421eb6ea97ec6d5609b5fbea45ad68bacede19d8b';
  const safeAddress = '';
  const ownerAddress = '0xa2C0bf9712a65859D42634C932FBdA332DeDe967';
  
  const initializer = new SafeCore7579(chainId, safeAddress, ownerAddress, privateKey);
  
  await initializer.init()
  try {
   await initializer.installModule(getOwnableValidator({ owners: [ownerAddress], threshold: 1}))
  }
  catch(e) {
    console.log(e)
  }
  
  });