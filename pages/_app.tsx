import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { OKXProvider } from '../context/OKXProvider';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<OKXProvider>
			<Component {...pageProps} />
		</OKXProvider>
	);
}
