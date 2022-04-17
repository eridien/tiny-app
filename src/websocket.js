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

let hostname = '';

// app callback appCB(status)
let appCB       = null;
let webSocket   = null;


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
    console.log(`Error parsing JSON ` +
                `from bot:', "${event.data}"`);
    return;
  }
  if(appCB) appCB(res);
}

//////////////  SEND  /////////////////

let pendingCmds = null;
let sentPwrOff  = false;

let lastSendStr = null;
setInterval(async () => {
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

const addCommand = (code, val = 0) => {
  if(pendingCmds === null) 
    pendingCmds = {[code]: val};
  else
    pendingCmds[code] = val;
}

export const setAccel = (accel) => 
                      addCommand(fcAccelCmd, accel);
export const setYaw   = (yaw) => 
                      addCommand(fcYawCmd,   yaw);
export const stop     = () => {
                        console.log('STOP');
                        addCommand(fcStopCmd);
                      };
export const pwrOff   = () => addCommand(fcPowerOff);

// debug PID (PI) tuning
export const setAccelPk = (accelPk) => 
                      addCommand(fcAccelPk, accelPk);
export const setAccelIk = (accelIk) => 
                      addCommand(fcAccelIk, accelIk);
export const setYawPk = (yawPk) => 
                      addCommand(fcYawPk, yawPk);
export const setYawIk = (yawIk) => 
                      addCommand(fcYawIk, yawIk);


//////////////  MANAGE WEBSOCKET  /////////////////

let webSocketOpen  = false;
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

//////////////  INIT  /////////////////

export const initWebsocket = 
  async (hostnameIn, appCBIn) => {
    hostname = hostnameIn;
    appCB    = appCBIn;
    connectToWs();
    setInterval(addCommand, 100, fcReport);
  };
