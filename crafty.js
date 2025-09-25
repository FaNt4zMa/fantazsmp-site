const $ = (sel) => document.querySelector(sel)

function safeParseDate(dt) {
  if (!dt) return NaN
  const m = dt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/)
  if (m) {
    return Date.parse(m[1] + "T" + m[2] + "Z")
  }
  return Date.parse(dt)
}

function formatUptimeFromStarted(started) {
  const start = safeParseDate(started)
  if (isNaN(start)) return "—"
  const diff = Math.floor((Date.now() - start) / 1000)
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

function setOffline() {
  ["#uptime","#players","#resources","#worldsize","#motd","#version"]
    .forEach(sel => $(sel).textContent = "Offline");
}

async function fetchCrafty() {
  const url = `/api/v2/servers/${CONFIG.serverId}/stats`
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    })
    clearTimeout(t)

    if (!res.ok) throw new Error(`Crafty API error ${res.status}`)
    const json = await res.json()
    const data = json?.data ?? json

    if (!data || data.running === false) {
      setOffline()
      return
    }

    $("#uptime").textContent    = formatUptimeFromStarted(data.started)
    $("#players").textContent   = `${data.online}/${data.max}`
    $("#resources").textContent = `${data.cpu}% CPU / ${data.mem_percent}% RAM (${data.mem})`
    $("#worldsize").textContent = data.world_size || "—"
    $("#motd").textContent      = data.desc || "—"
    $("#version").textContent   = data.version || "—"
  } catch (err) {
    console.error("fetchCrafty error:", err)
    setOffline()
  }
}

fetchCrafty()
setInterval(fetchCrafty, CONFIG.pollMs)
