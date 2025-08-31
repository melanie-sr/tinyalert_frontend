import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { UserProvider } from "../contexts/UserContext";
import i18n from "../i18n";
import Register from "../components/connexion/Register";

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <UserProvider>{ui}</UserProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Register", () => {
  it("affiche tous les champs et le bouton", async () => {
    renderWithProviders(<Register />);
    const user = userEvent.setup();

    expect(screen.getByRole("heading", { name: "S'inscrire" })).toBeInTheDocument();

    const firstNameInput = screen.getByLabelText("Prénom :");
    expect(firstNameInput).toBeInTheDocument();
    await user.type(firstNameInput, "melia");
    expect(firstNameInput).toHaveValue("melia");

    const lastNameInput = screen.getByLabelText("Nom :");
    expect(lastNameInput).toBeInTheDocument();
    await user.type(lastNameInput, "reri");
    expect(lastNameInput).toHaveValue("reri");

    const emailInput = screen.getByLabelText("Adresse e-mail :");
    expect(emailInput).toBeInTheDocument();
    await user.type(emailInput, "melia@example.com");
    expect(emailInput).toHaveValue("melia@example.com");

    const passwordInput = screen.getByLabelText("Mot de passe :");
    expect(passwordInput).toBeInTheDocument();
    await user.type(passwordInput, "Password.123");
    expect(passwordInput).toHaveValue("Password.123");

    const confirmPasswordInput = screen.getByLabelText("Confirmer le mot de passe :");
    expect(confirmPasswordInput).toBeInTheDocument();
    await user.type(confirmPasswordInput, "Password.123");
    expect(confirmPasswordInput).toHaveValue("Password.123");

    const submitButton = screen.getByRole("button", { name: "S'inscrire" });
    expect(submitButton).toBeInTheDocument();
  });
});
