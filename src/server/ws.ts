import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  ws.on('message', (data) => {
    ws.send('Echo from server: ' + data.toString())
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(`You are a client`)
      }
      if (client === ws && client.readyState === 1) {
        client.send(`You are the sender`)
      }
    })
  })

  ws.send('something')

  setTimeout(() => ws.send('more'), 10000)
})
