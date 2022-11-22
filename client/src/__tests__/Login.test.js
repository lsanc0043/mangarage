import { render, screen } from "@testing-library/react";
import LoginOrRegister from "../components/LoginOrRegister";

test("renders the login modal page", () => {
  render(<LoginOrRegister />);
});

