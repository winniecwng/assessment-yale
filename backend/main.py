from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, Optional
# from sqlalchemy.orm import Session

app = FastAPI()