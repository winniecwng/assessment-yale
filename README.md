# Project Overview

To keep the simplicity of the project, I have the api run through only the pubmed database and query a list of 3 results at a time.

## Functionality

- User is able to input a text query and submit the result
- User is able to input what page they'd like to see the result queries (pagination)
- User is able to see the title, the id and the publication year
- User is able to select the query which will go in to individual publications with its detailed information
- Publication page has all the assessment requirement details, ie id, year, title, etc

## Getting Started - Frontend Development Setup

### `cd frontend`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### create a new terminal and `cd backend`

## Getting started - Backend Development Setup

To run the backend on your local development, make sure you've downloaded Python in your own machine.

In root of the backend directory, in the following order:

- Create a virtual environment folder by running the command: `python3 -m venv venv`
  Look to see if you have ('venv' : venv) anywhere at the bottom of your vscode; if you see it, you're good to go.

- Set up your Python Interpreter

  1. Navigate to: View > Command Palette > Python Interpreter > Enter your own interpreter
  2. Type in this exact line (Again, make sure you have the latest version of Python installed) : `./backend/venv/bin/python`

- Add the following files in the backend root directory of the project:

  - .env
  - follow the instructions on `.env.example` and add your `API_KEY`
    - We will be making more than 3 api request so we'll need an API_KEY to prevent us from getting kicked out of the NCBI server
    - If you'd like to see just the functionality itself without using the API_KEY, go in to main.py and UNCOMMENT lines 44 and 76 and COMMENT out lines 45 and 77. This will only list out ONE single query as opposed to 3 queries.

- Create the virtual environment and install dependencies
  1. In the terminal, run the following command: `source venv/bin/activate`. You should see a `(venv)` before your command line now in the terminal.
  2. Run the following commands:
     - `pip install -r requirements.txt`
     - `uvicorn main:app --reload`
  3. For now we're using `http://localhost:8000/docs#/` as a way to test api routes
