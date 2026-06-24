from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))


def load_all_documents():
    # קריאת קובץ markdown
    md_path = "documents/devices_knowledge_base.md"

    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"📄 נטען קובץ: {len(content)} תווים")

    # חלוקה לchunks
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
                    "source": "devices_knowledge_base.md"
                }
            })

        index.upsert(vectors=vectors)
        print(f"  ✅ {min(i + batch_size, len(chunks))}/{len(chunks)}")

    print("🎉 הושלם!")


if __name__ == "__main__":
    load_all_documents()