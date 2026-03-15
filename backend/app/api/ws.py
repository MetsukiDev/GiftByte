from typing import Dict, List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter(tags=["realtime"])


class ConnectionManager:
    """In-memory connection manager for wishlist WebSocket rooms (MVP only)."""

    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, wishlist_id: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(wishlist_id, []).append(websocket)

    def disconnect(self, wishlist_id: str, websocket: WebSocket):
        if wishlist_id in self.rooms and websocket in self.rooms[wishlist_id]:
            self.rooms[wishlist_id].remove(websocket)

    async def broadcast(self, wishlist_id: str, message: dict):
        for ws in list(self.rooms.get(wishlist_id, [])):
            try:
                await ws.send_json(message)
            except RuntimeError:
                # Ignore broken connections in MVP
                self.disconnect(wishlist_id, ws)


manager = ConnectionManager()


@router.websocket("/ws/wishlists/{wishlist_id}")
async def wishlist_ws(websocket: WebSocket, wishlist_id: str):
    """Basic realtime channel; services can call manager.broadcast."""
    await manager.connect(wishlist_id, websocket)
    try:
        while True:
            # For MVP we treat incoming messages as pings and ignore payload.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(wishlist_id, websocket)

