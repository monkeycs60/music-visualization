'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    DZ: any;
  }
}

const DeezerSDK = () => {
   useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://e-cdns-files.dzcdn.net/js/min/dz.js';
      script.async = true;
      script.onload = () => {
         window.DZ.init({
            appId: '593524',
            channelUrl: 'http://localhost:3000',
         });
      };
      document.body.appendChild(script);

      return () => {
         if (document.body.contains(script)) {
            document.body.removeChild(script);
         }
      };
   }, []);

   return <div id="dz-root"></div>;
};

export default DeezerSDK;