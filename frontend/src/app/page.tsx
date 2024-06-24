"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [termValue, setTermValue] = useState<string>("");
  const [uidList, setUIDList] = useState([]);
  const [page, setPage] = useState("1");

  useEffect(() => {
    console.log("page: ", page);
  }, [page]);

  const handleChange = (event: any) => {
    const inputRegex = /^[0-9\b]+$/;
    if (event.target.value === "" || inputRegex.test(event.target.value)) {
      setPage(event.target.value);
    }
  };

  const searchPublication = async () => {
    setUIDList([]);
    const formatTermValue: string = termValue.split(" ").join("+");
    try {
      const response = await fetch("http://localhost:8000/search-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term: formatTermValue,
          start: page,
          end: parseInt(page) + 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data: ", data);
      const uids = data["esearchresult"]["idlist"];
      setUIDList(uids);
      // setResponseData(data);
      setTermValue("");
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
      <ul className="my-4">
        {uidList.map((uid, idx) => {
          return (
            <li key={uid}>
              <Link href={`/publication/${uid}`} as={`/publication/${uid}`}>
                {uid}
              </Link>
            </li>
          );
        })}
      </ul>
      {uidList.length > 0 && (
        <div className="flex gap-4">
          <div className="flex items-center">Page: </div>
          <input
            // type="number"
            className="w-10 h-10 border border-zinc-400 px-3"
            value={page}
            onChange={handleChange}
          />
        </div>
      )}
    </main>
  );
}
