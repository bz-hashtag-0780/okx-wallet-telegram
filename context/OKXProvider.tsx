/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

interface OKXContextType {
	okxUI: any;
	initializeOKX: () => Promise<void>;
}

const OKXContext = createContext<OKXContextType | undefined>(undefined);

export const OKXProvider = ({ children }: { children: ReactNode }) => {
	const [okxUI, setOkxUI] = useState<any>(null);

	const initializeOKX = async () => {
		if (!okxUI) {
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
		}
	};

	useEffect(() => {
		initializeOKX();
	}, []);

	return (
		<OKXContext.Provider value={{ okxUI, initializeOKX }}>
			{children}
		</OKXContext.Provider>
	);
};

export const useOKX = () => {
	const context = useContext(OKXContext);
	if (!context) {
		throw new Error('useOKX must be used within an OKXProvider');
	}
	return context;
};
