import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const PublicationPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState({});
  const [authorList, setAuthorList] = useState([]);
  const [journal, setJournal] = useState("");
  const [publicationYear, setPublicationYear] = useState();
  const [meshTerms, setMeshTerms] = useState([]);
  const [pubData, setPubData] = useState({});

  const [abstractOrder, setAbstractOrder] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPubInfo();
    }
  }, [id]);

  useEffect(() => {
    if (pubData) {
      const baseData =
        pubData?.["PubmedArticleSet"]?.["PubmedArticle"]?.["MedlineCitation"];

      const formattedAuthorList = baseData?.["Article"]?.["AuthorList"][
        "Author"
      ].map((authorInfo: any, idx: any) => {
        const firstName = authorInfo["ForeName"]["$"];
        const lastName = authorInfo["LastName"]["$"];

        return `${firstName} ${lastName}`;
      });

      const abstractResult: any = {};
      const order: any = [];

      baseData?.["Article"]?.["Abstract"]?.["AbstractText"]?.map(
        (info: any, idx: any) => {
          const key = info["@Label"];
          const value = info["$"];
          order.push(key);
          abstractResult[key] = value;
        }
      );

      setAbstractOrder(order);

      const pubTitle = baseData?.["Article"]?.["ArticleTitle"]["$"] || "";
      const pubAuthorList = formattedAuthorList || [];
      const pubJournal =
        baseData?.["Article"]?.["Journal"]?.["Title"]?.["$"] || "";
      const pubYear =
        baseData?.["Article"]?.["Journal"]?.["JournalIssue"]?.["PubDate"]?.[
          "Year"
        ]?.["$"] || null;

      const pubAbstract = abstractResult || {};

      const pubMesh =
        baseData?.["MeshHeadingList"]?.["MeshHeading"].map(
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
    }
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
      setPubData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {title && <div>Title: {title}</div>}
      {abstractOrder.length !== 0 && (
        <>
          <div>Abstract:</div>
          <div className="flex flex-col gap-4">
            {abstractOrder.map((abstractTitle: any, idx: any) => {
              return (
                <div>
                  <span className="font-extrabold">
                    {`${
                      abstractTitle[0] + abstractTitle.slice(1).toLowerCase()
                    }: `}
                  </span>
                  {/* {abstract[abstractTitle]} */}
                </div>
              );
            })}
          </div>
        </>
      )}
      {id && <div>PMID: {id}</div>}
      <div>
        {authorList.length !== 0 && (
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
      {journal && <div>Journal: {journal}</div>}
      {publicationYear && <div>Publication: {publicationYear}</div>}

      {meshTerms.length !== 0 && (
        <ul>
          MeSH Terms:{" "}
          {meshTerms.map((meshInfo, idx) => {
            return <li>{meshInfo}</li>;
          })}
        </ul>
      )}

      <Link href={`https://pubmed.ncbi.nlm.nih.gov/${id}/`}>
        Link to publication
      </Link>
    </div>
  );
};

export default PublicationPage;
