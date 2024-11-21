/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useAuth } from '../context/AuthContextProvider';

export default function HomePage() {
	const { userAddr, chainId, logIn, logOut } = useAuth();

	return (
		<div style={{ padding: '20px' }}>
			<h1>OKX Wallet Integration</h1>
			{userAddr ? (
				<div>
					<p>Connected Address: {userAddr}</p>
					<p>Connected Chain: {chainId}</p>
					<button
						onClick={logOut}
						className="button button-disconnect"
					>
						Disconnect Wallet
					</button>
				</div>
			) : (
				<div>
					<button onClick={logIn} className="button button-connect">
						Connect Wallet
					</button>
				</div>
			)}
		</div>
	);
}
