import { render, screen } from "@testing-library/react";
import Header from "../components/Header.js";

test("renders the landing page", () => {
  render(<Header />);

  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
});

test("renders the logo", () => {
  render(<Header />);

  expect(screen.getByAltText("Site-Title")).toBeInTheDocument();
});
