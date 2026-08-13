import { apiRequest } from "@/shared/utils/apiClient";
import type { User } from "@/lib/api/types";

export class SellersService {
  private readonly uri = "/users/sellers";

  async getSellers(): Promise<User[]> {
    return apiRequest<User[]>(this.uri);
  }
}
