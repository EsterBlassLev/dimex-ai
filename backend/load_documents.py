import os
import re
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def get_product_name(text, full_content, chunk_start):
    """מוצא את שם המוצר הקרוב ביותר לchunk"""
    content_before = full_content[:chunk_start]
    headers = re.findall(r'^## (.+)$', content_before, re.MULTILINE)
    if headers:
        return headers[-1].strip()
    return "General"

def load_all_documents():
    md_path = "documents/devices_knowledge_base.md"

    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"📄 נטען קובץ: {len(content)} תווים")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["##", "#", "\n\n", "\n", " "]
    )
    chunks = splitter.create_documents(
        [content],
        metadatas=[{"source": "devices_knowledge_base.md"}]
    )

    print(f"✂️ נוצרו {len(chunks)} chunks")

    # חישוב מיקום כל chunk בטקסט המקורי
    pos = 0
    for chunk in chunks:
        idx = content.find(chunk.page_content[:50], pos)
        if idx >= 0:
            chunk.metadata["product"] = get_product_name(chunk.page_content, content, idx)
            pos = idx
        else:
            chunk.metadata["product"] = "General"

    index = pc.Index("dimex-docs")

    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        texts = [c.page_content for c in batch]

        embeddings = pc.inference.embed(
            model="llama-text-embed-v2",
            inputs=texts,
            parameters={"input_type": "passage", "truncate": "END"}
        )

        vectors = []
        for j, (chunk, emb) in enumerate(zip(batch, embeddings)):
            vectors.append({
                "id": f"doc_{i + j}",
                "values": emb.values,
                "metadata": {
                    "text": chunk.page_content,
                    "source": "devices_knowledge_base.md",
                    "product": chunk.metadata.get("product", "General")
                }
            })

        index.upsert(vectors=vectors)
        print(f"  ✅ {min(i + batch_size, len(chunks))}/{len(chunks)}")

    print("🎉 הושלם!")

if __name__ == "__main__":
    load_all_documents()