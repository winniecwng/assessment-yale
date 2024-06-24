from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel
import xml.etree.ElementTree as ET

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

@app.post("/search-ids")  
def search_publication_uids(request_data: TermRequest):
    term = request_data.term
    # start = str(request_data.start)
    # end = str(request_data.end)
    firstUrl = f"{baseUrl}/esearch.fcgi?db=pubmed&term={term}&retmode=JSON"
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()  
        uidList = response.json()["esearchresult"]["idlist"]
        print(uidList)
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")
    
# @app.post("/fetch-info")
# def fetch_publication_info():

#     firstUrl = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=19393038,30242208,29453458"
#     try:
#         response = requests.get(firstUrl)
#         response.raise_for_status()  
#         # return response.json()
        
#     except requests.exceptions.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")

@app.post("/fetch-info")
def fetch_publication_info():
    # URL to fetch PubMed information for given IDs in XML format
    firstUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=19393038,30242208,29453458&retmode=xml"
    
    try:
        response = requests.get(firstUrl)
        response.raise_for_status()  # Raise error for bad response status
        
        # Parse XML response
        root = ET.fromstring(response.content)
        
        # Convert XML to JSON format (using a simple conversion approach)
        data = xml_to_json(root)
        
        return data  # Return JSON data
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")

def xml_to_json(xml):
    """
    Convert an XML ElementTree object to JSON format.
    """
    if isinstance(xml, ET.Element):
        return {
            xml.tag: xml_to_json(xml.text) if xml.text else {child.tag: xml_to_json(child) for child in xml}
        }
    else:
        return xml