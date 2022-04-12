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
  if(res[fcBatV] && Math.abs(res[fcBatV] - espBatV) > .03) {
    const batV = res[fcBatV];
    let id;
    // total range 330 to 420
    if(     batV < 340) id =   0;
    else if(batV < 350) id =  20;
    else if(batV < 360) id =  40;
    else if(batV < 370) id =  60;
    else if(batV < 380) id =  80;
    else                id = 100; 
    batImgEle.setAttribute('src', `${images}/bat-${id}.png`);
    hdrEle.style.backgroundColor = (id == '0' ? 'red': 'white');
    espBatV = batV;
  }
  if(res.rssi && Math.abs(res.rssi - espRssi) > 3) {
    const rssi = +res.rssi;
    let id;
    if(     rssi < -80) id = 1; // -99 to -81, 0 bars -- worked at -90 by garage
    else if(rssi < -70) id = 2; // -80 to -71, 1 bar  (dot)
    else if(rssi < -60) id = 3; // -70 to -61, 2 bars (dot & 2 bars)
    else if(rssi < -50) id = 4; // -60 to -51, 3 bars (dot & 3 bars)
    else                id = 5; // -50 and up, 4 bars (max) -- measured -20 at router
    wifiImgEle.setAttribute('src', `${imgDir}wifi-${id-1}.png`);
    hdrEle.style.backgroundColor = (id < 2 ? 'red': 'white');
    espRssi = rssi;
  }
}

let waitingToRetry = false;
let webSocketOpen = false;

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
  console.log(`<-- msg sent: ${str}`);
}

export const initWebsocket = 
       async (hostnameIn, imagesIn) => {
  hostname = hostnameIn;
  images   = imagesIn;
  
  connectToWs();

  const reportCmd = new Object();
  reportCmd[fcReport] = 0;
  setInterval( async() => {
    if(webSocketOpen) sendWSObj(reportCmd);
  },1000);
}

// export sendStop = async () => {

// }