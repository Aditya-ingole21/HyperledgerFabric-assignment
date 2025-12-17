# Hyperledger Fabric – User Registration & Authentication

This is my submission for the intern assignment. The goal was to set up a Fabric network with Fabric CA, register and enroll a user, store the credentials, and then prove authentication works by connecting to the network and querying the ledger.

## Setup & Environment

I used Hyperledger Fabric v2.5.14 on WSL2 (Ubuntu) with Docker Desktop.

1. Installed Fabric binaries, samples, and Docker images using the official install script.
2. Started the test network with CA support:
```bash
 cd ~/fabric-samples/test-network
 ./network.sh down
./network.sh up createChannel -ca -c mychannel

This command starts the peers, orderer, and three Fabric CA servers. It also automatically registers and enrolls a default user called user1 (password: user1pw) for both organizations.
See screenshot screenshots/01-network-startup-and-registration-enrollment.png for the full terminal output showing registration and enrollment.
See screenshot screenshots/02-docker-ps.png for proof that all containers (including the three CA containers) are running.

User Credentials
The credentials for user1 (Org1) are stored in the file-system MSP at:

~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/
Public certificate: signcerts/cert.pem
Private key: keystore/<random-named-key-file>

This satisfies the requirement of storing credentials in a wallet (file system used here).
Authentication Application
I wrote a simple Node.js application (app.js) that:

Loads user1's certificate and private key from the MSP folder
Connects to the Fabric gateway using that identity
Queries the system chaincode qscc on channel mychannel (GetChainInfo)

A successful query proves that authentication works.
Run with:
node app.js

Output (see screenshot screenshots/03-authentication-success.png):
✅ Authentication Successful as User1!
📊 Channel "mychannel" block height: exists and accessible
Raw response length: 70