import {
  Box,
  Button,
  Heading,
  Input,
  List,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { deleteRecord, getRecords, insertRecord } from "../utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { Todo } from "@/types/api/todo";
import { Modal } from "./components/molecules/Modal";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "./components/atoms/PrimaryButton";

type Inputs = {
  title: string;
  time: number;
};

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);

  const totalTime =
    todos.length > 0
      ? todos
          .map((todo) => todo.time)
          .reduce((a, b) => {
            return (a ?? 0) + (b ?? 0);
          })
      : 0;

  const fetchTodos = useCallback(async () => {
    const data = await getRecords();
    const todoArray = data.map((v) => new Todo(v));
    setTodos(todoArray);
    setIsLoading(false);
  }, []);

  const onClickAdd = useCallback(async (data: Inputs) => {
    const { title, time } = data;
    await insertRecord(title, time);
    setIsOpen(false);
    setIsLoading(true);
  }, []);

  const onClickDelete = useCallback(async (id: string) => {
    await deleteRecord(id);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <Box w="460px" spaceY={8} p={8}>
      <Heading as="h1">学習記録アプリ</Heading>

      <Modal
        title="学習記録を登録"
        label="登録"
        isOpenControllable={true}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <form
          onSubmit={handleSubmit((data) => {
            onClickAdd(data);
          })}
        >
          <Stack spaceY={4}>
            <Input
              {...register("title", {
                required: "学習内容が入力されていません",
              })}
              placeholder="学習内容"
            />
            <Text color="red">{errors.title?.message}</Text>
            <Input
              {...register("time", {
                required: "時間が入力されていません",
                min: { value: 0, message: "0以上の値を入力してください" },
              })}
              placeholder="学習時間"
              type="number"
            />
            <Text color="red">{errors.time?.message}</Text>

            <PrimaryButton type="submit" label="登録" loading={isLoading} />
          </Stack>
        </form>
      </Modal>

      <Box p="4" bg="gray.200" borderWidth="2px" borderRadius="8px" shadow="lg">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <List.Root as="ul" listStylePosition="inside">
              {todos.length > 0 &&
                todos.map((todo) => (
                  <List.Item key={todo.id}>
                    {`${todo.title} : ${todo.time}時間`}
                    <Button
                      bg="gray.400"
                      _hover={{ opacity: 0.8 }}
                      m={2}
                      h="25px"
                      onClick={() => {
                        onClickDelete(todo.id!);
                      }}
                    >
                      削除
                    </Button>
                  </List.Item>
                ))}
            </List.Root>
          </>
        )}
        <p style={{ padding: "4px" }}>{`合計  ${totalTime}/1000 時間`}</p>
      </Box>
    </Box>
  );
};

export default App;
