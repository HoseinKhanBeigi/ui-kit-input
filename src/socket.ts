// export interface SocketClient {
//     connect: () => Promise<void>;
//     disconnect: () => Promise<void>;
//     onEvent(event: string, payload: any): void;
//     emit(event: string, payload: any): void;
//     reconnect: (e: any) => void;
//     reconnected: boolean;
//     onopen?: (ev: any) => void,
//     onclose?: (ev: any) => void,
//     onerror?: (ev: any) => void,
//     socket: WebSocket | null;
//     events: Record<string, ((payload?: any) => void)[]>;
//     id: string;
//   }
//   const SocketBaseURL = process.env.VUE_APP_WEBSOCKET_URL || "ws://167.172.33.80:8003";
//   const IS_DEV_MODE = process.env.NODE_ENV === "development";
//   let __id = 0;
//   export function wsClient(path = SocketBaseURL, options: any = {}): SocketClient {
//     console.log("wsClient: ", wsClient);
//     let selfClose = false;

//     const auth = () => {
//       return localStorage.getItem("AUTH_TOKEN");
//     };
//     const autoReconnect = options.autoReconnect ? options.autoReconnect : true;
//     const autoReconnectTimeout = options.autoReconnectTimeout ? options.autoReconnectTimeout : 1500;
//     const autoConnect = options.autoConnect ? options.autoConnect : true;
//     const debug = options.debug ? options.debug : IS_DEV_MODE;
//     const q = options.query || {};
//     console.log("debug: ", debug)
//     let qs = Object.entries(q)
//       .map(([k, v]) => `${k}=${v}`)
//       .join("&");
//     qs = encodeURI(qs);
//     __id++;

//     const instance: SocketClient = {
//       id: String(__id),
//       reconnected: false,
//       socket: null,
//       events: {},

//       onEvent: (event: string, listener: (payload: any) => void) => {
//         if (!instance.events[event]) {
//           instance.events[event] = [listener];
//         } else {
//           instance.events[event].push(listener);
//         }
//       },
//       emit: (event: string, data: any) => {
//         console.log("emit: ", event, data);
//         instance.socket.send(JSON.stringify({ event, data }));
//       },
//       reconnect: (e: any) => {
//         // Set reconnect timeout
//         setTimeout(function () {
//           // Log reconnecting
//           if (debug) {
//             console.log(`[WebSocket]: ${instance.id} Reconnecting...`);
//           }

//           // Define has reconnected
//           instance.reconnected = true;

//           // Try and open the URL
//           instance.connect();
//         }, autoReconnectTimeout);
//       },
//       disconnect: async () => {
//         console.log(`[WebSocket]: ${instance.id} disconnecting.`);
//         selfClose = true;
//         for (const key in instance.events) {
//           instance.events[key] = undefined;
//         }
//         for (const key in instance.events) {
//           delete instance.events[key];
//         }
//         if (instance.socket) {
//           instance.socket.close(1000, "Disconnect called");
//           instance.socket = null;
//         }
//         console.log(`[WebSocket]: ${instance.id} disconnected.`);
//       },
//       connect: async () => {
//         if (instance.socket && instance.socket.readyState === 1) {
//           instance.disconnect(); // open
//         }
//         if (instance.socket && instance.socket.readyState === 0) {
//           return; // connecting
//         }
//         if (instance.socket && instance.socket.readyState === 3) {
//           return; // closing
//         }

//         instance.socket = new WebSocket(path + (Object.keys(q).length > 0 ? "?" + qs : ""), ["websocket"]);
//         instance.socket.onopen = function (ev: any) {
//           const message = "WebSocket connection id: " + (instance.id ? instance.id : __id) + " established.";
//           const section = "WebSocket";

//           debug === true &&
//             console.log(
//               `%cFabizi%c${section}%c${message}`,
//               "color: #fff; background: #000;padding:2px;border:1px solid #000;border-top-left-radius:2px;1px solid #000;border-bottom-left-radius:2px; ",
//               "color: #000; background: #fff; padding:2px;border:1px solid #000;border-top-right-radius:2px;1px solid #000;border-bottom-right-radius:2px;",
//               "margin-left:4px;  color: #000; background: #fff; padding:2px;"
//             );

//           // Run the open function
//           instance.onopen && instance.onopen(ev);
//         };

//         instance.socket.onclose = function (e: any) {
//           debug === true && console.log("WebSocket disconnected id: " + (instance.id ? instance.id : __id));
//           switch (e.code) {
//             // Normal closure
//             case 1000:
//               if (debug) {
//                 console.log(`[WebSocket]: ${instance.id} Closed.`);
//               }
//               break;

//             // Abnormal closure
//             default:
//               instance.reconnect(e);
//               break;
//           }

//           // Run onclose event
//           instance.onclose && instance.onclose(e);
//         };

//         instance.socket.onerror = function (e: any) {
//           debug === true && console.error("Socket error", e);
//           switch (e.code) {
//             // Try and reconnect
//             case "ECONNREFUSED":
//               instance.reconnect(e);
//               break;

//             // Otherwise run error
//             default:
//               instance.onerror && instance.onerror(e);
//               break;
//           }
//         };

//         instance.socket.onmessage = (ev: MessageEvent<any>) => {
//           debug === true && console.log("Socket data " + instance.id, ev.target, ev.type, ev.timeStamp);
//           if (ev.type === "message") {
//             const d = JSON.parse(ev.data);
//             if (d.event) {
//               for (const evt of instance.events[d.event] || []) {
//                 evt(d.data);
//               }
//             }
//           }
//         };

//         return new Promise<void>((resolve, reject) => {
//           const timer = setInterval(() => {
//             if (instance.socket.readyState === 1) {
//               clearInterval(timer);
//               resolve();
//             }
//           }, 100);
//         });
//       }
//     };
//     if (autoConnect === true) {
//       instance.connect();
//     }
//     return instance as SocketClient;
//   }


// sokcet
// construction of websocket
const url = "";
const protocol = "";
const websocket = new WebSocket(url,protocol)


//close event is fired when a connection with a websocket is closed
//you might want to know the connection has been closed so that you can update the UI or save data
websocket.addEventListener('close',(event)=>{
    console.log('the connection has been closed successfully.')
})

//errorevent is fired when a connection with a WebSocket has been closed due to an error (some data couldn't be sent for example).
websocket.addEventListener("error",(event)=>{
    console.log('websocket error:', event)
})

//message event is fired when data is received through a WebSocket.
websocket.addEventListener('message',(event)=>{
    console.log("message from server",event)
})

//open event is fired when a connection with a websokcet is opend
websocket.addEventListener("open",(event)=>{
    websocket.send('Hello Server!');
    console.log('hello server',event)
})


//websocket.onclose properties ---> the websocket.onclose property is an event handler that is called when the websocket connection's readyStatus change to CLOSED 
websocket.onclose = function(event){
    console.log('websocket is closed now');
}

//WebSocket.onopen property is an event handler that is called when the WebSocket connection's readyState changes to 1; this indicates that the connection is ready to send and receive data. It is called with an Event.
websocket.onopen = function(event){
    console.log('websocket is open now')
}




//websocket.close() method closes the websocket connection or connection attempt, if the connection is already CLOSED, this method does nothing

//a numberic value indicating the status code explaining why the connection is being closed. if this parameter is not specified a default value of 1005 is assumed. 
const code = 1005

// a string expalining why the connection is closing. this string must be no longor than 123 bytes of UFT-8 test(not characters).
const reason = ""

websocket.close(code,reason)














