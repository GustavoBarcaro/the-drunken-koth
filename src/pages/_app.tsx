import { AppProps } from 'next/app';
import '@/styles/global.scss';
import { Provider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}
