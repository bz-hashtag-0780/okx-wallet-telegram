/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

const Home = () => {
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
				optionalNamespaces: {
					eip155: {
						chains: ['eip155:747'], // Flow EVM
					},
				},
			});

			const accounts = session?.accounts || [];
			if (accounts.length > 0) {
				setAddress(accounts[0]);
				setConnected(true);

				// Automatically add the custom Flow chain
				await addCustomChain();
			}
		} catch (error) {
			console.error('Error connecting wallet:', error);
		}
	};

	// Add Flow EVM Chain
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
						chainId: '747',
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

			console.log('Flow EVM chain added successfully!');
		} catch (error) {
			console.error('Error adding custom chain:', error);
		}
	};

	// Handle wallet disconnection
	const handleDisconnect = async () => {
		if (!okxUI) {
			console.error('OKX UI is not initialized!');
			return;
		}

		try {
			await okxUI.disconnect();
			setAddress(null);
			setConnected(false);
			console.log('Wallet disconnected successfully!');
		} catch (error) {
			console.error('Error disconnecting wallet:', error);
		}
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1>OKX Wallet Integration</h1>
			<p>
				Connect your OKX wallet to add the Flow EVM chain automatically.
			</p>
			<div>
				{address ? (
					<div>
						<p>Connected: {address}</p>
						<button
							onClick={handleDisconnect}
							className="button button-disconnect"
						>
							Disconnect Wallet
						</button>
					</div>
				) : (
					<div>
						<button
							onClick={handleConnect}
							className="button button-connect"
						>
							Connect Wallet
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
