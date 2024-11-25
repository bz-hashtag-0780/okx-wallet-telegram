import '../styles/globals.css';
import { AuthContextProvider } from '../context/AuthContextProvider';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthContextProvider>
			<Component {...pageProps} />
		</AuthContextProvider>
	);
}
