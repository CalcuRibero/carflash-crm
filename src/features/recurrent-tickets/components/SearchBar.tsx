"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddTicket: () => void;
}

export function SearchBar({ searchValue, onSearchChange, onAddTicket }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">
          Buscar Tickets Fijos
        </label>
        <Input
          id="search"
          type="text"
          placeholder="BUSCAR Tickets Fijos"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>
      <Button onClick={onAddTicket} className="whitespace-nowrap">
        AGREGAR TICKET RECURRENTE
      </Button>
    </div>
  );
}
