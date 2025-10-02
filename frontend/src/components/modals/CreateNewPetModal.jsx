import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { usePetProvider } from "@/context/PetProvider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "../FileUpload";

export function CreateNewPetModal({ closeModal, isOpen }) {
  const [activeStep, setActiveStep] = useState(0);
  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);
  const { addPet } = usePetProvider();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    sex: "",
    birthDate: undefined,
    image: null,
    castrated: "",
    vaccinated: "",
    vaccines: [],
  });

  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleVaccineChange(vaccine, checked) {
    setFormData((prev) => ({
      ...prev,
      vaccines: checked
        ? [...prev.vaccines, vaccine]
        : prev.vaccines.filter((v) => v !== vaccine),
    }));
  }

  function calculateAge(birthDate) {
    if (!birthDate) return "Idade não informada";

    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0 && months > 0) {
      return `${years} ano${years > 1 ? "s" : ""} e ${months} mês${
        months > 1 ? "es" : ""
      }`;
    } else if (years > 0) {
      return `${years} ano${years > 1 ? "s" : ""}`;
    } else {
      return `${months} mês${months > 1 ? "es" : ""}`;
    }
  }

  function handleSubmit() {
    if (activeStep === 0) {
      setActiveStep(1);
      return;
    }

    const newPet = {
      name: formData.name,
      age: calculateAge(formData.birthDate),
      breed: formData.breed,
      sex: formData.sex === "1" ? "Macho" : "Fêmea",
      image: formData.image || "/src/img/pet1.png",
      type: formData.type,
      castrated: formData.castrated,
      vaccinated: formData.vaccinated,
      vaccines: formData.vaccines,
    };

    addPet(newPet);
    closeModal();

    setFormData({
      name: "",
      type: "",
      breed: "",
      sex: "",
      birthDate: undefined,
      image: null,
      castrated: "",
      vaccinated: "",
      vaccines: [],
    });

    setActiveStep(0);
    setDate(undefined);
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="p-6">
        <DialogHeader className="flex flex-col gap-2.5">
          <DialogTitle>Cadastrar Pet</DialogTitle>
          <DialogDescription className="max-w-sm">
            Insira os dados para cadastrar seu pet. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <form className="my-2 flex flex-col gap-4">
          {activeStep === 0 ? (
            <>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Nome</Label>
                <Input
                  placeholder="John Doe"
                  className="h-10"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Cachorro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Raça</Label>
                <Select
                  value={formData.breed}
                  onValueChange={(value) => handleInputChange("breed", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yorkshire">Yorkshire</SelectItem>
                    <SelectItem value="golden">Golden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Sexo</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Macho</SelectItem>
                    <SelectItem value="2">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Data de Nascimento</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="input"
                      id="date"
                      className="w-full h-10 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString("pt-BR") : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        handleInputChange("birthDate", date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Imagem do Pet</Label>
                <FileUpload />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <Label>Seu pet é castrado?</Label>
                <RadioGroup
                  value={formData.castrated}
                  onValueChange={(value) =>
                    handleInputChange("castrated", value)
                  }
                  className="flex gap-3"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="yes-castrated" id="yes-castrated" />
                    <Label htmlFor="yes-castrated" className="pl-2">
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no-castrated" id="no-castrated" />
                    <Label htmlFor="no-castrated" className="pl-2">
                      Não
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <Label>Seu pet é vacinado?</Label>
                <RadioGroup
                  value={formData.vaccinated}
                  onValueChange={(value) =>
                    handleInputChange("vaccinated", value)
                  }
                  className="flex gap-3"
                >
                  <div className="flex items-center">
                    <RadioGroupItem
                      value="yes-vaccinated"
                      id="yes-vaccinated"
                    />
                    <Label htmlFor="yes-vaccinated" className="pl-2">
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="no-vaccinated" id="no-vaccinated" />
                    <Label htmlFor="no-vaccinated" className="pl-2">
                      Não
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <Label>Marque as vacinas que seu pet tomou</Label>
                <div className="flex items-center">
                  <Checkbox
                    id="v8-v10"
                    checked={formData.vaccines.includes("v8-v10")}
                    onCheckedChange={(checked) =>
                      handleVaccineChange("v8-v10", checked)
                    }
                  />
                  <Label
                    htmlFor="v8-v10"
                    className="text-muted-foreground pl-2"
                  >
                    Vacina Multiplas (V8 e V10)
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="antirabies"
                    checked={formData.vaccines.includes("antirabies")}
                    onCheckedChange={(checked) =>
                      handleVaccineChange("antirabies", checked)
                    }
                  />
                  <Label
                    htmlFor="antirabies"
                    className="text-muted-foreground pl-2"
                  >
                    Vacina Antirrãbica
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="canine"
                    checked={formData.vaccines.includes("canine")}
                    onCheckedChange={(checked) =>
                      handleVaccineChange("canine", checked)
                    }
                  />
                  <Label
                    htmlFor="canine"
                    className="text-muted-foreground pl-2"
                  >
                    Vacina de Gripe Canina
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="giardia"
                    checked={formData.vaccines.includes("giardia")}
                    onCheckedChange={(checked) =>
                      handleVaccineChange("giardia", checked)
                    }
                  />
                  <Label
                    htmlFor="giardia"
                    className="text-muted-foreground pl-2"
                  >
                    Vacina contra Giardia
                  </Label>
                </div>
              </div>
            </>
          )}
        </form>
        <DialogFooter className="ml-auto">
          {activeStep !== 0 && (
            <Button
              variant="outline"
              size="lg"
              className="px-4"
              onClick={() => setActiveStep(0)}
            >
              Voltar
            </Button>
          )}
          <Button size="lg" className="px-4" onClick={handleSubmit}>
            {activeStep === 0 ? "Continuar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
