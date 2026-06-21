import os
import base64
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from typing import Optional
import json
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

import time
start_time = time.time()

app = FastAPI()

# CORS — מאפשר ל-React לדבר עם FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq()

SYSTEM_PROMPT = """אתה טכנאי מומחה של דיימקס עם 15 שנות ניסיון.
אתה עונה בעברית, ידידותי ומקצועי.
לשאלות טכניות — ענה עם 🔍 אבחון, 🔧 פתרון, ⚠️ אם לא עוזר.
לשיחה רגילה — ענה בטבעיות."""


@app.post("/chat")
async def chat(
        message: str = Form(...),
        history: str = Form(default="[]"),
        image: Optional[UploadFile] = File(default=None)
):
    # פרסור היסטוריה
    chat_history = json.loads(history)

    # בניית הודעת המשתמש
    if image:
        image_data = base64.b64encode(await image.read()).decode("utf-8")
        ext = image.filename.split(".")[-1].lower()
        media_type = "image/jpeg" if ext == "jpg" else f"image/{ext}"

        user_content = [
            {
                "type": "image_url",
                "image_url": {"url": f"data:{media_type};base64,{image_data}"}
            },
            {"type": "text", "text": message}
        ]
        model = "meta-llama/llama-4-scout-17b-16e-instruct"
    else:
        user_content = message
        model = "llama-3.3-70b-versatile"

    # בניית messages
    messages = [
                   {"role": "system", "content": SYSTEM_PROMPT}
               ] + chat_history + [
                   {"role": "user", "content": user_content}
               ]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.3
    )

    elapsed = time.time() - start_time
    stats["total_questions"] += 1
    stats["response_times"].append(elapsed)
    if image:
        stats["total_images"] += 1
    stats["questions_log"].append({
        "question": message[:50],
        "time": datetime.now().strftime("%H:%M"),
        "latency": round(elapsed, 2)
    })

    # ב-/search endpoint — הוסיפי:
    stats["total_searches"] += 1

    return {"answer": response.choices[0].message.content}


@app.get("/")
def root():
    return {"status": "Dimex AI Backend פועל!"}


from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore


# אתחול embeddings ו-Pinecone
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = PineconeVectorStore(
    index_name="ai-course",
    embedding=embeddings
)


@app.post("/search")
async def search_docs(query: str = Form(...)):
    """חיפוש במדריכים טכניים"""

    # חיפוש ב-Pinecone
    docs = vectorstore.similarity_search(query, k=3)

    # שליחה ל-LLM לסיכום
    context = "\n\n".join(doc.page_content for doc in docs)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "אתה טכנאי מומחה של דיימקס. ענה בעברית על בסיס המידע שניתן בלבד."
            },
            {
                "role": "user",
                "content": f"מידע מהמדריכים:\n{context}\n\nשאלה: {query}"
            }
        ],
        temperature=0.1
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [doc.page_content[:100] for doc in docs]
    }


stats = {
    "total_questions": 0,
    "total_searches": 0,
    "total_images": 0,
    "response_times": [],
    "questions_log": []
}

# endpoint חדש:
@app.get("/stats")
def get_stats():
    avg_latency = (
        sum(stats["response_times"]) / len(stats["response_times"])
        if stats["response_times"] else 0
    )
    return {
        "total_questions": stats["total_questions"],
        "total_searches": stats["total_searches"],
        "total_images": stats["total_images"],
        "avg_latency": round(avg_latency, 2),
        "recent_questions": stats["questions_log"][-5:]
    }