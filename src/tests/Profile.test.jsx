import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { UserProvider } from "../contexts/UserContext";
import i18n from "../i18n";
import Profile from "../components/Profile";

const renderWithProviders = (ui, { user } = {}) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <UserProvider>
          {ui}
        </UserProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Profile", () => {
  it("affiche tous les champs et le bouton", async () => {
    const user = userEvent.setup();

    const mockUser = {
      firstName: "melia",
      lastName: "reri",
      email: "melia@example.com"
    };

    renderWithProviders(<Profile />);

    expect(screen.getByRole("heading", { name: "Mon profil" })).toBeInTheDocument();

    const firstNameInput = screen.getByLabelText("Prénom");
    expect(firstNameInput).toBeInTheDocument();
    await user.type(firstNameInput, "melia");
    expect(firstNameInput).toHaveValue("melia");

    const lastNameInput = screen.getByLabelText("Nom");
    expect(lastNameInput).toBeInTheDocument();
    await user.type(lastNameInput, "reri");
    expect(lastNameInput).toHaveValue("reri");

    const passwordInput = screen.getByLabelText("Nouveau mot de passe");
    expect(passwordInput).toBeInTheDocument();
    await user.type(passwordInput, "Password.12");
    expect(passwordInput).toHaveValue("Password.12");

    const confirmPasswordInput = screen.getByLabelText("Confirmer le mot de passe");
    expect(confirmPasswordInput).toBeInTheDocument();
    await user.type(confirmPasswordInput, "Password.12");
    expect(confirmPasswordInput).toHaveValue("Password.12");

    const submitButton = screen.getByRole("button", { name: "Enregistrer les modifications" });
    expect(submitButton).toBeInTheDocument();
  });
});
