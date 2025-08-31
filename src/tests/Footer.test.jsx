import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import Footer from "../components/layout/Footer";
import { MemoryRouter } from "react-router-dom";

describe("Footer", () => {
  it("affiche tous les éléments traduits correctement en français", () => {
    i18n.changeLanguage("fr");

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </MemoryRouter>
    );
    // titre
    expect(screen.getByText("Ne rater rien des actualités")).toBeInTheDocument();
    expect(screen.getByText("Les catastrophes")).toBeInTheDocument();
    expect(screen.getByText("Infos utiles")).toBeInTheDocument();

    // catastrophes
    expect(screen.getByText("Tsunami")).toBeInTheDocument();
    expect(screen.getByText("Séisme")).toBeInTheDocument();
    expect(screen.getByText("Volcan")).toBeInTheDocument();
    expect(screen.getByText("Incendie")).toBeInTheDocument();
    expect(screen.getByText("Tornade")).toBeInTheDocument();

    // infos 
    expect(screen.getByText("Qui sommes-nous ?")).toBeInTheDocument();
    expect(screen.getByText("Nous contacter")).toBeInTheDocument();

    // email 
    expect(
      screen.getByPlaceholderText("Entrez votre adresse email")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        new RegExp(`© ${new Date().getFullYear()} Tiny Alert\\. Tous droits réservés\\.`)
      )
    ).toBeInTheDocument();
  });

  it("affiche tous les éléments traduits en anglais", async () => {
    i18n.changeLanguage("en");

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </MemoryRouter>
    );

    // titre
    expect(screen.getByText("Don't miss any news")).toBeInTheDocument();
    expect(screen.getByText("Disasters")).toBeInTheDocument();
    expect(screen.getByText("Useful information")).toBeInTheDocument();

    // catastrophes
    expect(screen.getByText("Tsunami")).toBeInTheDocument();
    expect(screen.getByText("Earthquake")).toBeInTheDocument();
    expect(screen.getByText("Volcano")).toBeInTheDocument();
    expect(screen.getByText("Fire")).toBeInTheDocument();
    expect(screen.getByText("Tornado")).toBeInTheDocument();

    // infos 
    expect(screen.getByText("About us")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email address")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        new RegExp(`© ${new Date().getFullYear()} Tiny Alert\\. All rights reserved\\.`)
      )
    ).toBeInTheDocument();
  });
});
