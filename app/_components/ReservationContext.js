"use client";
import { useContext, createContext, useState } from "react";

const ReservationContext = createContext();
const initialState = { from: undefined, to: undefined };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}
function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("context used outside provider");
  return context;
}
export { useReservation, ReservationProvider };
