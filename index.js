import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
const app = express();
const svr = createServer(app);
const io = new Server(svr);

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (msg) => {
        console.log(msg);
        const { message, name } = msg;
        console.log(socket.id);
        io.emit("message", { msg: message, id: socket.id, name });
    });
});

io.on("disconnect", () => {
    console.log("user disconnected");
});

svr.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
