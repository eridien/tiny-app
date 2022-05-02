// commands to bot
const fcReport    = 'R';
const fcVelCmd    = 'V';
const fcYawCmd    = 'Y';
const fcStopCmd   = 'S';
const fcPowerOff  = 'P';
const fcCalibrate = 'C';

// set motion constants
const fcYawPkS     = 'M';
const fcYawIkS     = 'N';
const fcMaxYawIkS  = 'O';
const fcBoostKS    = 'Q';

let hostname = '';

// app callback appCB(status)
let appCB       = null;
let webSocket   = null;


//////////////  RECEIVE  /////////////////

let lastRecvStr = "";
let lastRecvVal = {};

let sendNow     = false;
const wsRecv = (event) => {
  const recvdStr = event.data;
  if(recvdStr[0] != "{") {
    if(recvdStr[1] != "}") 
      console.log(`--> MSG: ${recvdStr}`);
    return;
  }
  sendNow = true;
  let res;
  try { res = JSON.parse(recvdStr); }
  catch(e) {
    console.log(`Error parsing JSON ` +
                `from bot:', "${recvdStr}"`);
    return;
  }
  if(appCB) {
    const chgdVals    = {};
    let   haveChgdVal = false;
    for(const fcCode in res) {
      if(res[fcCode] != lastRecvVal[fcCode]) {
        chgdVals[fcCode]    = res[fcCode];
        lastRecvVal[fcCode] = res[fcCode];
        haveChgdVal = true;
      }
    }
    if(haveChgdVal) {
      console.log("---> recvd", chgdVals);
      appCB(chgdVals);
    }
  }
}

//////////////  SEND  /////////////////

let pendingCmds   = null;
let sentPwrOff    = false;
let websocketOpen = false;

const sendAllCmds = async () => {
  if(!websocketOpen || pendingCmds === null) return;
  const str = JSON.stringify(pendingCmds);
  try{
    await webSocket.send(str);
    sentPwrOff = (pendingCmds?.[fcPowerOff] !== undefined);
    pendingCmds = null;
    if(str != '{"R":0}')
     console.log(`<-- msg sent: ${str}`);
  }
  catch(e) {
    console.log(`Error sending string ` +
                `"${str}" in sendAllCmds: ${e.message}`);
  }
  sendNow = false;
}
const SEND_TIMEOUT = 1000;

let lastSendTime = 0;
setInterval(async () => {
  const now = Date.now();
  if(sendNow || (now-lastSendTime) > SEND_TIMEOUT) {
    sendAllCmds();
    lastSendTime = now;
  }
}, 100);

const lastFcVal = {};

const send = (code, val = null) => {
  // console.log(`send:`, {code, val});
  if(val === lastFcVal[code]) return;
  const sendVal = (val === null ? 0 : val);
  if(pendingCmds === null) 
    pendingCmds = {[code]: sendVal};
  else
    pendingCmds[code] = sendVal;
  if(val !== null) lastFcVal[code] = val;
  if(code == fcReport || code == fcCalibrate) 
      sendAllCmds();
}

export const setVel = vel => {
               console.log('sending vel to bot', vel);
               send(fcVelCmd, vel);
             }
export const setYaw = yaw => {
               console.log('sending yaw to bot', yaw.toFixed(2));
               send(fcYawCmd, yaw);
             }
export const stop = () => {
               console.log('sending stop to bot');
               send(fcStopCmd);
             };
export const pwrOff = () => {
               console.log('sending pwroff to bot');
               send(fcPowerOff);
             };
             
export const setYawPk = yawPk => {
               console.log(
                  'sending yawPk to bot', yawPk);
               send(fcYawPkS, yawPk);
             }
export const setYawIk = yawIk => {
               console.log(
                  'sending yawIk to bot', yawIk);
               send(fcYawIkS, yawIk);
             }
export const setMaxYawIk = maxYawIk => {
               console.log(
                  'sending maxYawIk to bot', maxYawIk);
               send(fcMaxYawIkS, maxYawIk);
             }
export const setBoostK = boostK => {
               console.log(
                  'sending boostK to bot', boostK);
               send(fcBoostKS, boostK);
             }

export const calibrate = () => {
               console.log('sending calibrate to bot');
               send(fcCalibrate);
             };
             

//////////////  MANAGE WEBSOCKET  /////////////////

let waitingToRetry = false;

const connectToWs = async () => {
  waitingToRetry = false;
  console.log("trying to open websocket");
  webSocket = new WebSocket(`ws://${hostname}:81`);

  webSocket.onmessage = wsRecv;

  webSocket.addEventListener('open', (event) => {
    console.log('webSocket connected:', event);
    websocketOpen = true;
    appCB({websocketOpen});
    pendingCmds   = null;
  });

  webSocket.addEventListener('error', (event) => {
    console.log('webSocket error:', event);
    websocketOpen = false;
    appCB({websocketOpen});
    pendingCmds = null;
    if(sentPwrOff) {
      // sending power off always causes error
      webSocket.close();
      console.log("Powered off -- websocket closed");
      sentPwrOff = false;
      return;
    }
    if(!waitingToRetry) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });

  webSocket.addEventListener('close', (event) => {
    console.log('webSocket closed:', event);
    websocketOpen = false;
    appCB({websocketOpen});
    pendingCmds = null;
    if(!waitingToRetry) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });
}

const REPORT_INTERVAL = 250;

//////////////  INIT  /////////////////

export const initWebsocket = 
  async (hostnameIn, appCBIn) => {
    hostname = hostnameIn;
    appCB    = appCBIn;
    connectToWs();
    setInterval(send, REPORT_INTERVAL, fcReport);
  };
