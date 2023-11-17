"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is ChatterBot! How can I help you today?",
    },
  ]);

  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const callGetResponse = async () => {
    setIsLoading(true);
    let temp = messages;
    temp.push({ role: "user", content: theInput });
    setTheInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);

    // scrollToRef.current.scrollIntoView()
  };
  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };
  return (
<main className="flex min-h-screen flex-col items-center justify-between px-8 py-5 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      <h1 className="text-5xl font-semibold mb-8">ChatterBot</h1>

      <div className="flex h-[35rem] w-[40rem] flex-col items-center bg-gray-800 rounded-xl shadow-lg">
        <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-4 w-full">
          {messages.map((e, index) => (
            <div
              key={index}
              className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                e.role === 'assistant'
                  ? 'self-start bg-gray-200 text-gray-800'
                  : 'self-end bg-gray-600 text-gray-50'
              }`}
            >
              {e.content}
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min animate-pulse">
              thinking
            </div>
          )}
        </div>
        <div className="relative w-full flex justify-center">
          <textarea
            value={theInput}
            onChange={(event) => setTheInput(event.target.value)}
            className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none focus:ring focus:border-blue-300"
            onKeyDown={handleSubmit}
          />
          <button
            onClick={callGetResponse}
            className="w-[15%] bg-blue-500 px-4 py-2 rounded-r transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};
