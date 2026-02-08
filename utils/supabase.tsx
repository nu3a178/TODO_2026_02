import { Todo } from "@/types/api/todo";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const getRecords = async (): Promise<Array<Todo>> => {
  const { data, error } = await supabase
    .from("study-records")
    .select("id,title,time")
    .order("id", { ascending: true });
  if (!data || error) return [];
  const result: Array<Todo> = data.map(({ id, title, time }) => ({
    id,
    title,
    time,
  }));
  return result;
};

export const insertRecord = async (title: string, time: string) => {
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

export const editRecord = async (id: string, title: string, time: string) => {
  const result = await supabase
    .from("study-records")
    .update({ title: title, time: time })
    .eq("id", id)
    .then((res) => {
      return res;
    });
  return result;
};
