import sqlite3
import json
from typing import List, Dict, Any

DB_NAME = "sankalpa.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version INTEGER,
            plan_data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_plan(version: int, plan: List[Dict[str, Any]]):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO study_plans (version, plan_data) VALUES (?, ?)",
        (version, json.dumps(plan))
    )
    conn.commit()
    conn.close()

def get_latest_plan():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT plan_data FROM study_plans ORDER BY timestamp DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row[0])
    return None
