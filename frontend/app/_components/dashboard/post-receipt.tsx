import { useRef, useState, useEffect } from "react";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { usePostReceipt } from "@/app/mutations/use-post-receipt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PostReceipt = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mutation = usePostReceipt();
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    setOpen(true);

    mutation.mutate(
      { file: selectedFile },
      {
        onSettled: () => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        },
      },
    );
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      const timeout = setTimeout(() => {
        setOpen(false);
        mutation.reset();
      }, 1200);

      return () => clearTimeout(timeout);
    }

    if (mutation.isError) {
      const timeout = setTimeout(() => {
        setOpen(false);
        mutation.reset();
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [mutation]);

  return (
    <>
      <input
        ref={inputRef}
        id="receipt-upload"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={mutation.isPending}
      />

      <label htmlFor="receipt-upload" className="inline-block">
        <Button
          type="button"
          disabled={mutation.isPending}
          className="cursor-pointer"
          asChild
        >
          <span className="flex items-center gap-2">
            <Camera className="h-5 w-5 shrink-0" />
            <span className="hidden sm:inline">Upload receipt</span>
          </span>
        </Button>
      </label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Processing receipt</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            {mutation.isPending && (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <div>
                  <p className="font-medium">Uploading and parsing...</p>
                  <p className="text-muted-foreground text-sm">
                    Please wait while we read your receipt.
                  </p>
                </div>
              </>
            )}

            {mutation.isSuccess && (
              <>
                <CheckCircle2 className="h-8 w-8" />
                <div>
                  <p className="font-medium">Receipt processed</p>
                  <p className="text-muted-foreground text-sm">
                    Your receipt was uploaded successfully.
                  </p>
                </div>
              </>
            )}

            {mutation.isError && (
              <>
                <AlertCircle className="h-8 w-8" />
                <div>
                  <p className="font-medium">Processing failed</p>
                  <p className="text-muted-foreground text-sm">
                    There was a problem reading the receipt.
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostReceipt;
