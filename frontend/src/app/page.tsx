"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [termValue, setTermValue] = useState<string>("");
  const [uidList, setUIDList] = useState([]);

  const searchPublication = async () => {
    const formatTermValue: string = termValue.split(" ").join("+");
    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ term: formatTermValue }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data: ", data);
      const uids = data["esearchresult"]["idlist"];
      setUIDList(uids);
      // setResponseData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="min-h-screen m-8">
      <header className="font-extrabold text-3xl">Search Publications</header>

      <div className="my-8">
        <label htmlFor="termInput">Input terms:</label>

        <input
          className="border-2 border-zinc-400 my-4 w-96 flex pl-2"
          id="termInput"
          type="text"
          value={termValue}
          onChange={(e) => setTermValue(e.target.value)}
        />

        <button
          type="button"
          disabled={termValue === ""}
          className="border-2 py-1 px-2 cursor-pointer border-zinc-400"
          onClick={searchPublication}
        >
          Search
        </button>
      </div>
      <ul>
        {uidList.map((uid, idx) => {
          return <li key={uid}>{uid}</li>;
        })}
      </ul>
    </main>
  );
}
