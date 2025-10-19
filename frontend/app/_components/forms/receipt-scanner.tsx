"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ReceiptData {
  amount: string;
  merchant: string;
  date: string;
  category: string;
  items?: string[];
}

interface ReceiptScannerProps {
  onScanComplete: (data: ReceiptData) => void;
  onClose: () => void;
}

export function ReceiptScanner({
  onScanComplete,
  onClose,
}: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;

    setIsScanning(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("receipt", blob, "receipt.jpg");

      // Call your backend OCR endpoint
      const result = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error("Failed to scan receipt");
      }

      const data: ReceiptData = await result.json();
      onScanComplete(data);
    } catch (err) {
      setError("Failed to scan receipt. Please try again or enter manually.");
      console.error("Receipt scanning error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scan Receipt</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!image ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload a photo of your receipt
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border">
              <Image
                src={image}
                alt="Receipt"
                fill
                className="object-contain"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setImage(null);
                  setError(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Retake
              </Button>
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan Receipt"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
