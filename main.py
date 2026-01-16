from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
MONGODB_URI = os.getenv("MONGODB_URI")
# print(MONGODB_URI)
client = MongoClient(MONGODB_URI)
db = client.todoapp
tasks = db.tasks

class TaskIn(BaseModel):
    title: str
    time: str

@app.get("/")
def home():
    return {"status": "backend running"}

@app.post("/add")
def add_task(task: TaskIn):
    doc = {
        "title": task.title,
        "time": task.time,
        "created_on": datetime.now(),
        "done": False,
        "alerted": False
    }
    tasks.insert_one(doc)
    return {"message": "task saved"}

@app.get("/tasks")
def get_tasks():
    data = []
    for t in tasks.find().sort("time",1):
        t["_id"] = str(t["_id"])
        data.append(t)
    return data
@app.delete("/delete")
def delete_tasks(id:str):
    tasks.delete_one({ "_id": ObjectId(id) })
    

@app.get("/alert")
def get_alert():
    task = tasks.find_one({"alerted": True, "done": False})
    if task:
        task["_id"] = str(task["_id"])
        return task
    return {}


