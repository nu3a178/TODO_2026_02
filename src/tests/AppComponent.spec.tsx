// @vitest-environment jsdom
/// <reference types="@testing-library/jest-dom" />
import { expect, test, vi, beforeEach, describe, afterEach } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import App from "../App";
import { Provider } from "../components/ui/provider";
import { insertRecord, deleteRecord, editRecord } from "../../utils/supabase";

vi.mock("../../utils/supabase", async () => {
  return {
    getRecords: vi.fn().mockReturnValue([
      { id: "test-1", title: "test1", time: 1 },
      { id: "test-2", title: "test2", time: 2 },
    ]),
    insertRecord: vi.fn(),
    deleteRecord: vi.fn(),
    editRecord: vi.fn(),
  };
});

beforeEach(() => {
  render(
    <Provider>
      <App />
    </Provider>,
  );
});

afterEach(() => {
  cleanup();
});

test("タイトルがあること", async () => {
  const target = await screen.findByRole("heading", { level: 1 });
  expect(target).toHaveTextContent("学習記録アプリ");
});

test("初期表示でGetRecordsが呼ばれていることの確認", async () => {
  const record = await screen.findAllByRole("listitem");
  expect(record).toHaveLength(2);
});

test("ローディングが表示されていることの確認", async () => {
  const target = await screen.getByTestId("loading");
  expect(target).toBeTruthy();
});

test("新規登録ボタンがあること", async () => {
  const target = await screen.getAllByRole("button")[0].textContent;
  expect(target).toContain("新規登録");
});

test("登録ができること", async () => {
  const openButton = await screen.getAllByRole("button")[0];
  openButton.click();
  const titleInput = await screen.findByTestId("title");
  const timeInput = await screen.findByTestId("time");

  const registerButton = await screen.findByTestId("registerButton");
  await act(async () => {
    fireEvent.change(titleInput, { target: { value: "test3" } });
    fireEvent.change(timeInput, { target: { value: "3" } });
    registerButton.click();
  });

  expect(insertRecord).toHaveBeenCalledWith("test3", "3");
});

test("モーダルのタイトルが「学習記録を登録」であること", async () => {
  const openButton = await screen.getAllByRole("button")[0];
  openButton.click();
  const dialogTitle = await screen.findByRole("heading", {
    name: "学習記録を登録",
  });
  expect(dialogTitle).toBeInTheDocument();
});

test("学習内容がないときに登録するとエラーになること", async () => {
  const openButton = await screen.getAllByRole("button")[0];
  openButton.click();
  const timeInput = await screen.findByTestId("time");

  const registerButton = await screen.findByTestId("registerButton");
  await act(async () => {
    fireEvent.change(timeInput, { target: { value: "3" } });
    registerButton.click();
  });
  const target = await screen.findByText("学習内容が入力されていません");
  expect(target).toBeInTheDocument();
});
describe("学習時間がないときに登録するとエラーになること", () => {
  test("学習時間がないときに登録するとエラーになること", async () => {
    const openButton = await screen.getAllByRole("button")[0];
    openButton.click();
    const titleInput = await screen.findByTestId("title");

    const registerButton = await screen.findByTestId("registerButton");
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "test" } });
      registerButton.click();
    });
    const target = await screen.findByText("学習時間が入力されていません");
    expect(target).toBeInTheDocument();
  });
  test("学習時間が0未満のときに登録するとエラーになること", async () => {
    const openButton = await screen.getAllByRole("button")[0];
    openButton.click();
    const titleInput = await screen.findByTestId("title");
    const timeInput = await screen.findByTestId("time");
    const registerButton = await screen.findByTestId("registerButton");
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "test" } });
      fireEvent.change(timeInput, { target: { value: "-1" } });
      registerButton.click();
    });
    const target = await screen.findByText("0以上の値を入力してください");
    expect(target).toBeInTheDocument();
  });
});
test("削除ができること", async () => {
  const deleteButtons = await screen.findAllByRole("button", { name: "削除" });
  await act(() => {
    deleteButtons[0].click();
  });
  expect(deleteRecord).toHaveBeenCalledWith("test-1");
});

test("編集モーダルが表示されること", async () => {
  const editButtons = await screen
    .findAllByRole("button", { name: "編集" })
    .then((res) => res[0]);
  expect(editButtons).toBeInTheDocument();
  await act(() => {
    editButtons.click();
  });

  const modalTitles = await screen.findAllByText("学習記録を編集");
  expect(modalTitles[0]).toBeInTheDocument();
});

test("編集が可能なこと", async () => {
  const editButtons = await screen
    .findAllByRole("button", { name: "編集" })
    .then((res) => res[0]);
  expect(editButtons).toBeInTheDocument();
  await act(() => {
    editButtons.click();
  });
  const editTitleInput = await screen.findByTestId("editTitle");
  const editTimeInput = await screen.findByTestId("editTime");

  expect(editTitleInput).toHaveValue("test1");
  expect(editTimeInput).toHaveValue(1);

  const editButton = await screen.findByRole("button", { name: "編集を確定" });
  await act(() => {
    fireEvent.change(editTitleInput, { target: { value: "test11" } });
    fireEvent.change(editTimeInput, { target: { value: 11 } });
    editButton.click();
  });
  expect(editRecord).toHaveBeenCalledWith("test-1", "test11", "11");
});
