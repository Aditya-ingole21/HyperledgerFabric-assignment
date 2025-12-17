const fs = require('fs').promises;
const path = require('path');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const { common } = require('@hyperledger/fabric-protos');

async function main() {
    const mspPath = '/home/aditya/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp';

    const cert = await fs.readFile(path.join(mspPath, 'signcerts', 'cert.pem'));

    const keyDir = path.join(mspPath, 'keystore');
    const keyFiles = await fs.readdir(keyDir);
    const privateKeyPem = await fs.readFile(path.join(keyDir, keyFiles[0]));
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);

    const tlsCertPath = '/home/aditya/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt';
    const tlsCert = await fs.readFile(tlsCertPath);

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
        const resultBytes = await qscc.evaluateTransaction('GetChainInfo', 'mychannel');
        

        const chainInfo = common.BlockchainInfo.decode(resultBytes);
        console.log('Block height:', chainInfo.height.toString());

        
    
        

        console.log('✅ Authentication Successful as User1!');
        console.log('📊 Channel "mychannel" block height:', resultBytes.length > 0 ? 'exists and accessible' : 'empty');
        console.log('Raw response length:', resultBytes.length);

    } catch (error) {
        console.error('❌Authentication failed:', error.message);
    } finally {
        gateway.close();
        client.close();
    }
}

main();