from typing import Any, Dict, Optional, Tuple

def ok(data: Any = None, meta: Optional[Dict[str, Any]] = None, status: int = 200) -> Tuple[Dict[str, Any], int]:
    payload: Dict[str, Any] = {"success": True, "data": data}
    if meta is not None:
        payload["meta"] = meta
    return payload, status

def err(code: str, message: str, status: int = 400, details: Optional[Dict[str, Any]] = None) -> Tuple[Dict[str, Any], int]:
    payload: Dict[str, Any] = {"success": False, "error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return payload, status
