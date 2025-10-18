import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/chat";

export function usePostGenerateExpenseReport(
  setIsGenerating: (value: boolean) => void,
  startDate: string,
  endDate: string
) {
  return useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await axiosInstance.post(
        `${baseUrl}/generate-report`,
        {
          startDate,
          endDate,
        },
        {
          responseType: "blob",
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to generate expense report");
      }

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense-report.pdf");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsGenerating(false);
    },
  });
}
