import { QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter } from 'wouter';
import { AuthGate } from '@/components/auth';
import { ColorModeProvider } from '@/components/header';
import { queryClient } from '@/lib/query-client';
import './monitoring.css';

function App() {
  return (
    <ColorModeProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthGate />
        </WouterRouter>
      </QueryClientProvider>
    </ColorModeProvider>
  );
}

export default App;
