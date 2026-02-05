import { Todo } from "@/types/api/todo";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const getRecords = async (): Promise<Array<Todo>> => {
  const { data, error } = await supabase
    .from("study-records")
    .select("id,title,time");
  if (!data || error) return [];
  const result: Array<Todo> = data.map(({ id, title, time }) => ({
    id,
    title,
    time,
  }));
  console.log(result);
  return result;
};

export const insertRecord = async (title: string, time: number) => {
  const result = await supabase.from("study-records").insert({
    title: title,
    time: time,
  });

  return result;
};
export const deleteRecord = async (id: string) => {
  const result = await supabase
    .from("study-records")
    .delete()
    .eq("id", id)
    .then((res) => {
      console.log(res);
      return res;
    });
  return result;
};
