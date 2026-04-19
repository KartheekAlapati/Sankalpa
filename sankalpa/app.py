import streamlit as st
import json
import pandas as pd
from sankalpa.graph import graph
from sankalpa.db import init_db, get_latest_plan

# Initialize UI Configuration
st.set_page_config(page_title="Sankalpa — Autonomous Study Recovery System", page_icon="🎯", layout="wide")

# Theme Selection in Sidebar
with st.sidebar:
    st.markdown("## ⚙️ Settings")
    theme_choice = st.radio("UI Theme", ["Dark Mode", "Light Mode"], index=0)
    st.divider()

# Theme Variables
if theme_choice == "Dark Mode":
    bg_gradient = "linear-gradient(135deg, #000000 0%, #0a192f 100%)"
    text_color = "#ffffff"
    sub_text_color = "#cccccc"
    accent_color = "#4CAF50" 
    card_bg = "#16243d"
    card_border = "#2a3b5a"
    trace_bg = "#1e2d4d"
    metric_bg = "#16243d"
    shadow = "0 4px 6px rgba(0,0,0,0.3)"
else: # Light Mode (Orange Theme)
    bg_gradient = "linear-gradient(135deg, #fff5e6 0%, #ffe0b2 100%)"
    text_color = "#000000"
    sub_text_color = "#333333"
    accent_color = "#ff7a00"
    card_bg = "#ffffff"
    card_border = "#ff7a00"
    trace_bg = "#fff3e0"
    metric_bg = "#ffffff"
    shadow = "0 4px 15px rgba(255, 122, 0, 0.15)"

# Custom CSS Injection
st.markdown(f"""
    <style>
    .stApp {{
        background: {bg_gradient} !important;
        color: {text_color} !important;
    }}
    .stApp p, .stApp span, .stApp label, .stApp li {{
        color: {text_color} !important;
    }}
    h1, h2, h3, h4, h5, h6 {{
        color: {text_color} !important;
        font-weight: 700 !important;
    }}
    .stButton>button {{
        width: 100%;
        border-radius: 12px;
        height: 3.5em;
        background-color: {accent_color} !important;
        color: white !important;
        font-weight: bold;
        border: none !important;
        box-shadow: {shadow};
    }}
    .metric-card {{
        background-color: {metric_bg};
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        border: 1px solid {card_border if theme_choice == 'Light Mode' else '#333'} !important;
        box-shadow: {shadow};
    }}
    .session-card {{
        background-color: {card_bg};
        border-left: 6px solid {accent_color};
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: {shadow};
        border-top: 1px solid {card_border if theme_choice == 'Light Mode' else '#333'};
        border-right: 1px solid {card_border if theme_choice == 'Light Mode' else '#333'};
        border-bottom: 1px solid {card_border if theme_choice == 'Light Mode' else '#333'};
    }}
    .trace-container {{
        background-color: {trace_bg};
        padding: 25px;
        border-radius: 15px;
        border: 1px dashed {accent_color} !important;
        margin-bottom: 25px;
    }}
    .priority-high {{ color: #ff4b4b !important; font-weight: bold; }}
    .priority-medium {{ color: #ffa500 !important; font-weight: bold; }}
    .priority-low {{ color: {accent_color if theme_choice == 'Light Mode' else '#00ff00'} !important; font-weight: bold; }}
    </style>
    """, unsafe_allow_html=True)

# Helper functions
def parse_kv_pairs(text, value_type=str):
    result = {}
    for line in text.split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            try: result[k.strip()] = value_type(v.strip())
            except: continue
    return result

# --- Header ---
st.title("📘 Sankalpa")
st.markdown("##### Autonomous Study Recovery System")
st.divider()

# --- Sidebar ---
with st.sidebar:
    st.header("📋 Input Configuration")
    subjects_input = st.text_area("📘 Subjects", value="Math, Science, History, Physics, Chemistry")
    exam_dates_input = st.text_area("📅 Exam Dates", value="Math: 2026-05-15\nScience: 2026-05-20")
    available_time_input = st.text_input("⏰ Daily Capacity", value="Daily: 4, Weekend: 8")
    
    st.divider()
    missed_sessions = st.slider("⚡ Missed Sessions", 0, 5, 0)
    max_retries = st.number_input("🔁 Max Repairs", 1, 5, 3)

    if st.button("🚀 RUN SYSTEM"):
        try:
            subjects = [s.strip() for s in subjects_input.split(',') if s.strip()]
            exam_dates = parse_kv_pairs(exam_dates_input)
            available_time = parse_kv_pairs(available_time_input.replace(",", "\n"), value_type=int)
            
            if not subjects:
                st.error("Please enter subjects.")
                st.stop()
            
            init_db()
            initial_state = {
                "exam_dates": exam_dates, "subjects": subjects, "available_time": available_time,
                "missed_sessions": missed_sessions, "current_plan": [], "plan_versions": [],
                "retry_count": 0, "max_retries": int(max_retries), "feasibility_flag": True,
                "critic_feedback": "", "confidence_score": 1.0, "recovery_reason": "", "warning": ""
            }
            
            final_state = graph.invoke(initial_state)
            st.session_state.final_state = final_state
            st.success("Analysis Complete!")
        except Exception as e:
            st.error(f"Error: {str(e)}")

# --- Dashboard ---
if "final_state" in st.session_state:
    state = st.session_state.final_state
    
    # 1. Summary
    c1, c2, c3, c4 = st.columns(4)
    with c1: st.markdown(f'<div class="metric-card"><h4>Status</h4><h3>{"✅ STABLE" if state["feasibility_flag"] else "❌ FAILED"}</h3></div>', unsafe_allow_html=True)
    with c2: st.markdown(f'<div class="metric-card"><h4>Repairs</h4><h3>{state["retry_count"]}</h3></div>', unsafe_allow_html=True)
    with c3: st.markdown(f'<div class="metric-card"><h4>Confidence</h4><h3>{state["confidence_score"]*100:.0f}%</h3></div>', unsafe_allow_html=True)
    with c4: st.markdown(f'<div class="metric-card"><h4>Versions</h4><h3>{len(state["plan_versions"])}</h3></div>', unsafe_allow_html=True)

    if state["warning"]:
        st.warning(f"⚠️ {state['warning']}")

    st.divider()

    # 2. Decision Trace
    st.markdown("### 🕵️ Agent Decision Trace")
    with st.container():
        st.markdown(f"""
        <div class="trace-container">
            <p><strong>Feedback:</strong> {state['critic_feedback']}</p>
            <p><strong>Repair Action:</strong> {state.get('recovery_reason') or 'No repairs needed'}</p>
            <p><strong>Result:</strong> {'Plan Stabilized' if state['feasibility_flag'] else 'Action Required'}</p>
        </div>
        """, unsafe_allow_html=True)

    # 3. Optimized Plan
    st.markdown("### 📅 Current Optimized Plan")
    if state["current_plan"]:
        cols = st.columns(2)
        for i, s in enumerate(state["current_plan"]):
            with cols[i % 2]:
                p_class = f"priority-{s['priority'].lower()}"
                st.markdown(f"""
                <div class="session-card">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-size: 0.8em; opacity: 0.7;">SESSION {s['session_id']}</span>
                        <span class="{p_class}">{s['priority'].upper()}</span>
                    </div>
                    <div style="font-size: 1.3em; font-weight: bold; margin-top: 5px;">{s['subject']}</div>
                    <div style="color: {sub_text_color}; margin-top: 5px;">{s['topic']}</div>
                    <div style="margin-top: 10px; border-top: 1px solid #333; padding-top: 5px; font-size: 0.9em;">
                        Status: <b>{s['status']}</b>
                    </div>
                </div>
                """, unsafe_allow_html=True)
    else:
        st.info("No active plan.")

    # 4. Iteration History
    st.divider()
    st.markdown("### 🔄 Iteration History")
    
    # Navigation logic for versions (replaces keyboard/weird labels)
    num_versions = len(state["plan_versions"])
    if num_versions > 1:
        v_idx = st.select_slider("Plan Version Selector", options=list(range(1, num_versions + 1)), value=num_versions)
        st.markdown(f"#### Viewing Plan Version {v_idx}")
        version = state["plan_versions"][v_idx-1]
        for s in version:
            with st.container():
                c_a, c_b, c_c, c_d = st.columns([1, 2, 1, 1])
                c_a.markdown(f"**{s['subject']}**")
                c_b.markdown(f"*{s['topic']}*")
                c_c.markdown(f"<span class='priority-{s['priority'].lower()}'>{s['priority']}</span>", unsafe_allow_html=True)
                c_d.markdown(f"Status: {s['status']}")
    else:
        for i, v in enumerate(state["plan_versions"]):
            with st.expander(f"📌 Plan Version {i+1}"):
                for s in v:
                    st.markdown(f"• **{s['subject']}**: {s['topic']} — *{s['priority']} priority* ({s['status']})")

else:
    st.info("👋 Welcome! Configure and run the system to see the autonomous workflow.")
    col_img, col_text = st.columns([1, 1])
    with col_img:
        st.image("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", use_container_width=True)
    with col_text:
        st.markdown("""
        ### How it works:
        1. **Planner**: Creates initial schedule.
        2. **Critic**: Detects failures (overload/missed sessions).
        3. **Recovery**: Automatically repairs the plan.
        4. **Trace**: Shows every decision made by the agent.
        """)
