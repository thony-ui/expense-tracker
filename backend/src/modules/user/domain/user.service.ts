import supabase from "../../../lib/supabase-client";
import { IUserService, User } from "./user.interface";
import { UserRepository } from "./user.repository";

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}
  postUserToDatabase = async ({ id, email, name }: User) => {
    const data = await this.userRepository.postUserToDatabase({
      id,
      email,
      name,
    });

    return data;
  };

  getUserFromDataBase = async ({ id }: { id: string }) => {
    const data = await this.userRepository.getUserFromDataBase({ id });
    // get the only user from the data array
    return data[0];
  };
}
