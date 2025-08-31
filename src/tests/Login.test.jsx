import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { UserProvider } from "../contexts/UserContext";
import i18n from "../i18n";
import Login from "../components/connexion/Login";

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <UserProvider>{ui}</UserProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Login", () => {
  it("affiche tous les champs et le bouton", async () => {
    renderWithProviders(<Login />);
    const user = userEvent.setup();

    expect(screen.getByRole("heading", { name: "Se connecter" })).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Adresse e-mail :");
    expect(emailInput).toBeInTheDocument();
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");

    const passwordInput = screen.getByLabelText("Mot de passe :");
    expect(passwordInput).toBeInTheDocument();
    await user.type(passwordInput, "Password123");
    expect(passwordInput).toHaveValue("Password123");

    const submitButton = screen.getByRole("button", { name: "Connexion" });
    expect(submitButton).toBeInTheDocument();
  });
});
