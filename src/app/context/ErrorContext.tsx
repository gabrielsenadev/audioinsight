import { Dispatch, createContext, useContext, useState } from "react";

type ContextProps = {
  error: string;
  setError: Dispatch<string>;
  clearError: () => void;
}

const ErrorContext = createContext<ContextProps | undefined>(undefined);

export const ErrorProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      { children }
    </ErrorContext.Provider>
  )
};

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('ErrorContenxt Provider not found.');
  }

  return context;
};
