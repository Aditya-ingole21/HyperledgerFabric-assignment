# Hyperledger Fabric – User Registration & Authentication

A simple implementation of user registration and authentication in Hyperledger Fabric using Fabric CA. The project shows how identities are created, enrolled, stored, and used to authenticate against the network.

## Installation

```
1.Install Hyperledger Fabric binaries, samples, and Docker images (only once):
   ```bash
   curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh | bash -s -- docker binary samples

2.Navigate to the test network:
cd ~/fabric-samples/test-network

Start the network with Fabric CA enabled:
./network.sh down
./network.sh up createChannel -ca -c mychannel

## Usage/Examples

Main Authentication Test
Run the Node.js app to verify authentication using user1's credentials:

cd path/to/your/project-folder
npm install
node app.js

Expected output:
✅ Authentication Successful as User1!
📊 Channel "mychannel" block height: exists and accessible
Raw response length: 70

Bonus: Login API
Start the Express API for dynamic user registration, enrollment, and login:
node server.js

Then use curl (or Postman) to test:
# Register a new user
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}'

# Enroll the user
curl -X POST http://localhost:3000/enroll -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}'

# Login (authenticates using the certificate)
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"myuser"}'

# Features

-Automatic registration & enrollment via Fabric CA (using test-network script)
-File-system wallet (MSP) for storing certificates and private keys
-Node.js client using Fabric Gateway SDK for authentication
-Query system chaincode (qscc) to prove successful authentication
-Bonus Express API for full user lifecycle (register → enroll → login)


## Screenshots

Network Startup & User Registration/Enrollment
Network startup showing automatic registration and enrollment of user1

Running Containers (including Fabric CAs)
docker ps output showing all containers

Main Authentication Success
node app.js successful output

Bonus API – Register, Enroll, Login
Bonus API register success
Bonus API enroll success
Bonus API login success

## Tech Stack

-Hyperledger Fabric v2.5.14
-Fabric CA v1.5.15
-Node.js
-@hyperledger/fabric-gateway
-Express (for bonus API)