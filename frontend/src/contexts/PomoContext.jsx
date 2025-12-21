import { createContext, useContext, useState } from "react";

const PomoContext = createContext();

function PomoProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <PomoContext.Provider value={isLoading}>{children}</PomoContext.Provider>
  );
}

function usePomo() {
  const context = useContext(PomoContext);
  if (context === undefined)
    throw new Error("PomoContext was used outside the PomoProvider");
  return context;
}
export { PomoProvider, usePomo };
