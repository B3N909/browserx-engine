// connect to WS server

const WS_URL = "ws://10.128.0.7:8060";

const uuid = require("uuidv4").uuid();

const createRemoteBrowser = require("./RemoteBrowser.js");

const WebSocket = require("ws");
const createRemoteBrowser = require("./RemoteBrowser");
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
    ws.send(JSON.stringify({
        type: "auth",
        uuid,
    }));

    ws.on("message", data => {
        const message = JSON.parse(data);

        if(message && message.type) {
            if(message.type === "create") {
                let uuid = message.uuid;
                let emulation = message.emulation;

                console.log(`Creating browser with uuid: ${uuid}, emulation: ${emulation}`);
                createRemoteBrowser(emulation).then(v => {
                    ws.send(JSON.stringify({
                        type: "created",
                        uuid,
                        endpoint: v
                    }))
                });
            }
        }
    });
});