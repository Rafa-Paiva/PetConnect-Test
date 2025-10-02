import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateNewPetModal } from "@/components/modals/CreateNewPetModal";

export function Pet() {
  const [pets, setPets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get("/user/me/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(response.data.pets || []);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar pets");
      }
    };
    fetchPets();
  }, [token]);

  return (
    <>
      <main className="pl-[278px] pr-[60px] mt-12">
        {pets.length > 0 ? (
          <div className="flex flex-col gap-5.5">
            {/* Aqui você renderiza os pets igual você tinha */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 h-[calc(100vh-48px)]">
            <span className="text-muted-foreground text-[26px] font-semibold">
              Nenhum pet encontrado
            </span>
            <Button onClick={() => setIsOpen(true)} size="lg">
              <PlusIcon className="w-4 h-4" />
              Cadastrar
            </Button>
          </div>
        )}
      </main>
      <CreateNewPetModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
}
