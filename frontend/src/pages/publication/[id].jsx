import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const PublicationPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState({});
  const [abstractTextOnly, setAbstractTextOnly] = useState("");
  const [authorList, setAuthorList] = useState([]);
  const [journal, setJournal] = useState("");
  const [publicationYear, setPublicationYear] = useState();
  const [meshTerms, setMeshTerms] = useState([]);
  const [pubData, setPubData] = useState(null);

  const [abstractOrder, setAbstractOrder] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPubInfo();
    }
  }, [id]);

  useEffect(() => {
    if (pubData) {
      const baseData =
        pubData["PubmedArticleSet"]["PubmedArticle"]["MedlineCitation"];

      const rawAuthorList = baseData["Article"]["AuthorList"]["Author"];

      const formattedAuthorList =
        rawAuthorList.map((authorInfo, idx) => {
          const firstName = authorInfo["ForeName"]["$"];
          const lastName = authorInfo["LastName"]["$"];

          return `${firstName} ${lastName}`;
        }) || [];

      const isAbstract =
        baseData["Article"]["Abstract"]["AbstractText"]["$"] ||
        baseData["Article"]["Abstract"]["AbstractText"] ||
        null;

      if (typeof isAbstract === "string") {
        setAbstractTextOnly(isAbstract);
      } else {
        const abstractResult = {};
        const order = [];

        isAbstract.map((info, idx) => {
          const key = info["@Label"];
          const value = info["$"];
          order.push(key);
          abstractResult[key] = value;
        });
        setAbstract(abstractResult);
        setAbstractOrder(order);
      }

      const pubTitle = baseData["Article"]["ArticleTitle"]["$"] || "";
      const pubJournal = baseData["Article"]["Journal"]["Title"]["$"] || "";
      const pubYear =
        baseData["Article"]["Journal"]["JournalIssue"]["PubDate"]["Year"][
          "$"
        ] || null;

      const pubMesh =
        baseData["MeshHeadingList"]["MeshHeading"].map((meshInfo, idx) => {
          const { DescriptorName } = meshInfo;

          return DescriptorName["$"];
        }) || [];

      setTitle(pubTitle);

      setAuthorList(formattedAuthorList);
      setJournal(pubJournal);
      setPublicationYear(pubYear);
      setMeshTerms(pubMesh);
    }
  }, [pubData]);

  const fetchPubInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fetch-info/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ pub_id: id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setPubData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="m-4 flex flex-col gap-4">
      {title && (
        <div>
          <span className="font-bold">Title:</span> {title}
        </div>
      )}
      {abstractTextOnly && (
        <div className="flex gap-4">
          <span className="font-bold">Abstract:</span> <p>{abstractTextOnly}</p>
        </div>
      )}
      {abstractOrder.length !== 0 && (
        <>
          <div className="font-bold">Abstract:</div>
          <div className="flex flex-col gap-4">
            {abstractOrder.map((abstractTitle, idx) => {
              return (
                <div>
                  <span className="font-extrabold">
                    {`${
                      abstractTitle[0] + abstractTitle.slice(1).toLowerCase()
                    }: `}
                  </span>
                  {abstract[abstractTitle]}
                </div>
              );
            })}
          </div>
          )
        </>
      )}
      {id && (
        <div>
          <span className="font-bold">PMID: </span>
          {id}
        </div>
      )}
      <div className="flex gap-4">
        {authorList.length !== 0 && (
          <>
            <div className="font-bold">Author List:</div>
            <ul>
              {authorList.map((author, idx) => {
                return <li key={idx}>{author}</li>;
              })}
            </ul>
          </>
        )}
      </div>
      {journal && (
        <div>
          {" "}
          <span className="font-bold">Journal: </span>
          {journal}
        </div>
      )}
      {publicationYear && (
        <div>
          <span className="font-bold">Publication: </span>
          {publicationYear}
        </div>
      )}

      {meshTerms.length !== 0 && (
        <ul>
          MeSH Terms:{" "}
          {meshTerms.map((meshInfo, idx) => {
            return <li>{meshInfo}</li>;
          })}
        </ul>
      )}

      <Link
        href={`https://pubmed.ncbi.nlm.nih.gov/${id}/`}
        className="text-blue-700 underline"
      >
        Link to publication
      </Link>
    </div>
  );
};

export default PublicationPage;
