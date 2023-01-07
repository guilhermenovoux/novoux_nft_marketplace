import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

import { NavBar, Footer } from '../components';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <div className="dark:bg-nft-dark bg-white min-h-screen">
      <NavBar />
      <div className="pt-65">
        <Component {...pageProps} />

      </div>
      <Footer />

    </div>

    <Script src="https://kit.fontawesome.com/69a3d36500.js" crossorigin="anonymous" />
  </ThemeProvider>

);

export default MyApp;
