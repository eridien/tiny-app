
const YAW_IK = 1;
const YAW_PK = 1;

// commands to bot
const fcReport      = 'R';
const fcAccelCmd    = 'V';
const fcYawCmd      = 'Y';
const fcStopCmd     = 'S';
const fcPowerOff    = 'P';
const fcYawPk       = 'M';
const fcYawIk       = 'N';

let hostname = '';

// app callback appCB(status)
let appCB       = null;
let webSocket   = null;


//////////////  RECEIVE  /////////////////

let lastRecvStr = "";
let sendNow     = false;
const wsRecv = (event) => {
  if(event.data != lastRecvStr) {
    console.log(`--> msg recvd: ${event.data}`);
    lastRecvStr = event.data;
  }
  if(event.data[0] != "{") {
    // non-json msg received, it was logged above
    return;
  }
  sendNow = true;
  let res;
  try {
    res = JSON.parse(event.data);
  }
  catch(e) {
    console.log(`Error parsing JSON ` +
                `from bot:', "${event.data}"`);
    return;
  }
  if(appCB) appCB(res);
}

//////////////  SEND  /////////////////

let pendingCmds   = null;
let sentPwrOff    = false;
let webSocketOpen = false;

const sendAllCmds = async () => {
  if(!webSocketOpen || pendingCmds === null) return;
  const str = JSON.stringify(pendingCmds);
  try{
    await webSocket.send(str);
    sentPwrOff = (pendingCmds[fcPowerOff] !== undefined);
    pendingCmds = null;
    if(str != '{"R":0}')
     console.log(`<-- msg sent: ${str}`);
  }
  catch(e) {
    console.log(`Error sending string ` +
                `"${str}" in sendWSObj: ${e.message}`);
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
  if(code == fcReport) sendAllCmds();
}

export const setAccel = accel => {
              //  console.log('sending accel to bot', accel);
               send(fcAccelCmd, accel);
             }
export const setYaw = yaw => {
              //  console.log('sending yaw to bot', yaw);
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

// debug PID (PI) tuning
export const setYawPk = yawPk => send(fcYawPk, YAW_PK);
export const setYawIk = yawIk => send(fcYawIk, YAW_IK);


//////////////  MANAGE WEBSOCKET  /////////////////

let waitingToRetry = false;

const connectToWs = async () => {
  waitingToRetry = false;
  console.log("trying to open websocket");
  webSocket = new WebSocket(`ws://${hostname}:81`);

  webSocket.onmessage = wsRecv;

  webSocket.addEventListener('open', (event) => {
    console.log('webSocket connected:', event);
    webSocketOpen = true;
    pendingCmds   = null;
  });

  webSocket.addEventListener('error', (event) => {
    console.log('webSocket error:', event);
    webSocketOpen = false;
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
    webSocketOpen = false;
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
    send(fcYawPk, YAW_PK);
    send(fcYawIk, YAW_IK);
    setInterval(send, REPORT_INTERVAL, fcReport);
  };
