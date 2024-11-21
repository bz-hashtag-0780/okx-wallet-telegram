/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

export const TESTNET_PARAMS = {
	chainId: '545', // Flow Testnet (decimal)
	chainName: 'Flow Testnet',
	rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
	nativeCurrency: {
		name: 'Flow',
		symbol: 'FLOW',
		decimals: 18,
	},
	blockExplorerUrls: ['https://evm-testnet.flowscan.io/'],
};

export const MAINNET_PARAMS = {
	chainId: '747', // Flow Mainnet (decimal)
	chainName: 'Flow Mainnet',
	rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
	nativeCurrency: {
		name: 'Flow',
		symbol: 'FLOW',
		decimals: 18,
	},
	blockExplorerUrls: ['https://evm.flowscan.io/'],
};

export default function useCurrentUser() {
	const [userAddr, setUserAddr] = useState<string | null>(null);
	const [chainId, setChainId] = useState<string | null>(null);
	const [okxUI, setOkxUI] = useState<any>(null);

	useEffect(() => {
		// Initialize the OKX SDK
		const initializeOKX = async () => {
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

		initializeOKX();
	}, []);

	// Handle wallet connection
	const logIn = async () => {
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
						chains: ['eip155:747'], // Flow Mainnet
					},
				},
			});

			const accounts = session?.accounts || [];
			const connectedChainId =
				session?.namespaces?.eip155?.chains?.[0]?.split(':')?.[1];

			if (accounts.length > 0) {
				setUserAddr(accounts[0]);
				setChainId(connectedChainId);

				// Automatically switch to or add the Flow Mainnet
				await switchChain(MAINNET_PARAMS.chainId);
			}
		} catch (error) {
			console.error('Failed to connect wallet:', error);
		}
	};

	// Handle chain switching
	const switchChain = async (chainId: string) => {
		try {
			await okxUI.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainId }],
			});
			setChainId(chainId);
		} catch (error: any) {
			// If the chain isn't added, add it
			if (error.code === 4902) {
				try {
					await okxUI.request({
						method: 'wallet_addEthereumChain',
						params: [MAINNET_PARAMS], // Add Flow Mainnet
					});
					setChainId(chainId);
				} catch (addError) {
					console.error('Failed to add Flow Mainnet:', addError);
				}
			} else {
				console.error('Failed to switch chain:', error);
			}
		}
	};

	// Handle wallet disconnection
	const logOut = async () => {
		try {
			await okxUI.disconnect();
			setUserAddr(null);
			setChainId(null);
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		}
	};

	return [userAddr, chainId, logIn, logOut];
}
