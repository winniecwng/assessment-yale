from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel
from xmljson import badgerfish as bf
from xml.etree.ElementTree import fromstring
import json

app = FastAPI()

baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3000/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TermRequest(BaseModel):
    term: str
    start: int

class PubInfoRequest(BaseModel):
    pub_id:int

@app.post("/search-ids")  
def search_publication_uids(request_data: TermRequest):
    term = request_data.term
    start = str(request_data.start)
    firstUrl = f"{baseUrl}/esearch.fcgi?db=pubmed&term={term}&retstart={start}&retmax=5&retmode=JSON"
    
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()  
        uidList = response.json()["esearchresult"]["idlist"]
        # print(uidList)
        uidsInfo = []
        for uid in uidList:
            uidInfo = fetch_publication_info(uid)
            uidJSON = json.dumps(uidInfo)
            parsedJSON = json.loads(uidJSON)
            baseData = parsedJSON["PubmedArticleSet"]["PubmedArticle"]["MedlineCitation"]
            pub_title = baseData["Article"]["ArticleTitle"]["$"]
            pub_year = baseData["Article"]["Journal"]["JournalIssue"]["PubDate"]["Year"]["$"]

            print(pub_title)
            print(pub_year)
            uidsInfo.append({
                "pub_title": pub_title,
                "pub_year": pub_year,
                "pmid": uid
            })
        return uidsInfo
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")
    

@app.get("/fetch-info/{pub_id}")
def fetch_publication_info(pub_id: str):
    firstUrl = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pub_id}&retmode=xml"
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()
        
        # Parse XML response
        xml_data = fromstring(response.content)
        
        # Convert XML to JSON format using xmljson
        json_data = bf.data(xml_data)
        
        return json_data  # Return JSON data
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")