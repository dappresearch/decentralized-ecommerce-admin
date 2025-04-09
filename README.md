
Experimental decentralize e-commerce
* website: https://apsostore.com

* smart-contract: https://github.com/dappresearch/decentralized-ecommerce-smartcontract
  Main core logic that needs to be deployed over preferred network.

* front-end:https://github.com/dappresearch/decentralized-ecommerce-frontend
  It is the main landing page for the website, where user interaction happens.

* admin:https://github.com/dappresearch/decentralized-ecommerce-admin
  This is for the owner/seller to manage orders and administration settings.

### Initial Setup
You need to deploy the smart contract first. Visit the link below and follow the instructions:

Smart contract: https://github.com/dappresearch/decentralized-ecommerce-smartcontract

Create a .env file in the root directory and structure the variables according to the .example.env file.

For example, if the smart contract has been deployed on the Sepolia network, the contract address and Price V3 address will be logged in the console. Copy these addresses and store them in the .env file as shown in the .example.env file:

VITE_SEPOLIA_CONTRACT_ADDRESS="Sepolia deployment address"
VITE_SEPOLIA_PRICE_V3_ADDRESS="Sepolia price feed deployment address"

Need to configure wallet connect first otherwise it'll throw an error, vist https://cloud.reown.com/sign-in, 

get a project id and store inside .env file.

VITE_PROJECTID="Your wallet connect project id"

Regarding private key inside .env file

VITE_PRIVATE_KEY="Your private key"

This private key needs to be related with the Public key(derived from the private key) that is used to encrypt buyer address.

### Video tutorial
Full video: https://youtu.be/HW9AnF894Go

Admin page installation video: https://youtu.be/QBdC_IfeNQc

### Tutorial Video
Full video: https://youtu.be/HW9AnF894Go

Front-end installation video: https://youtu.be/QBdC_IfeNQc

### Node and Npm version

node version >= 20.9.0
npm version >= 10.1.0

### Package installation

```bash
npm install

```

### Building

To create a production version of your app:

```bash
npm run build
```

### Local host deployment

```bash
npm run dev

```



