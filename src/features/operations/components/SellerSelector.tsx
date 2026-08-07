"use client";

import { useMemo, useState } from "react";
import { Loader2, Search, UserRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSellers } from "@/features/operations/hooks/useSellers";
import type { Seller } from "@/features/operations/types";

interface SellerSelectorProps {
  value: string;
  onValueChange: (sellerId: string) => void;
}

function formatSellerLabel(seller: Seller) {
  return seller.fullName;
}

export function SellerSelector({ value, onValueChange }: SellerSelectorProps) {
  const { sellers, isLoading, error } = useSellers();
  const [search, setSearch] = useState("");

  const filteredSellers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return sellers;

    if (!sellers || sellers.length === 0) return [];

    return sellers.filter((seller) => {
      const haystack = `${seller.fullName} ${seller.email ?? ""} ${seller.phone ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [sellers, search]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, email o teléfono"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando vendedores...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-muted-foreground" />
                      {formatSellerLabel(seller)}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">No se encontraron vendedores.</div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
