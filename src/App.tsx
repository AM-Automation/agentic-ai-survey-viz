import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { accentureTheme } from './styles/theme';
import { HomePage } from './pages/HomePage/HomePage';

import { FilterProvider } from './features/survey/context/FilterContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={accentureTheme}>
        <FilterProvider>
          <HomePage />
        </FilterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
