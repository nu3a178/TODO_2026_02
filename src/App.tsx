import {
  Box,
  Button,
  Heading,
  Input,
  List,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { getRecords } from "../utils/supabase";
import { useEffect, useState } from "react";
import { Todo } from "@/types/api/todo";

const App = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const totalTime =
    todos.length > 0
      ? todos
          .map((todo) => todo.time)
          .reduce((a, b) => {
            return (a ?? 0) + (b ?? 0);
          })
      : 0;
  useEffect(() => {
    const getTodos = async () => {
      const data = await getRecords();
      console.log(data);
      const todoArray = data.map((v) => new Todo(v));
      setTodos(todoArray);
      setIsLoading(false);
    };
    getTodos();
  }, []);
  return (
    <Box w="460px" spaceY={8} p={8}>
      <Heading as="h1">学習記録アプリ</Heading>
      <Stack>
        <Input placeholder="学習内容" />
        <Input placeholder="学習時間" />
        <Button colorPalette="teal" alignSelf="end" w="33%">
          登録する
        </Button>
      </Stack>
      <Box p={4}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <List.Root as="ul" listStylePosition="inside">
              {todos.length > 0 &&
                todos.map((todo) => (
                  <List.Item
                    key={todo.id}
                  >{`${todo.title} : ${todo.time}時間`}</List.Item>
                ))}
            </List.Root>
          </>
        )}
        <p>{`${totalTime}/1000 時間`}</p>
      </Box>
    </Box>
  );
};

export default App;
