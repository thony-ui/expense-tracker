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
      // Don't set Content-Type header - let browser set it with boundary
      const response = await axiosInstance.post(baseUrl, formData);
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Receipt uploaded successfully!");
      invalidateTransactions();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to process receipt";
      toast.error(message);
    },
  });
}
