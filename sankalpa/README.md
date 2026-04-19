# Sankalpa — Autonomous Study Recovery System 🎯

Sankalpa is a deterministic, agentic workflow designed for student success. It goes beyond a simple study planner by implementing an autonomous "Self-Correction" loop that detects failures (like missed sessions) and automatically repairs the study schedule.

---

## 🚀 Key Features

- **Autonomous Workflow**: Not a chatbot—a structured state machine that plans, evaluates, and repairs itself.
- **Dual Theme Dashboard**: Premium Dark Mode and a vibrant Orange Light Mode.
- **Agent Decision Trace**: Real-time transparency into the agent's reasoning, feedback, and recovery logic.
- **Zero API Dependencies**: Runs completely locally using LangGraph and rule-based nodes.
- **SQLite Persistence**: Every plan iteration is saved locally to simulate tool usage and data integrity.

---

## 🕵️ Agent Workflow (LangGraph)

The system operates on a stateful graph where nodes represent specific "Skills" or "Actions":

1.  **Planner Node**: Generates the initial study schedule based on subjects and exam dates.
2.  **Action Node**: Persists the current plan to the SQLite database.
3.  **Critic Node**: Evaluates the plan's feasibility. It flags failures if missed sessions are detected or if the workload exceeds capacity.
4.  **Recovery Node**: If the Critic flags a failure, this node modifies the plan (e.g., pruning low-priority tasks) and triggers a retry loop.
5.  **Halt Node**: Stops execution if the agent cannot find a feasible solution within the max retry limit.

---

## 🛠️ Tech Stack

- **Python**: Core logic and scripting.
- **LangGraph**: Workflow orchestration and state management.
- **Streamlit**: Modern, responsive dashboard UI.
- **SQLite**: Local data persistence.
- **CSS**: Custom styling for premium theme support.

---

## 📂 Project Structure

```text
sankalpa/
├── app.py              # Streamlit Dashboard (UI)
├── requirements.txt    # Project Dependencies
├── README.md           # Documentation
└── sankalpa/
    ├── graph.py        # LangGraph Workflow Logic
    ├── nodes.py        # Node Definitions (Planner, Critic, etc.)
    ├── state.py        # State TypedDict Definition
    ├── db.py           # SQLite Database Operations
    └── utils.py        # Helper Functions
```

---

## 🏃 Run Instructions

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Launch the Dashboard**:
    ```bash
    python -m streamlit run app.py
    ```

---

## 🎯 Demo Flow for Judges

1.  **Scenario: Perfect Success**
    - Set **Sessions Missed** to `0`.
    - Click **Execute Recovery Workflow**.
    - Observe the system stabilizing immediately with a high confidence score.

2.  **Scenario: Autonomous Recovery**
    - Increase **Sessions Missed** to `3`.
    - Run the workflow.
    - **Observe**: The Critic flags an "Overload", the Recovery Node triggers, and the system iterates until a feasible plan is found.
    - Check the **Iteration History** to see how the plan evolved.

3.  **Scenario: System Halt**
    - Set **Sessions Missed** to `5` and **Max Self-Repairs** to `1`.
    - The system will reach the limit and Halt, showing a clear warning that manual intervention is required.

---

**Sankalpa** demonstrates the power of agentic systems that can detect their own failures and act to correct them—the future of autonomous productivity.
