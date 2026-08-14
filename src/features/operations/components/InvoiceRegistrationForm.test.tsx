import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { InvoiceRegistrationForm } from "./InvoiceRegistrationForm";
import { useCreateInvoice } from "../../invoice/hooks/useCreateInvoice";

// --- Mocks de dependencias externas -------------------------------------

jest.mock("../../invoice", () => ({
  useCreateInvoice: jest.fn(),
}));

jest.mock("../hooks/useCars", () => ({
  useCars: jest.fn(() => ({ cars: [] })),
}));

// jest.mock("src/lib/printer/printer.ts", () => ({
//   printInvoice: jest.fn(),
// }));

// VehicleSelector y SellerSelector se simplifican a botones que disparan
// onValueChange, evitando depender de sus hooks/fetch internos.
jest.mock("./VehicleSelector", () => ({
  VehicleSelector: ({ onValueChange }: { onValueChange: (car: any) => void }) => (
    <button
      type="button"
      onClick={() =>
        onValueChange({
          id: "756b7a44-36a5-4436-82c9-dce3b60904f3",
          domain: "AB123CD",
          brand: "Test Brand",
          model: "Test Model",
          year: 2022,
          vin: "TESTVIN",
          price: 0,
          status: "AVAILABLE",
        })
      }
    >
      mock-select-vehicle
    </button>
  ),
}));

jest.mock("./SellerSelector", () => ({
  SellerSelector: ({ onValueChange }: { onValueChange: (seller: any) => void }) => (
    <button
      type="button"
      onClick={() =>
        onValueChange({
          id: 1,
          username: "vendedor",
          email: "vendedor@carflash.com",
          role: "CarSeller",
          fullName: "Vendedor Test",
          isActive: true,
          createdAt: "",
          updatedAt: "",
        })
      }
    >
      mock-select-seller
    </button>
  ),
}));

const mockedUseCreateInvoice = useCreateInvoice as jest.Mock;

// Datos provistos para el test (representan la data cargada en el form)
const TEST_DATA = {
  invoiceNumber: "FC-2026-1408",
  subtotal: "1",
  taxAmount: "1",
  totalAmount: "1",
  customer: {
    fullName: "Gonzalo",
    document: "12345678",
    address: "Av Colon 1750",
    phone: "11 12345678",
    email: "gonzaloribero98@gmail.com",
  },
  carId: "756b7a44-36a5-4436-82c9-dce3b60904f3",
  administrationNotes: "",
  paidAtInput: "2026-08-14",
  paidAtISO: "2026-08-14T00:00:00.000Z",
};

function fillForm() {
  fireEvent.click(screen.getByText("mock-select-vehicle"));

  fireEvent.change(screen.getByLabelText(/Número de factura/i), {
    target: { value: TEST_DATA.invoiceNumber },
  });

  fireEvent.change(screen.getByLabelText(/^Subtotal/i), {
    target: { value: TEST_DATA.subtotal },
  });
  fireEvent.change(screen.getByLabelText(/Impuestos \(IVA\)/i), {
    target: { value: TEST_DATA.taxAmount },
  });
  fireEvent.change(screen.getByLabelText(/^Total/i), {
    target: { value: TEST_DATA.totalAmount },
  });

  fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
    target: { value: TEST_DATA.customer.fullName },
  });
  fireEvent.change(screen.getByLabelText(/CUIL \/ DNI/i), {
    target: { value: TEST_DATA.customer.document },
  });
  fireEvent.change(screen.getByLabelText(/Domicilio/i), {
    target: { value: TEST_DATA.customer.address },
  });
  fireEvent.change(screen.getByLabelText(/Celular/i), {
    target: { value: TEST_DATA.customer.phone },
  });
  fireEvent.change(screen.getByLabelText(/E-mail/i), {
    target: { value: TEST_DATA.customer.email },
  });

  fireEvent.change(screen.getByLabelText(/Fecha de pago/i), {
    target: { value: TEST_DATA.paidAtInput },
  });
}

describe("InvoiceRegistrationForm - handleSaveInvoice", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("llama a create() con los datos cargados en el formulario y loguea éxito", async () => {
    const createMock = jest.fn().mockResolvedValue({ id: "invoice-1" });
    mockedUseCreateInvoice.mockReturnValue({
      create: createMock,
      isLoading: false,
      error: null,
    });

    render(<InvoiceRegistrationForm />);
    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Guardar registro/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));

    const submittedForm = createMock.mock.calls[0][0];

    expect(submittedForm).toMatchObject({
      invoiceNumber: TEST_DATA.invoiceNumber,
      subtotal: TEST_DATA.subtotal,
      taxAmount: TEST_DATA.taxAmount,
      totalAmount: TEST_DATA.totalAmount,
      status: "pending",
      paymentMethod: "cash",
      administrationNotes: TEST_DATA.administrationNotes,
      customer: TEST_DATA.customer,
    });
    expect(submittedForm.car.id).toBe(TEST_DATA.carId);
    expect(new Date(submittedForm.paidAt).toISOString()).toBe(TEST_DATA.paidAtISO);

    expect(consoleLogSpy).toHaveBeenCalledWith("Factura creada exitosamente");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("loguea el error y no rompe la UI cuando create() rechaza la promesa", async () => {
    const apiError = new Error("Network error");
    const createMock = jest.fn().mockRejectedValue(apiError);
    mockedUseCreateInvoice.mockReturnValue({
      create: createMock,
      isLoading: false,
      error: null,
    });

    render(<InvoiceRegistrationForm />);
    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Guardar registro/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error al crear factura:", apiError)
    );

    expect(consoleLogSpy).not.toHaveBeenCalledWith("Factura creada exitosamente");
  });
});