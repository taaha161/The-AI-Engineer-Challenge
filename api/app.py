# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI application with a title
app = FastAPI(title="Kids Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
        allow_origins=["https://frontend-theta-ten-24.vercel.app", "http://localhost:3000", "https://frontend-j6h7d4fdl-taaha161s-projects.vercel.app"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatMessage(BaseModel):
    message: str

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(chat_message: ChatMessage):
    try:
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")

        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
        
        # Create a kid-friendly system message
        system_message = """You are a friendly, enthusiastic AI friend for children. 
        Keep your responses short, positive, and engaging. Use simple language and 
        occasionally include emojis. Be encouraging and playful in your responses."""
        
        # Get response from ChatGPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": chat_message.message}
            ],
            max_tokens=100,  # Keep responses short and sweet
            temperature=0.7  # Add some creativity to responses
        )
        
        return {"response": response.choices[0].message.content}
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
