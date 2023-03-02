import express from "express";
import WSS from "express-ws";

//db
import pool from "./db.js";

//middleware import
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
//routes import
import authRoutes from "./routes/auth.routhes.js"

const app = express();
const WSServer = WSS(app);
const aWss = WSServer.getWss();

//middleware
app.use(cors({origin: "http://localhost:3000", credentials: true}));
//
app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use("/auth", authRoutes);

const broadcastConnection = (ws, msg) => {
    if(msg.username){
        aWss.clients.forEach(client => {
            console.log(`sending message`);
            client.send(`пользователь ${msg.username} подключился`);
        })
    }
}


const handleConnection = (ws, msg) => {
    //msg = JSON.parse(msg);
    ws.username = msg.username;
    broadcastConnection(ws, msg)
}

const handleInvite = (ws, msg) => {
        aWss.clients.forEach(client => {
            if(client.username === msg.invitedUsername){
                client.send(JSON.stringify(msg));
            }
        })
}

const handleAcceptInvite = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.username === msg.inviterUsername){
            client.send(JSON.stringify(msg));
        }
    })
}

app.ws('/', (ws, req) => {
    console.log(`connection was set`);
    ws.send(`you have set connection successfully`)
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        console.log("message", msg);
        switch (msg.method){
            case "connection":
                console.log("handling connection...");
                handleConnection(ws, msg)
                break;
            case "fieldUpdate":
                break;
            case "invite":
                console.log("invite message", msg);
                handleInvite(ws, msg);
                break;
            case "accept":
                console.log("invite message", msg);
                handleInvite(ws, msg);
        }
        //console.log("got message", msg)
    })
})

const PORT = process.env.PORT || 5000;

const start = async () => {
    app.listen(PORT, () => {
        console.log("yeah, the app is still working. Good luck!");
    });
}

start();
