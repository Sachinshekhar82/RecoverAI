import os
import json
import logging
from typing import List, Dict, Any, Optional
from backend.config import settings

logger = logging.getLogger("db")

class DualDatabaseManager:
    """
    Dual-mode Database Manager:
    Attempts to connect to MongoDB Atlas if MONGODB_URI is specified and valid.
    Falls back gracefully to an in-memory & JSON file store if MongoDB is unconnectable.
    This guarantees 100% out-of-the-box reliability.
    """
    def __init__(self):
        self.use_mongo = False
        self.db = None
        self.client = None
        self.in_memory_store: Dict[str, List[Dict[str, Any]]] = {
            "recovery_cases": [],
            "audit_events": [],
            "transactions": [],
            "customers": [],
            "subscriptions": [],
            "invoices": [],
            "settings": []
        }
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        os.makedirs(self.data_dir, exist_ok=True)
        self.json_file_path = os.path.join(self.data_dir, "db_fallback.json")
        self._load_local_json()
        self._init_mongo()

    def _init_mongo(self):
        if settings.MONGODB_URI and "<db_password>" not in settings.MONGODB_URI:
            try:
                from pymongo import MongoClient
                self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
                # Quick ping check
                self.client.admin.command('ping')
                self.db = self.client.get_database("recoverai")
                self.use_mongo = True
                logger.info("Successfully connected to MongoDB Atlas!")
            except Exception as e:
                logger.warning(f"MongoDB connection attempt failed ({e}). Falling back to local JSON engine.")
                self.use_mongo = False
        else:
            logger.info("No valid MONGODB_URI found with password. Using built-in JSON Engine.")
            self.use_mongo = False

    def _load_local_json(self):
        if os.path.exists(self.json_file_path):
            try:
                with open(self.json_file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for k in self.in_memory_store:
                        if k in data:
                            self.in_memory_store[k] = data[k]
            except Exception as e:
                logger.error(f"Error loading local JSON store: {e}")

    def save_local_json(self):
        try:
            with open(self.json_file_path, "w", encoding="utf-8") as f:
                json.dump(self.in_memory_store, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving local JSON store: {e}")

    # --- Collection Operations ---
    def get_collection(self, collection_name: str) -> List[Dict[str, Any]]:
        if self.use_mongo:
            try:
                return list(self.db[collection_name].find({}, {"_id": 0}))
            except Exception as e:
                logger.error(f"Mongo find error: {e}")
        return self.in_memory_store.get(collection_name, [])

    def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            try:
                doc = self.db[collection_name].find_one(query, {"_id": 0})
                if doc:
                    return doc
            except Exception:
                pass
        
        items = self.in_memory_store.get(collection_name, [])
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    def insert_one(self, collection_name: str, document: Dict[str, Any]):
        if self.use_mongo:
            try:
                doc_to_insert = document.copy()
                self.db[collection_name].insert_one(doc_to_insert)
            except Exception as e:
                logger.error(f"Mongo insert error: {e}")
        
        if collection_name not in self.in_memory_store:
            self.in_memory_store[collection_name] = []
        
        # Remove _id if inserted by mongo for consistency
        doc_copy = {k: v for k, v in document.items() if k != "_id"}
        self.in_memory_store[collection_name].append(doc_copy)
        self.save_local_json()

    def update_one(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any]):
        if self.use_mongo:
            try:
                self.db[collection_name].update_one(query, update)
            except Exception as e:
                logger.error(f"Mongo update error: {e}")
        
        items = self.in_memory_store.get(collection_name, [])
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                if "$set" in update:
                    for k, v in update["$set"].items():
                        item[k] = v
                if "$inc" in update:
                    for k, v in update["$inc"].items():
                        item[k] = item.get(k, 0) + v
                break
        self.save_local_json()

    def replace_all(self, collection_name: str, documents: List[Dict[str, Any]]):
        if self.use_mongo:
            try:
                self.db[collection_name].delete_many({})
                if documents:
                    # Strip _id if any
                    clean_docs = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
                    self.db[collection_name].insert_many(clean_docs)
            except Exception as e:
                logger.error(f"Mongo replace_all error: {e}")
        
        self.in_memory_store[collection_name] = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
        self.save_local_json()

db_manager = DualDatabaseManager()
