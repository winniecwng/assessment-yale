"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [termValue, setTermValue] = useState<string>("");
  const [currentTerm, setCurrentTerm] = useState<string>("");
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

  const onEnterEvent = (e: any) => {
    if (e.keyCode === 13) {
      searchPublication();
    }
  };

  const searchPublication = async () => {
    setUIDList([]);
    if (currentTerm !== termValue) {
      setCurrentTerm(termValue);
      setPage("1");
    }
    const formatTermValue: string = termValue.split(" ").join("+");
    try {
      const response = await fetch("http://localhost:8000/search-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term: formatTermValue,
          start: 5 * parseInt(page) - 4,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUIDList(data);
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
          onKeyDown={onEnterEvent}
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
      <ul className="mt-4 mb-8 flex flex-col gap-8">
        {uidList.map((uid, idx) => {
          const { pmid, pub_title, pub_year } = uid;
          return (
            <li key={pmid}>
              <Link
                href={`/publication/${pmid}`}
                as={`/publication/${pmid}`}
                className="text-blue-700 underline"
              >
                {pub_title}
              </Link>
              <div>PMID: {pmid}</div>
              <div>Publication Year: {pub_year}</div>
            </li>
          );
        })}
      </ul>
      {uidList.length > 0 && (
        <div className="flex gap-4">
          <div className="flex items-center">Page: </div>
          <input
            className="w-10 h-10 border border-zinc-400 px-3"
            value={page}
            onChange={handleChange}
            onKeyDown={onEnterEvent}
          />
        </div>
      )}
    </main>
  );
}
