from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def test_retrieval():
    print("Loading HuggingFace Embedding model...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    print("Loading local FAISS database...")
    try:
        db = FAISS.load_local("vectorstore/faiss_index", embeddings, allow_dangerous_deserialization=True)
    except Exception as e:
        print(f"❌ Error loading FAISS database: {e}\nDid you run create_db.py first?")
        return

    # Use k=4 to make sure we pull back multiple matching documents
    retriever = db.as_retriever(search_kwargs={"k": 4})
    
    query = "What projects did Hari build?"
    print(f"\nTesting Query: '{query}'")
    print("-" * 40)
    
    results = retriever.invoke(query)
    
    print(f"Found {len(results)} matching chunks:\n")
    for idx, doc in enumerate(results, 1):
        print(f"--- Chunk {idx} (Source: {doc.metadata.get('source')}) ---")
        print(doc.page_content.strip())
        print("-" * 40)

if __name__ == "__main__":
    test_retrieval()