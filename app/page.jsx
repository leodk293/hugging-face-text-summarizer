"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function query(data) {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await query({
        inputs: input,
      });
      console.log(result);
      setOutput(result[0].summary_text);
    } catch (error) {
      console.error(error);
      setOutput(
        "An error occurred while summarizing the text. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col mx-auto w-full gap-5 mt-10 items-center max-w-5xl px-4 md:px-0">
      <h1 className="text-center text-3xl font-bold">Text Summarizer</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
        action=""
      >
        <textarea
          onChange={(event) => setInput(event.target.value)}
          value={input}
          className="h-[15rem] rounded-[5px] border border-white p-2 text-[18px] font-medium"
          name="text-to-summarize"
          placeholder="Enter your text here...."
          required
        />
        <button
          disabled={isLoading}
          className={
            "self-start px-4 py-2 border border-transparent bg-gray-200 text-black rounded-[5px] cursor-pointer text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          }
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {output && (
        <div className="w-full mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">Summary:</h2>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(output);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
                } catch (err) {
                  console.error("Failed to copy text: ", err);
                }
              }}
              className={`px-3 py-1 cursor-pointer text-sm border rounded-md transition-colors ${
                isCopied
                  ? "border-green-500 text-green-500"
                  : "border-white hover:bg-gray-700"
              }`}
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="border border-white p-4 rounded-lg">
            <p className="text-lg">{output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
