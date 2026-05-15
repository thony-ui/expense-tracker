import { Client } from "@gradio/client";

export async function createGradioClient() {
  const client = await Client.connect("anthonyhermanto1/predict-expenses");

  return client;
}
