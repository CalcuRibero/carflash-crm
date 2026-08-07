import { apiRequest } from "@/shared/utils/apiClient";
import type { Seller } from "../types";

export class SellersService {
  private readonly uri = "/users/sellers";

  async getSellers(): Promise<Seller[]> {
    return apiRequest<Seller[]>(this.uri);
  }
}
