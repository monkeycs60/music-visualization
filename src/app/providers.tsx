'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export const ReactQueryWrapper = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export const ReactQueryDevtoolsWrapper = () => (
    <ReactQueryDevtools initialIsOpen={false} />
);