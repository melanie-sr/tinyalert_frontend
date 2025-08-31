import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import i18n from "../i18n";
import { describe, test, it } from "vitest";
import { UserProvider } from "../contexts/UserContext";
import { I18nextProvider } from "react-i18next";



describe("LanguageSelector", () => {
  it("change la langue et met à jour les drapeaux + texte", async () => {
    const user = userEvent.setup();

    await i18n.changeLanguage("fr");

    render(
     <I18nextProvider i18n={i18n}>
    <UserProvider>
      <App />
    </UserProvider>
  </I18nextProvider>
    );

    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catastrophes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Classement" })).toBeInTheDocument();

    const flag = screen.getByRole("img", { name: "fr" });
    expect(flag).toHaveAttribute("src", expect.stringContaining("flag_fr.png"));

    await user.click(screen.getByTestId("language-selector"));

    const englishBtn = screen.getByRole("button", { name: /english/i });
    await user.click(englishBtn);

    expect(await screen.findByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Disasters" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ranking" })).toBeInTheDocument();

    const enFlag = screen.getByRole("img", { name: "en" });
    expect(enFlag).toHaveAttribute("src", expect.stringContaining("flag_en.png"));
  });
});
