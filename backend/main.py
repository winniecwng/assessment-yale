from fastapi import FastAPI, status, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, Optional
import requests

app = FastAPI()

baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

@app.post("/search")
async def fetch_publication_uids(db:str, term: str):

    

    fullUrl = f"{baseUrl}/esearch.fcgi?db={db}&term={term}&retmode=JSON"

    try:
        response = requests.get(fullUrl)
        response.raise_for_status()  
        return response.json()  
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to NCBI API: {str(e)}")
