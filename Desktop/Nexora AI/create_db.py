import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def build_vector_store():
    data_dir = "./data"
    documents = []
    
    print("Reading data files...")
    # Dynamically read all .txt files inside the data directory
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print("Created missing 'data' directory. Please add your text files there.")
        return

    for file in os.listdir(data_dir):
        if file.endswith(".txt"):
            file_path = os.path.join(data_dir, file)
            loader = TextLoader(file_path, encoding="utf-8")
            documents.extend(loader.load())
            
    if not documents:
        print("No documents found to process.")
        return

    print(f"Loaded {len(documents)} source document(s). Splitting into chunks...")
    
    # Optimized chunking strategy
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        separators=["\n\n", "\n", "---"]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} text chunks.")

    print("Generating embeddings via HuggingFace (MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    print("Building FAISS Vector Database...")
    db = FAISS.from_documents(chunks, embeddings)
    
    # Save locally
    db.save_local("vectorstore/faiss_index")
    print("✅ FAISS database successfully built and saved to 'vectorstore/faiss_index'!")

if __name__ == "__main__":
    build_vector_store()