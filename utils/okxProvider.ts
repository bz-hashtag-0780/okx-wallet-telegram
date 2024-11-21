import { OKXUniversalProvider } from '@okxconnect/universal-provider';

let okxUniversalProvider: OKXUniversalProvider | null = null;

export const initOKXProvider = async () => {
	if (!okxUniversalProvider) {
		okxUniversalProvider = await OKXUniversalProvider.init({
			dappMetaData: {
				name: 'My OKX DApp',
				icon: '/favicon.ico', // Replace with your app icon URL
			},
		});
	}
	return okxUniversalProvider;
};

export const getOKXProvider = () => {
	if (!okxUniversalProvider) {
		throw new Error('OKX Provider is not initialized!');
	}
	return okxUniversalProvider;
};
