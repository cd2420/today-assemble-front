import React from 'react';
import AppRouter from './routes/Router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


function App() {

  const theme = createTheme();
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <AppRouter />
            </Container>
      </ThemeProvider>
    </div>

  );
}

export default App;
