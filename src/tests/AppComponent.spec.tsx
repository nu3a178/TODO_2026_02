// @vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("title is HelloWorld", async () => {
  render(<App />);
  const target = screen.getByRole("heading", { level: 1 });
  expect(target).toHaveTextContent("Hello World");
});
