# Hyperledger Fabric – User Registration & Authentication

A simple implementation of user registration and authentication in Hyperledger Fabric using Fabric CA. The project shows how identities are created, enrolled, stored, and used to authenticate against the network.

## Installation

1. Install Hyperledger Fabric binaries, samples, and Docker images (only once):
   ```bash
   curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh | bash -s -- docker binary samples

2.Navigate to the test network:

```bash
  cd ~/fabric-samples/test-network
```
    
Start the network with Fabric CA enabled:
```bash
 ./network.sh down
./network.sh up createChannel -ca -c mychannel
```
This starts the peers, orderer, and three CA servers. It also automatically registers and enrolls user1 (password: user1pw).

## Main Authentication Test

#### Get all items

```http
  cd path/to/your/project-folder
npm install
node app.js
```

Expected output:

✅ Authentication Successful as User1!
📊 Channel "mychannel" block height: exists and accessible
Raw response length: 70


## Bonus: Login API

Start the Express API for dynamic user registration, enrollment, and login:
```bash
node server.js
```

Then use curl (or Postman) to test:

```bash
# Register a new user
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}'

# Enroll the user
curl -X POST http://localhost:3000/enroll -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}'

# Login (authenticates using the certificate)
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"myuser"}'
```
## Screenshots


Network Startup & User Registration/Enrollment
<img width="1331" height="220" alt="Screenshot 2025-12-16 175033" src="https://github.com/user-attachments/assets/98f3a86b-88e9-434a-a848-1e3ac0b9a431" />
<img width="1303" height="404" alt="Screenshot 2025-12-16 175308" src="https://github.com/user-attachments/assets/388bca5d-2fcc-4c9a-a9b8-8d49507fd252" />



Running Containers (including Fabric CAs)
<img width="1298" height="578" alt="Screenshot 2025-12-16 184826" src="https://github.com/user-attachments/assets/b37073e9-850a-4c3f-9378-282d29f082da" />

Main Authentication Success
<img width="1398" height="113" alt="Screenshot 2025-12-17 231743" src="https://github.com/user-attachments/assets/7dc64f4f-83c7-422d-9bbe-9f785d80573b" />

Bonus API – Register, Enroll, Login
<img width="1490" height="268" alt="Screenshot 2025-12-17 232021" src="https://github.com/user-attachments/assets/88f93556-d875-4cae-8c3e-e953a35aafcc" />

## Tech Stack

-Hyperledger Fabric v2.5.14

-Fabric CA v1.5.15

-Node.js

-@hyperledger/fabric-gateway

-Express (for bonus API)
