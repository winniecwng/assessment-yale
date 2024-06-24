import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const PublicationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pubLink, setPubLink] = useState("");
  const [pubData, setPubData] = useState({});

  useEffect(() => {
    if (id) {
      fetchPubInfo();
    }
  }, [id]);

  useEffect(() => {
    console.log("pubData: ", pubData);
  }, [pubData]);

  const fetchPubInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pub_id: id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data: ", data);

      const baseData =
        data["PubmedArticleSet"]["PubmedArticle"]["MedlineCitation"];

      const formattedAuthorList = baseData["Article"]["AuthorList"][
        "Author"
      ].map((authorInfo: any, idx: any) => {
        const firstName = authorInfo["ForeName"]["$"];
        const lastName = authorInfo["LastName"]["$"];

        return `${firstName} ${lastName}`;
      });

      const pubTitle = baseData["Article"]["ArticleTitle"];
      const pubAuthorList = formattedAuthorList;
      const pubJournal = baseData["Article"]["Journal"]["Title"]["$"];
      const pubYear =
        baseData["Article"]["Journal"]["JournalIssue"]["PubDate"]["Year"]["$"];

      const pubAbstract = baseData["Article"]["Abstract"]["AbstractText"]["$"];

      const publicationData = {
        pmid: id,
        title: pubTitle ? pubTitle : "",
        abstract: pubAbstract ? pubAbstract : "",
        author_list: pubAuthorList ? pubAuthorList : "",
        journal: pubJournal ? pubJournal : "",
        publication_year: pubYear ? pubYear : "",
        meSH_terms: "",
      };
      setPubData(publicationData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>{id}</div>
      <Link href={pubLink}>Link to publication</Link>
    </>
  );
};

export default PublicationPage;
