import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const baseUrl = `/v1/users`;

export interface IUser {
  id: string;
  email: string;
  // Add other user properties
  name: string;
}
export const useGetUser = () => {
  const query = useQuery({
    queryKey: ["/v1/users"],
    queryFn: async () => {
      const response = await axiosInstance.get<IUser>(baseUrl);
      return response.data;
    },
  });
  return query;
};
