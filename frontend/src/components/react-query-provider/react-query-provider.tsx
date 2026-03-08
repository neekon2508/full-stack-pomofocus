import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

type ReactQueryProviderProps = {
    children: React.ReactNode;
}

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            retry: false,
        },
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },

});

function ReactQueryProvider({children}: ReactQueryProviderProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export {ReactQueryProvider};