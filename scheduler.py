from pymongo import MongoClient
from datetime import datetime
import time
import os

MONGODB_URI = os.getenv("MONGODB_URI")
print(MONGODB_URI)
# connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client.todoapp
tasks = db.tasks

while True:
    try:
        now = datetime.now()

        # get earliest task that is not alerted
        cursor = tasks.find({"alerted": False}).sort("time", 1).limit(1)

        task = None
        for t in cursor:
            task = t

        if task is not None:
            scheduled = datetime.strptime(task["time"], "%Y-%m-%d %H:%M")
            delta = (scheduled - now).total_seconds()

            if 0 <= delta <= 15 * 60:
                print("Alerting:", task["title"])
                tasks.update_one(
                    {"_id": task["_id"]},
                    {"$set": {"alerted": True}}
                )

        time.sleep(10)

    except Exception as e:
        print("Scheduler error:", e)
        time.sleep(10)
