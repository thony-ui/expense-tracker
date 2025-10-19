"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";

interface NaturalLanguageInputProps {
  onTransactionParsed: (transaction: {
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => void;
}

export function NaturalLanguageInput({
  onTransactionParsed,
}: NaturalLanguageInputProps) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const parseNaturalLanguage = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      const response = await axiosInstance.post("/v1/chat/parse-transaction", {
        text: input,
      });

      const data = response.data;
      onTransactionParsed(data);
      setInput("");
    } catch (error) {
      console.error("Error parsing transaction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Quick Add with AI</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Try: "Spent $50 on groceries yesterday" or "Paid $120 for dinner last
          Friday"
        </p>
        <form className="flex gap-2" onSubmit={parseNaturalLanguage}>
          <Input
            placeholder="Describe your transaction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 dark:border-gray-500"
          />
          <Button
            onClick={parseNaturalLanguage}
            disabled={isProcessing || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
