const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const testNetworkPath = '/home/aditya/fabric-samples/test-network';
const org1Path = `${testNetworkPath}/organizations/peerOrganizations/org1.example.com`;
const caCertPath = `${testNetworkPath}/organizations/fabric-ca/org1/ca-cert.pem`;

function runCaCommand(cmd) {
    const fabricCaClient = `${process.env.HOME}/fabric-samples/bin/fabric-ca-client`;
    const fullCmd = `${fabricCaClient} ${cmd}`;
    
    // Add required environment for fabric-ca-client
    const env = {
        ...process.env,
        FABRIC_CA_CLIENT_HOME: org1Path
    };
    
    try {
        const output = execSync(fullCmd, { 
            cwd: org1Path, 
            encoding: 'utf8',
            env: env,
            stdio: ['ignore', 'pipe', 'pipe']  // Capture stdout and stderr
        });
        console.log('CA Command Output:', output);  // For debugging
        return output;
    } catch (error) {
        const errMsg = error.stderr ? error.stderr.toString() : error.message;
        console.error('CA Command Error:', errMsg);
        throw new Error(errMsg || 'Fabric CA command failed');
    }
}

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

const cmd = `register --home "${org1Path}" --caname ca-org1 --id.name ${username} --id.secret ${password} --id.type client --tls.certfiles "${caCertPath}"`;
    try {
        runCaCommand(cmd);
        res.json({ message: `User ${username} registered successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/enroll', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const userMspPath = `${org1Path}/users/${username}@org1.example.com/msp`;
const cmd = `enroll --home "${org1Path}" -u https://${username}:${password}@localhost:7054 --caname ca-org1 -M "${userMspPath}" --tls.certfiles "${caCertPath}"`;
    try {
        runCaCommand(cmd);
        res.json({ message: `User ${username} enrolled successfully. Credentials saved to MSP folder.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


async function authenticateUser(username) {
    const userMspPath = `${org1Path}/users/${username}@org1.example.com/msp`;
    const certPath = path.join(userMspPath, 'signcerts', 'cert.pem');
    const keyDir = path.join(userMspPath, 'keystore');

    const cert = await fs.readFile(certPath);
    const keyFiles = await fs.readdir(keyDir);
    const privateKeyPem = await fs.readFile(path.join(keyDir, keyFiles[0]));
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);

    const tlsCert = await fs.readFile(`${org1Path}/peers/peer0.org1.example.com/tls/ca.crt`);

    const client = new (require('@grpc/grpc-js')).Client('localhost:7051', require('@grpc/grpc-js').credentials.createSsl(tlsCert));

    const gateway = connect({
        client,
        identity: { mspId: 'Org1MSP', credentials: cert },
        signer,
        discovery: { enabled: true, asLocalhost: true }
    });

    try {
        const network = gateway.getNetwork('mychannel');
        const qscc = network.getContract('qscc');
        await qscc.evaluateTransaction('GetChainInfo', 'mychannel');
        return true;
    } finally {
        gateway.close();
        client.close();
    }
}

app.post('/login', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    try {
        const success = await authenticateUser(username);
        if (success) {
            res.json({ message: `Login successful for ${username}! Authentication verified via ledger query.` });
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Login failed: ' + error.message });
    }
});

app.listen(3000, () => {
    console.log(' Login API running on http://localhost:3000');
    console.log('Endpoints: POST /register, /enroll, /login');
});