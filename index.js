import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
const app = express();
const svr = createServer(app);
const io = new Server(svr);

let users = [];

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", ({ name }) => {
        users.push({ id: socket.id, name });
        console.log(users);
        io.emit("join", users);
    });

    socket.on("message", (msg) => {
        console.log(msg);
        const { message, name } = msg;
        console.log(socket.id);
        io.emit("message", { msg: message, id: socket.id, name });
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);
        console.log("user disconnected");
    });
});

io.on("disconnect", (socket) => {
    users = users.filter((user) => user.id !== socket.id);
    console.log("user disconnected");
});

svr.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
