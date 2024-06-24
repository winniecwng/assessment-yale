import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const PublicationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pubLink, setPubLink] = useState("");
  const [pubData, setPubData] = useState({
    pmid: id,
    title: "",
    abstract: "",
    author_list: [],
    journal: "",
    publication_year: "",
    meSH_terms: [],
  });

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authorList, setAuthorList] = useState([]);
  const [journal, setJournal] = useState("");
  const [publicationYear, setPublicationYear] = useState();
  const [meshTerms, setMeshTerms] = useState([]);

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

      const pubTitle = baseData["Article"]?.["ArticleTitle"]["$"] || "";
      const pubAuthorList = formattedAuthorList || [];
      const pubJournal =
        baseData["Article"]?.["Journal"]?.["Title"]?.["$"] || "";
      const pubYear =
        baseData["Article"]?.["Journal"]?.["JournalIssue"]?.["PubDate"]?.[
          "Year"
        ]?.["$"] || null;

      const pubAbstract =
        baseData["Article"]?.["Abstract"]?.["AbstractText"]?.["$"] || "";

      const pubMesh =
        baseData["MeshHeadingList"]?.["MeshHeading"].map(
          (meshInfo: any, idx: any) => {
            const { DescriptorName } = meshInfo;

            return DescriptorName["$"];
          }
        ) || [];

      setTitle(pubTitle);
      setAbstract(pubAbstract);
      setAuthorList(pubAuthorList);
      setJournal(pubJournal);
      setPublicationYear(pubYear);
      setMeshTerms(pubMesh);

      // setPubData(publicationData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div>{title && <div>Title: {title}</div>}</div>
      <div>{abstract && <div>Abstract: {abstract}</div>}</div>
      <div>{id && <div>PMID: {id}</div>}</div>
      <div>
        {authorList && (
          <>
            <div>Author List</div>
            <ul>
              {authorList.map((author, idx) => {
                return <li key={idx}>{author}</li>;
              })}
            </ul>
          </>
        )}
      </div>
      <div>{journal && <div>Journal: {journal}</div>}</div>
      <div>{publicationYear && <div>Publication: {publicationYear}</div>}</div>
      <div>
        {meshTerms && (
          <ul>
            MeSH Terms:{" "}
            {meshTerms.map((meshInfo, idx) => {
              return <li>{meshInfo}</li>;
            })}
          </ul>
        )}
      </div>

      <Link href={pubLink}>Link to publication</Link>
    </div>
  );
};

export default PublicationPage;
