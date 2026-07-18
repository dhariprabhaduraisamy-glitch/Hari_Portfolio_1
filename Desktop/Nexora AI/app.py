import streamlit as st
import os
import time
from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Conversational RAG imports
from langchain_classic.chains import create_history_aware_retriever, create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

# Core message and prompt imports
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# --- 1. MINIMALIST PAGE CONFIGURATION ---
st.set_page_config(
    page_title="NEXORA AI // Hari's Assistant", 
    page_icon="🤖", 
    layout="centered", 
    initial_sidebar_state="collapsed"
)

# --- 2. DYNAMIC THEME SELECTOR & HIGH-PERFORMANCE CSS ---
if "theme_mode" not in st.session_state:
    st.session_state.theme_mode = "Dark"

col_branding, col_action, col_theme = st.columns([0.5, 0.25, 0.25])

with col_theme:
    toggle_label = "🌙 Dark Mode: ON" if st.session_state.theme_mode == "Dark" else "☀️ Light Mode: ON"
    if st.button(toggle_label, use_container_width=True):
        st.session_state.theme_mode = "Light" if st.session_state.theme_mode == "Dark" else "Dark"
        st.rerun()

# Define structural color palettes dynamically based on selection state
if st.session_state.theme_mode == "Dark":
    bg_color = "#0B0E14"
    text_main = "#00F2FE"
    text_sub = "#8B949E"
    border_color = "#21262D"
    font_color = "#C9D1D9"
    btn_bg = "#21262D"
    btn_text = "#C9D1D9"
    btn_border = "#30363D"
else:
    bg_color = "#FFFFFF"
    text_main = "#0056b3"
    text_sub = "#495057"
    border_color = "#dee2e6"
    font_color = "#212529"
    btn_bg = "#0056b3"
    btn_text = "#FFFFFF"
    btn_border = "#004085"

st.markdown(f"""
    <style>
    .stApp {{
        background-color: {bg_color} !important;
        font-family: 'Inter', sans-serif;
        color: {font_color} !important;
    }}
    h1 {{
        color: {text_main} !important;
        font-weight: 800 !important;
        letter-spacing: -0.5px;
        margin-bottom: 5px !important;
    }}
    h5 {{
        color: {text_sub} !important;
        font-weight: 400 !important;
        margin-top: 0px !important;
        margin-bottom: 25px !important;
    }}
    hr {{
        border-color: {border_color} !important;
        margin-top: 10px !important;
        margin-bottom: 30px !important;
    }}
    .performance-footer {{
        text-align: center;
        color: {text_sub};
        font-size: 0.75rem;
        margin-top: 30px;
        font-family: monospace;
    }}
    div.stDownloadButton > button {{
        background-color: {btn_bg} !important;
        color: {btn_text} !important;
        border: 1px solid {btn_border} !important;
        font-weight: 600 !important;
        transition: all 0.2s ease-in-out;
    }}
    div.stDownloadButton > button:hover {{
        opacity: 0.9 !important;
        transform: scale(1.02);
    }}
    .stChatMessage {{
        background-color: transparent !important;
    }}
    </style>
""", unsafe_allow_html=True)

# --- 3. SEPARATED ULTRA FAST INITIALIZATION PIPELINE ---
@st.cache_resource
def get_embedding_model():
    # SPEED RECOVERY UPGRADE: CPU execution configurations optimized matrix encoding mapping instructions
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

@st.cache_resource
def load_vector_store():
    embeddings = get_embedding_model()
    if not os.path.exists("vectorstore/faiss_index"):
        st.error("Vector store missing. Please build your index using create_db.py first.")
        st.stop()
        
    db = FAISS.load_local("vectorstore/faiss_index", embeddings, allow_dangerous_deserialization=True)
    # FIX: Restored k=4 parameters for faster history aware query synthesis search comparisons
    return db.as_retriever(search_kwargs={"k": 4}) 

@st.cache_resource
def initialize_rag_pipeline():
    # HARDWARE INFERENCE TURBO MODE: Injecting ultra stable runtime system thread management allocations
    llm = Ollama(
        model="llama3.1", 
        temperature=0.1,
        num_ctx=2048,
        mirostat=0,
        num_thread=8 # Forces local CPU pipeline allocations to compute response parallel tracks instantly
    )
    
    retriever = load_vector_store()
    
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question, reformulate it into a standalone "
        "search query. If the user refers to 'the other project', 'another one', or uses general "
        "pronouns, change the query to 'What projects did Hari build?' so the system retrieves all options."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)
    
    system_prompt = (
        "You are NEXORA AI, a professional portfolio assistant representing Hari.\n"
        "Your job is to answer questions about Hari's projects, skills, and experience using the provided context.\n\n"
        "Rules:\n"
        "1. Look through the entire context. If the user asks about an alternative or other project, make sure to detail NOVEXA MACRO.\n"
        "2. Do not stop reading after finding the first project.\n"
        "3. Use clean bullet points for your answer.\n"
        "4. If the information isn't in the context at all, say 'I cannot find that information in Hari's professional profile.'\n\n"
        "Context:\n{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    return create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Boot the backend pipeline
try:
    rag_chain = initialize_rag_pipeline()
except Exception as e:
    st.error(f"Engine connection failed: {e}")
    st.stop()

# --- 4. SESSION STATE CONVERSATION MANAGEMENT ---
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# --- 5. PROFESSIONAL TOP HEADER & RESUME DOWNLOAD ---
with col_branding:
    st.markdown("<h1>NEXORA AI</h1>", unsafe_allow_html=True)
    st.markdown("<h5>AI Portfolio Assistant representing Hari</h5>", unsafe_allow_html=True)

with col_action:
    resume_path = "data/resume.pdf"
    if os.path.exists(resume_path):
        with open(resume_path, "rb") as pdf_file:
            st.download_button(
                label="📄 Download Resume",
                data=pdf_file.read(),
                file_name="Hari_Resume.pdf",
                mime="application/pdf",
                use_container_width=True
            )
    else:
        st.button("📄 Resume Offline", disabled=True, use_container_width=True)

st.markdown("<hr/>", unsafe_allow_html=True)

# --- 6. PERMANENT AUTOMATED GREETING CHAT VIEW ---
with st.chat_message("assistant"):
    st.markdown(
        "Hi! I'm **NEXORA**, Hari's personal AI assistant. 🤖\n\n"
        "I am connected directly to his knowledge base and can guide you through his "
        "projects, core skill sets, and technical experience. What would you like to explore today?"
    )

# Render standard conversational loop history entries
for message in st.session_state.chat_history:
    if isinstance(message, HumanMessage):
        with st.chat_message("user"):
            st.write(message.content)
    elif isinstance(message, AIMessage):
        with st.chat_message("assistant"):
            st.write(message.content)

# --- 7. EXECUTIVE QUICK-INQUIRY ACTION PILLS ---
st.caption("Suggested Quick-Inquiries:")
col_tag1, col_tag2, col_tag3 = st.columns(3)

preset_query = None
with col_tag1:
    if st.button("🛠️ Core Tech Stack", use_container_width=True):
        preset_query = "What technologies and programming languages does Hari specialize in?"
with col_tag2:
    if st.button("🚀 Featured Projects", use_container_width=True):
        preset_query = "What projects did Hari build?"
with col_tag3:
    if st.button("🔄 Reset Conversation", use_container_width=True):
        st.session_state.chat_history = []
        st.rerun()

# --- 8. LIVE USER INPUT & HIGH-PERFORMANCE STREAMING PIPELINE ---
user_query = st.chat_input("Ask a question about Hari's professional profile...")
if preset_query:
    user_query = preset_query

if user_query:
    with st.chat_message("user"):
        st.write(user_query)
        
    with st.chat_message("assistant"):
        try:
            start_time = time.time()
            
            response_stream = rag_chain.stream({
                "input": user_query,
                "chat_history": st.session_state.chat_history
            })
            
            def stream_parser(stream):
                for chunk in stream:
                    if "answer" in chunk:
                        yield chunk["answer"]
            
            answer = st.write_stream(stream_parser(response_stream))
            generation_time = round(time.time() - start_time, 2)
            
            st.session_state.chat_history.extend([
                HumanMessage(content=user_query),
                AIMessage(content=answer)
            ])
            
            st.markdown(
                f'<div class="performance-footer">Response synthesized via Nexora Core in {generation_time}s</div>', 
                unsafe_allow_html=True
            )
            
        except Exception as e:
            st.error(f"Text generation pipeline encountered an interruption: {e}")