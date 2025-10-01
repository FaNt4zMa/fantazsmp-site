from flask import Flask, jsonify
from mcstatus import JavaServer
import requests, json, os

app = Flask(__name__)
SERVER_ADDR = "localhost:25565" # Change this to your server address

CACHE_FILE = "uuids.json"
uuid_cache = {}

if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r") as f:
        try:
            uuid_cache = json.load(f)
        except json.JSONDecodeError:
            uuid_cache = {}

def save_cache():
    with open(CACHE_FILE, "w") as f:
        json.dump(uuid_cache, f)

def get_uuid(name):
    name = name.lower()
    if name in uuid_cache:
        return uuid_cache[name]
    url = f"https://api.mojang.com/users/profiles/minecraft/{name}"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            uuid_cache[name] = data["id"]
            save_cache()
            return data["id"]
    except requests.RequestException:
        pass
    return None

@app.route("/<flask_path>/players") # Change <flask_path> to your desired path
def players():
    try:
        server = JavaServer.lookup(SERVER_ADDR)
        query = server.query()
        players = []
        for name in query.players.list:
            uuid = get_uuid(name)
            players.append({
                "name": name,
                "uuid": uuid,
                "avatar": f"https://crafatar.com/avatars/{uuid}?overlay" if uuid else None
            })
        return jsonify({
            "online": True,
            "players": players
        })
    except Exception as e:
        return jsonify({
            "online": False,
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5010)
