from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel
from xmljson import badgerfish as bf
from xml.etree.ElementTree import fromstring
import json

app = FastAPI()

baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

origins = ["*"]

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
    end: int

class PubInfoRequest(BaseModel):
    pub_id:int

@app.post("/search-ids")  
def search_publication_uids(request_data: TermRequest):
    term = request_data.term
    start = str(request_data.start)
    end = str(request_data.end)
    firstUrl = f"{baseUrl}/esearch.fcgi?db=pubmed&term={term}&retstart={start}&retmax={end}&retmode=JSON"
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()  
        uidList = response.json()["esearchresult"]["idlist"]
        print(uidList)
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")
    

@app.post("/fetch-info")
def fetch_publication_info(request_data: PubInfoRequest):
    pub_id = str(request_data.pub_id)
    # URL to fetch PubMed information for given IDs in XML format
    
    firstUrl = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pub_id}&retmode=xml"
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()  # Raise error for bad response status
        
        # Parse XML response
        xml_data = fromstring(response.content)
        
        # Convert XML to JSON format using xmljson
        json_data = bf.data(xml_data)
        
        return json_data  # Return JSON data
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")