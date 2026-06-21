import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
import glob

from dotenv import load_dotenv
load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def load_all_documents():
    """טוענת את כל ה-PDFים מתיקיית documents"""

    # מוצאת את כל הPDFים
    pdf_files = glob.glob("documents/**/*.pdf", recursive=True)

    if not pdf_files:
        print("❌ לא נמצאו קבצי PDF בתיקיית documents/")
        return

    print(f"📄 נמצאו {len(pdf_files)} קבצים")

    all_chunks = []

    for pdf_path in pdf_files:
        try:
            print(f"  טוענת: {pdf_path}")
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50
            )
            chunks = splitter.split_documents(documents)

            # מוסיפה מטאדטה לכל chunk
            for chunk in chunks:
                chunk.metadata["source"] = os.path.basename(pdf_path)

            all_chunks.extend(chunks)
            print(f"  ✅ {len(chunks)} חלקים")

        except Exception as e:
            print(f"  ❌ שגיאה: {e}")

    print(f"\n📤 מעלה {len(all_chunks)} חלקים ל-Pinecone...")

    # העלאה ל-Pinecone בקבוצות
    batch_size = 100
    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i:i + batch_size]
        PineconeVectorStore.from_documents(
            batch,
            embeddings,
            index_name="ai-course"
        )
        print(f"  ✅ {min(i + batch_size, len(all_chunks))}/{len(all_chunks)}")

    print("\n🎉 כל המסמכים נטענו בהצלחה!")


if __name__ == "__main__":
    load_all_documents()