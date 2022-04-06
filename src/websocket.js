
// commands to bot
const fcStopCmd          = 's';
const fcSpeedCmd         = 'v';
const fcYawCmd           = 'y';
const fcPowerOff         = 'p';

// status returned from bot
const fcRssi             = 'W';
const fcBatV             = 'B';
const fcSpeed            = 'S';
const fcSpeedErrInt      = 'I';
const fcYawErrInt        = 'J';
const fcLeftMotorPwm     = 'L';
const fcRightMotorPwm    = 'R';
const fcError            = 'E';

let webSocket = null;

const wsRecv = (event) => {
  // // if(event.data != lastRecvStr) {
  //   console.log(`--> msg recvd ${event.data}`);
  //   lastRecvStr = event.data;
  // // }
  if(event.data[0] != "{") {
    console.log('event.data[0] != "{"', event.data);
    return;
  }
  const res = JSON.parse(event.data);
  if(res.batV)
    console.log(`--> msg recvd ${event.data}`);

  if(res.hdlAck  == hdlCmd)     sendHdlCmd  = false;
  if(res.pwrAckL == pwrCmdL)    sendPwrCmdL = false;
  if(res.pwrAckR == pwrCmdR)    sendPwrCmdR = false;
  if(res.pwrAckL == BRAKE_CODE) sendBrakeL  = false;
  if(res.pwrAckR == BRAKE_CODE) sendBrakeR  = false;

  if(res.batV && Math.abs(res.batV - espBatV) > .03) {
    const batV = +res.batV;
    let id;
    // total range 2.7 to 4.2
    if(     batV < 3.00) id =   0;
    else if(batV < 3.45) id =  20;
    else if(batV < 3.60) id =  40;
    else if(batV < 3.70) id =  60;
    else if(batV < 3.85) id =  80;
    else                 id = 100; 
    batImgEle.setAttribute('src', `${imgDir}bat-${id}.png`);
    hdrEle.style.backgroundColor = (id == '0' ? 'red': 'white');
    espBatV = batV;
  }
  if(res.rssi && Math.abs(res.rssi - espRssi) > 3) {
    const rssi = +res.rssi;
    let id;
    if(     rssi < -80) id = 1; // -99 to -81, 0 bars       -- worked at -90 by garage
    else if(rssi < -70) id = 2; // -80 to -71, 1 bar  (dot)
    else if(rssi < -60) id = 3; // -70 to -61, 2 bars (dot & 2 bars)
    else if(rssi < -50) id = 4; // -60 to -51, 3 bars (dot & 3 bars)
    else                id = 5; // -50 and up, 4 bars (max) -- measured -20 at router
    wifiImgEle.setAttribute('src', `${imgDir}wifi-${id-1}.png`);
    hdrEle.style.backgroundColor = (id < 2 ? 'red': 'white');
    espRssi = rssi;
  }
}

const connectToWs = async (ip) => {
  waitingToRetry = false;
  console.log("trying to open websocket");
  webSocket = new WebSocket(`ws://${ip}:81`);

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
    clrSendFlags();
    webSocketOpen = false;
    if(!waitingToRetry && !keepWebsockClosed) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });
}

export const initWebsocket = async (ip) => {
  connectToWs(ip);
}

// export sendStop = async () => {

// }