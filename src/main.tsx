import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './appRoutes';

async function enableMocking() {
  if (import.meta.env.VITE_MOCK !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const config = {
  initialColorMode: 'night',
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

enableMocking()
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </StrictMode>
    );
  })
  .catch((error: unknown) => {
    console.error('Error during initialization:', error);
  });
