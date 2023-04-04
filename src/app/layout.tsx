import '../styles/globals.css';
import '../../public/favicon.ico';
import { Providers } from '@/app/redux/provider';

export const metadata = {
   title: 'Tunescape',
   description: 'Music Player, Pure music analyzer',
};

export default function RootLayout({
   children,
}: {
  children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <link rel="icon" type="image/x-icon" href="/favicon.ico" />
         <body>
            <Providers>
               {children}
            </Providers>
         </body>
      </html>
   );
}
