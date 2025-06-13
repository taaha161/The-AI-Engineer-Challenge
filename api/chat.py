from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-theta-ten-24.vercel.app", "http://localhost:3000", "https://frontend-j6h7d4fdl-taaha161s-projects.vercel.app"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_gpt(chat_message: ChatMessage):
    try:
        logger.info("Received chat message: %s", chat_message.message)
        
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found in environment variables")
            raise HTTPException(status_code=500, detail="API key not configured")
            
        logger.info("Initializing OpenAI client")
        client = openai.Client(api_key=api_key)
        
        # Create a kid-friendly system message
        system_message = """You are a friendly, enthusiastic AI friend for children. 
        Keep your responses short, positive, and engaging. Use simple language and 
        occasionally include emojis. Be encouraging and playful in your responses."""
        
        logger.info("Sending request to OpenAI")
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
        
        logger.info("Received response from OpenAI")
        return {"response": response.choices[0].message.content}
    
    except Exception as e:
        logger.error("Error in chat_with_gpt: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="localhost", port=8000) 