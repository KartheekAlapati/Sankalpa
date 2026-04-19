import json

def safe_parse_json(data: str):
    try:
        return json.loads(data)
    except Exception:
        return None
