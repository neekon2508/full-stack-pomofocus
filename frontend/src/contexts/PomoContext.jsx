import { createContext, useContext, useReducer, useState } from "react";

const PomoContext = createContext();
const initialState = {
  tasks: [],
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "create":
      return { ...state };
    default:
      throw new Error("Unknown action type");
  }
}

function PomoProvider({ children }) {
  const [{ tasks, isLoading }, dispatch] = useReducer(reducer, initialState);
  return (
    <PomoContext.Provider value={isLoading}>{children}</PomoContext.Provider>
  );
}

function usePomos() {
  const context = useContext(PomoContext);
  if (context === undefined)
    throw new Error("PomoContext was used outside the PomoProvider");
  return context;
}
export { PomoProvider, usePomos };
