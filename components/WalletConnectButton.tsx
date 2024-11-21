/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

const WalletConnectButton = () => {
	const [connected, setConnected] = useState(false);
	const [address, setAddress] = useState<string | null>(null);
	const [okxUI, setOkxUI] = useState<any>(null);

	// Initialize the OKX UI SDK
	useEffect(() => {
		const initializeOKXUI = async () => {
			const ui = await OKXUniversalConnectUI.init({
				dappMetaData: {
					icon: '/favicon.ico', // Replace with your app icon
					name: 'My OKX DApp',
				},
				actionsConfiguration: {
					modals: 'all',
					returnStrategy: 'none',
				},
				uiPreferences: {
					theme: THEME.LIGHT,
				},
				language: 'en_US',
			});
			setOkxUI(ui);
		};

		initializeOKXUI();
	}, []);

	// Handle wallet connection
	const handleConnect = async () => {
		if (!okxUI) {
			console.error('OKX UI is not initialized!');
			return;
		}

		try {
			const session = await okxUI.openModal({
				namespaces: {
					eip155: {
						chains: ['eip155:1'], // Ethereum Mainnet
						defaultChain: '1',
					},
				},
			});

			const accounts = session?.accounts || [];
			if (accounts.length > 0) {
				setAddress(accounts[0]);
				setConnected(true);

				// Automatically add the custom chain
				await addCustomChain();
			}
		} catch (error) {
			console.error('Error connecting wallet:', error);
		}
	};

	// Add a custom Ethereum chain (Polygon Mumbai Testnet)
	const addCustomChain = async () => {
		try {
			if (!okxUI) {
				console.error('OKX UI is not initialized!');
				return;
			}

			await okxUI.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: '747', // Hexadecimal for 747 - 0x2EB
						chainName: 'Flow EVM',
						nativeCurrency: {
							name: 'Flow',
							symbol: 'FLOW',
							decimals: 18,
						},
						rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
						blockExplorerUrls: ['https://evm.flowscan.io/'],
					},
				],
			});

			console.log('Custom chain added successfully!');
		} catch (error) {
			console.error('Error adding custom chain:', error);
		}
	};

	return (
		<div>
			{connected ? (
				<div>
					<p>Connected: {address}</p>
				</div>
			) : (
				<button onClick={handleConnect}>Connect Wallet</button>
			)}
		</div>
	);
};

export default WalletConnectButton;
