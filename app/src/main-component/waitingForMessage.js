export default function waitingForMessage(id) {
  if (!id || id === 0) return;
  const ws = new WebSocket(`wss://localhost?user=${id}`);
  ws.onerror = (e) => {
    console.error("Error with WebSocktet!");
  };

  ws.onmessage = (e) => {
    console.log("Message:", e.data);
  };
  
  ws.onclose = (e) => {
    console.log("Conection was closed!");
  };
  return ws;
}
