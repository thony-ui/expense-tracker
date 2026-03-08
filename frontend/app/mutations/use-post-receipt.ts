import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { invalidateTransactions } from "../queries/use-get-transactions";

const baseUrl = "/v1/ocr";

interface IPostReceipt {
  file: File;
}

export function usePostReceipt() {
  return useMutation({
    mutationFn: async (receipt: IPostReceipt) => {
      const formData = new FormData();
      formData.append("file", receipt.file);
      const response = await axiosInstance.post(baseUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Receipt uploaded successfully!");
      invalidateTransactions();
    },
  });
}
