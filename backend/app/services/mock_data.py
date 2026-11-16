import random
from datetime import datetime, timedelta

ATTACK_IPS = ["192.168.1.105", "10.0.0.42", "172.16.0.7", "203.0.113.9", "198.51.100.3"]
EVENTS = [
    ("Failed SSH login", "high"),
    ("Port scan detected", "medium"),
    ("HTTP 404 scan", "low"),
    ("Brute force attempt", "high"),
    ("SQL injection attempt", "critical"),
    ("Malware beacon", "critical"),
    ("Successful login", "info"),
]

def generate_logs(n: int = 50):
    now = datetime.utcnow()
    rows = []
    for i in range(n):
        event, sev = random.choice(EVENTS)
        rows.append({
            "timestamp": (now - timedelta(minutes=random.randint(0, 120))),
            "ip": random.choice(ATTACK_IPS),
            "event": event,
            "severity": sev,
            "details": f"source={random.choice(ATTACK_IPS)} attempt={random.randint(1, 50)}",
        })
    rows.sort(key=lambda r: r["timestamp"], reverse=True)
    return rows
