import ollama


from langchain_community.vectorstores import FAISS

from langchain_community.embeddings import HuggingFaceEmbeddings



# Load database

embeddings = HuggingFaceEmbeddings(
model_name="sentence-transformers/all-MiniLM-L6-v2"
)


db = FAISS.load_local(

"vectorstore",

embeddings,

allow_dangerous_deserialization=True

)



# Search

question=input(
"Ask:"
)



docs=db.similarity_search(
question,
k=2
)



context=""

for doc in docs:

    context += doc.page_content



prompt=f"""

Answer using this information:


{context}


Question:

{question}

"""



response=ollama.chat(

model="llama3.1",

messages=[
{
"role":"user",
"content":prompt
}
]

)



print(
response["message"]["content"]
)
