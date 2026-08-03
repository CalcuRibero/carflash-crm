import { apiRequest } from "@/shared/utils/apiClient";
import type { Car } from "../types";

export class CarsService {
  private readonly uri = "/cars";

  async getCars(): Promise<Car[]> {
    return apiRequest<Car[]>(this.uri);
  }
}
