// @vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { Provider } from "@/components/ui/provider";

test("title is HelloWorld", async () => {
  render(
    <Provider>
      <App />
    </Provider>,
  );
  const target = await screen.findByRole("heading", { level: 1 });
  expect(target).toHaveTextContent("学習記録アプリ");
});
