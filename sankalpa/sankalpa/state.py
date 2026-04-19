from typing import Annotated, List, Dict, Any, TypedDict
import operator

class SankalpaState(TypedDict):
    # Inputs
    exam_dates: Dict[str, str]
    subjects: List[str]
    available_time: Dict[str, int]
    missed_sessions: int
    
    # Internal Logic
    current_plan: List[Dict[str, Any]]
    plan_versions: Annotated[List[List[Dict[str, Any]]], operator.add]
    retry_count: int
    max_retries: int
    
    # Outputs
    feasibility_flag: bool
    critic_feedback: str
    confidence_score: float
    recovery_reason: str
    warning: str
