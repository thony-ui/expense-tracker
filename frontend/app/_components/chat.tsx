"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageCircle, Send } from "lucide-react";
import { usePostMessage } from "../mutations/use-post-message";
import MarkDownMessage from "./markdown-message";
interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { mutateAsync: postMessage, isPending } = usePostMessage();
  const fullResponseRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChunk = useCallback((chunk: string) => {
    fullResponseRef.current += chunk;
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1].content = fullResponseRef.current;
      return newMessages;
    });
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isPending) return;

    const userMessage: IMessage = { role: "user", content: currentMessage };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = currentMessage;
    setCurrentMessage("");

    // Add assistant message placeholder
    const assistantMessage: IMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);
    fullResponseRef.current = "";

    try {
      await postMessage({
        prompt: messageToSend,
        onChunk: handleChunk,
      });
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content =
          "Sorry, something went wrong.";
        return newMessages;
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle style={{ width: "20px", height: "20px" }} />
            </Button>
          </SheetTrigger>
          <SheetTitle></SheetTitle>

          <SheetContent className="w-[320px] md:w-[384px] p-0 flex flex-col">
            {/* Chat Header */}
            <div className="flex gap-1 flex-col justify-start pt-3 px-4 pb-4">
              <h3 className="font-semibold">AI Assistant</h3>
              {isPending && (
                <p className="text-sm text-muted-foreground">AI is typing...</p>
              )}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with our AI assistant!</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-[90%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <CardContent className="p-3">
                        <MarkDownMessage>{message.content}</MarkDownMessage>
                        {message.role === "assistant" &&
                          isPending &&
                          index === messages.length - 1 && (
                            <span className="animate-pulse">|</span>
                          )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <form className="p-4 border-t" onSubmit={sendMessage}>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  disabled={isPending}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isPending}
                  className="h-9 w-10"
                >
                  <Send />
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
