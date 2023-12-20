import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const svr = createServer(app);
const io = new Server(svr);
/* type User = {
    id: string;
    name: string;
}; */
let users /* : User[] */ = [];

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
        io.emit("join", users);
    });
});

io.on("disconnect", (socket) => {
    users = users.filter((user) => user.id !== socket.id);
    console.log("user disconnected");
});

svr.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
