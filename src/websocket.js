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
let images   = '';

// app callback appCB(status)
let appCB = null;

let webSocket = null;

let lastRecvStr = "";
let espBatV     = 0;
let espRssi     = 0;

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
    if(sendPwrOff > 0) {
      // sending power off always causes error
      keepWebsockClosed = true;
      websocket.close();
      console.log("Powered off -- websocket closed");
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
 
 let lastSendStr = null;

const sendWSObj = async(obj) => {
  let str;
  try{ str = JSON.stringify(obj); }
  catch(e) {
    console.log(`Error stringifying obj ${obj} in sendWSObj: ${e.message}`);
    return;
  }
  try{ await webSocket.send(str); }
  catch(e) {
    console.log(`Error sending string "${str}" in sendWSObj: ${e.message}`);
  }
  if(str != lastSendStr) {
    console.log(`<-- msg sent: ${str}`);
    lastSendStr = str;
  }
}

export const initWebsocket = 
       async (hostnameIn, imagesIn, appCBIn) => {
  hostname = hostnameIn;
  images   = imagesIn;
  appCB    = appCBIn;
  
  connectToWs();

  const reportCmd = new Object();
  reportCmd[fcReport] = 0;
  setInterval( async() => {
    if(webSocketOpen) sendWSObj(reportCmd);
  },5000);
}

// export sendStop = async () => {

// }