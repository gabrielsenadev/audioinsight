"use client";
import ErrorViewer from "@/components/ErrorViewer";
import { ErrorProvider } from "./context/ErrorContext";

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorProvider>
      <ErrorViewer />
      {children}
    </ErrorProvider>
  );
}
