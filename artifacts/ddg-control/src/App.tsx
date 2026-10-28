import { QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter } from 'wouter';
import { AuthGate } from '@/components/auth';
import { queryClient } from '@/lib/query-client';
import './night-glass.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AuthGate />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
