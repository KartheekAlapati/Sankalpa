from langgraph.graph import StateGraph, END
from .state import SankalpaState
from .nodes import planner_node, action_node, critic_node, recovery_node, halt_node

def create_graph():
    workflow = StateGraph(SankalpaState)

    # Add Nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("action", action_node)
    workflow.add_node("critic", critic_node)
    workflow.add_node("recovery", recovery_node)
    workflow.add_node("halt", halt_node)

    # Build Edges
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "action")
    workflow.add_edge("action", "critic")

    # Conditional Logic
    def route_after_critic(state: SankalpaState):
        if state["feasibility_flag"]:
            return END
        
        if state["retry_count"] >= state["max_retries"]:
            return "halt"
        
        return "recovery"

    workflow.add_conditional_edges(
        "critic",
        route_after_critic,
        {
            END: END,
            "halt": "halt",
            "recovery": "recovery"
        }
    )

    workflow.add_edge("recovery", "action")
    workflow.add_edge("halt", END)

    return workflow.compile()

graph = create_graph()
