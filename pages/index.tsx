import WalletConnectButton from '../components/WalletConnectButton';

export default function Home() {
	return (
		<div style={{ padding: '20px' }}>
			<h1>OKX Wallet Integration</h1>
			<p>Connect your OKX wallet</p>
			<WalletConnectButton />
		</div>
	);
}
