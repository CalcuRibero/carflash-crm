"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/lib/api";
import { useSellers } from "@/features/users/hooks/useSellers";

interface SellerSelectorProps {
  value: string;
  onValueChange: (sellerId: string, seller?: User) => void;
}

function formatSellerLabel(seller: User) {
  return `${seller.fullName} ${seller.email}`;
}

export function SellerSelector({ value, onValueChange }: SellerSelectorProps) {
  const { users , isLoading, errorMessage } = useSellers();
  const [search, setSearch] = useState("");

  const filteredSellers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return users;

    if(!users || users.length === 0) return [];

    return users.filter((seller) => {
      const haystack = `${seller.fullName} ${seller.email}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [users, search]);

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 bg-slate-50/70 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando vendedores...
        </div>
      ) : errorMessage ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <Select 
          value={value} 
          onValueChange={(sellerId) => {
            const seller = users?.find(u => String(u.id) === sellerId);
            onValueChange(sellerId, seller || undefined);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <SelectItem key={seller.id} value={String(seller.id) ?? ""}>
                    {formatSellerLabel(seller)}
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
