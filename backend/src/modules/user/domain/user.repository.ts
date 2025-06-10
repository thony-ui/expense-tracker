import supabase from "../../../lib/supabase-client";
import { IUserService, User } from "./user.interface";

export class UserRepository implements IUserService {
  postUserToDatabase = async ({ id, email, name }: User) => {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id,
        email,
        name,
      })
      .select();

    if (error) {
      throw new Error(`Error inserting user: ${error.message}`);
    }
    return data;
  };
  getUserFromDataBase = async ({ id }: { id: string }) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
    return data;
  };
}
