import '../styles/globals.css';
import { ReactQueryWrapper, ReactQueryDevtoolsWrapper } from './providers';

export const metadata = {
	title: 'The new Windows Media Player',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
  children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ReactQueryWrapper>
					{children}
					<ReactQueryDevtoolsWrapper />
				</ReactQueryWrapper>
			</body>
		</html>
	);
}
