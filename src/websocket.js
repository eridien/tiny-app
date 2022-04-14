// commands to bot
const fcReport      = 'R';
const fcStopCmd     = 'S';
const fcAccelCmd    = 'V';
const fcYawCmd      = 'Y';
const fcAccelPk     = 'K';
const fcAccelIk     = 'L';
const fcYawPk       = 'M';
const fcYawIk       = 'N';
const fcPowerOff    = 'P';

// status from bot
const fcBatV        = 'b';
const fcTime        = 't';
const fcElapsedMs   = 'm';
const fcRssi        = 'w';
const fcAccelX      = 'a';
const fcYawRate     = 'y';
const fcAccelErrInt = 'i';
const fcYawErrInt   = 'j';
const fcLeftPwm     = 'l';
const fcRightPwm    = 'r';
const fcError       = 'e';

let hostname = '';

// app callback appCB(status)
let appCB       = null;
let webSocket   = null;
let sentPwrOff  = false;

//////////////  RECEIVE  /////////////////

let lastRecvStr = "";

const wsRecv = (event) => {
  if(event.data != lastRecvStr) {
    console.log(`--> msg recvd: ${event.data}`);
    lastRecvStr = event.data;
  }
  if(event.data[0] != "{") {
    // Non-json msg received, it was logged above
    return;
  }
  let res;
  try {
    res = JSON.parse(event.data);
  }
  catch(e) {
    console.log(`Error parsing JSON from bot:', "${event.data}"`);
    return;
  }
  if(appCB) appCB(res);
}

//////////////  MANAGE WEBSOCKET  /////////////////

let waitingToRetry    = false;
let webSocketOpen     = false;
let keepWebsockClosed = false;

const connectToWs = async () => {
  waitingToRetry = false;
  console.log("trying to open websocket");
  webSocket = new WebSocket(`ws://${hostname}:81`);

  webSocket.addEventListener('open', (event) => {
    console.log('webSocket connected:', event);
    webSocketOpen = true;
  });

  webSocket.onmessage = wsRecv;

  webSocket.addEventListener('error', (event) => {
    console.log('webSocket error:', event);
    webSocketOpen = false;
    if(sentPwrOff) {
      // sending power off always causes error
      keepWebsockClosed = true;
      websocket.close();
      console.log("Powered off -- websocket closed");
      sendPwrOff = false;
      return;
    }
    if(!waitingToRetry) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });

  webSocket.addEventListener('close', (event) => {
    console.log('webSocket closed:', event);
    webSocketOpen = false;
    if(!waitingToRetry && !keepWebsockClosed) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });
}

//////////////  SEND  /////////////////

let pendingCmds = null;

const addCommand  = (code, val) => {
  if(val === undefined) val = 0; 
  if(pendingCmds === null) 
    pendingCmds = {[code]: val};
  else
    pendingCmds[code] = val;
}

let lastSendStr = null;
setInterval(() => {
  if(!webSocketOpen || pendingCmds === null) return;
  const str = JSON.stringify(pendingCmds);
  try{
    await webSocket.send(str);
    sentPwrOff = (pendingCmds[fcPowerOff] !== undefined);
    pendingCmds = null;
    if(str != lastSendStr) {
      console.log(`<-- msg sent: ${str}`);
      lastSendStr = str;
    }
  }
  catch(e) {
    console.log(`Error sending string ` +
                `"${str}" in sendWSObj: ${e.message}`);
  }
},500);

export const setAccel = (accel) => 
                      addCommand(fcAccelCmd, accel);
export const pwrOff = addCommand(fcPowerOff);


//////////////  INIT  /////////////////

export const initWebsocket = 
       async (hostnameIn, appCBIn) => {
  hostname = hostnameIn;
  appCB    = appCBIn;
  connectToWs();
  setInterval(addCommand, [5000, reportCmd]);
}
