# Minecraft Player Status API

Python Flask API to get **online player names, UUIDs, and avatar images** from a Minecraft server using `mcstatus` and Crafatar.

## Requirements
- Python 3.10+
- Minecraft server with enable-query=true in server.properties

## Setup
1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Set your server address in `name_server.py`:
```python
SERVER_ADDR = "localhost:25565"
```
3. Set your desired path in `name_server.py`:
```python
@app.route("/<flask_path>/players"
```
Replace the `<placeholders>` with your own values to adapt it to your setup.

4. Run:
```bash
python name_server.py
```
API available at `http://127.0.0.1:5010/api/players`

## Notes
- UUIDs are cached automatically in uuids.json.
- Only player names require Query protocol.