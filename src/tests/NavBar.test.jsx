import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import NavBar from "../components/layout/NavBar.jsx";
import App from "../App.jsx";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext.jsx";

const renderWithProviders = (ui, { initialEntries = ["/"] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nextProvider i18n={i18n}>
        <UserProvider>{ui}</UserProvider>
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Navbar", () => {
  it("affiche les liens de navigation", () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Catastrophes")).toBeInTheDocument();
    expect(screen.getByText("Classement")).toBeInTheDocument();
  });

  it("navigue correctement entre les pages", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<h1>Accueil</h1>} />
          <Route path="/disasters" element={<h1>Catastrophes</h1>} />
          <Route path="/ranking" element={<h1>Classement</h1>} />
        </Routes>
      </>
    );

    expect(screen.getByRole("heading", { name: "Accueil" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Catastrophes" }));
    expect(screen.getByRole("heading", { name: "Catastrophes" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Classement" }));
    expect(screen.getByRole("heading", { name: "Classement" })).toBeInTheDocument();
  });
});
