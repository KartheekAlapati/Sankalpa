import random
from typing import Dict, Any, List
from .state import SankalpaState
from .db import save_plan

def planner_node(state: SankalpaState) -> Dict[str, Any]:
    print("--- PLANNER ---")
    subjects = state.get("subjects", ["Math", "Science"])
    plan = []
    for i, subject in enumerate(subjects):
        plan.append({
            "session_id": i + 1,
            "subject": subject,
            "topic": f"Unit {i+1} Basics",
            "priority": "High" if i == 0 else "Medium",
            "status": "Pending"
        })
    
    return {
        "current_plan": plan,
        "plan_versions": [plan],
        "retry_count": 0
    }

def action_node(state: SankalpaState) -> Dict[str, Any]:
    print("--- ACTION ---")
    plan = state["current_plan"]
    version = state["retry_count"] + 1
    save_plan(version, plan)
    return {}

def critic_node(state: SankalpaState) -> Dict[str, Any]:
    print("--- CRITIC ---")
    missed = state.get("missed_sessions", 0)
    plan = state["current_plan"]
    
    feasibility_flag = True
    feedback = "Plan looks solid."
    confidence = 0.95
    
    if missed >= 2:
        feasibility_flag = False
        feedback = f"CRITICAL: {missed} sessions missed. Schedule is now overloaded."
        confidence = 0.4
    elif len(plan) > 5:
        feasibility_flag = False
        feedback = "WARNING: Too many tasks for the available time."
        confidence = 0.6
        
    return {
        "feasibility_flag": feasibility_flag,
        "critic_feedback": feedback,
        "confidence_score": confidence
    }

def recovery_node(state: SankalpaState) -> Dict[str, Any]:
    print("--- RECOVERY ---")
    old_plan = state["current_plan"]
    retry_count = state["retry_count"] + 1
    
    # Simple recovery: Remove low priority or last session to reduce load
    new_plan = [s for s in old_plan if s["priority"] == "High"]
    if len(new_plan) == len(old_plan) and len(new_plan) > 0:
        new_plan = old_plan[:-1] # Just drop one
        
    reason = f"Reduced load by removing lower priority tasks to recover from {state['missed_sessions']} missed sessions."
    
    return {
        "current_plan": new_plan,
        "plan_versions": [new_plan],
        "retry_count": retry_count,
        "recovery_reason": reason,
        "missed_sessions": 0 # Reset missed sessions for simulation of fix
    }

def halt_node(state: SankalpaState) -> Dict[str, Any]:
    print("--- HALT ---")
    return {
        "warning": "CRITICAL FAILURE: Max retries reached. Manual intervention required."
    }
