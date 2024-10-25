"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export default function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
}
