import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";

const PetContext = createContext();

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const loadPets = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await api.getPets(token);
      setPets(data);
    };
    loadPets();
  }, []);

  return (
    <PetContext.Provider value={{ pets, setPets }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePetProvider = () => useContext(PetContext);
