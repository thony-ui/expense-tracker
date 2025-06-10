export interface User {
  id: string;
  email: string;
  name: string;
}
export interface IUserService {
  postUserToDatabase: ({ id, email, name }: User) => any;
  getUserFromDataBase: ({ id }: { id: string }) => any;
}
