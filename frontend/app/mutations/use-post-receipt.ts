import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { invalidateTransactions } from "../queries/use-get-transactions";
import { createClient } from "@/lib/supabase/supabase-client";

const baseUrl = "/v1/ocr";

interface IPostReceipt {
  file: File;
}

export function usePostReceipt() {
  return useMutation({
    mutationFn: async (receipt: IPostReceipt) => {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const userId = session.user.id;

      let fileExtension = "jpg";

      if (receipt.file.type === "image/png") {
        fileExtension = "png";
      } else if (receipt.file.type === "image/webp") {
        fileExtension = "webp";
      } else if (receipt.file.type === "image/heic") {
        fileExtension = "heic";
      } else if (receipt.file.type === "image/heif") {
        fileExtension = "heif";
      } else if (receipt.file.type === "image/jpeg") {
        fileExtension = "jpg";
      }

      /*
       * IMPORTANT:
       * Every receipt gets its own object.
       *
       * Example:
       * user123/4f0c9f90-....heic
       */
      const fileName = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, receipt.file, {
          contentType: receipt.file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const response = await axiosInstance.post(baseUrl, {
        imagePath: uploadData.path,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Receipt uploaded successfully!");

      invalidateTransactions();
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to process receipt";

      toast.error(message);
    },
  });
}
