import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalStyle } from 'assets/styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from 'assets/styles/theme';
import { worker } from './mocks/browser';

worker.start();

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle></GlobalStyle>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
