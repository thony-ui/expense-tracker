import { NextFunction, Request, Response } from "express";
import { ChatController } from "../domain/chat.controller";
import { ChatService } from "../domain/chat.service";

jest.mock("../../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("ChatController", () => {
  let chatController: ChatController;
  let chatService: ChatService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    chatService = new ChatService();
    chatController = new ChatController(chatService);
    mockRequest = {
      body: { prompt: "Test prompt" },
    };
    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should call next with an error if getResponseFromLLM fails", async () => {
    const error = new Error("Test error");
    jest.spyOn(chatService, "getResponseFromLLM").mockRejectedValue(error);

    await chatController.getResponseFromLLM(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(error);
  });
});
