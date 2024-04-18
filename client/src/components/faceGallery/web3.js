import Web3 from 'web3';

async function createWeb3() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error('User denied account access');
        }
        return web3;
    }
    console.log('Please install MetaMask browser extension');
    return null;
}

export default createWeb3;