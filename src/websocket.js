const SHOW_SENDS      = false;
const SHOW_RECVS      = false;
const REPORT_INTERVAL =   200;

// commands to bot
const fcReport      = 'R';
const fcReportAll   = 'Q';

const fcVelCmd      = 'V';
const fcYawCmd      = 'Y';
const fcClrYawCmd   = 'X';
const fcStopCmd     = 'S';
const fcResetCmd    = 'U';
const fcPowerOffCmd = 'P';
const fcCalibrate   = 'C';
const fcNameS       = 'N';

// set motion constant commands
const fcYawPkS       = 'F';
const fcYawIkS       = 'G';
const fcMaxYawIkS    = 'H';
const fcBoostMsS     = 'J';
const fcBoostPwmS    = 'M';

let hostname = '';

// app callback appCB(status)
let appCB       = null;
let webSocket   = null;


//////////////  RECEIVE  /////////////////

let lastRecvVal    = {};
let sendNow        = false;
let waitingToRetry = false;
let wsBlocked      = false;

const stateNamesByCode = {};

const wsRecv  = (event) => {
  const recvdStr = event.data;
  if(recvdStr[0] != "{") {
    if(recvdStr[1] != "}") {
      // we have a plain-text, non-json, message
      console.log(`--> MSG: ${recvdStr}`);
      if(recvdStr == 'newer connection') {
        appCB?.({newerConn:true});
        waitingToRetry = false;
        wsBlocked      = true;
      }
    }
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
    const chgdVals           = {};
    let   haveChgdVal        = false;
    let   haveWBChgdVal = false;
    for(const fcCode in res) {
      if(res[fcCode] != lastRecvVal[fcCode]) {
        chgdVals[fcCode]    = res[fcCode];
        lastRecvVal[fcCode] = res[fcCode];
        haveChgdVal = true;
        if(fcCode != 'b' && fcCode != 'w') 
          haveWBChgdVal = true;
      }
    }
    if(haveChgdVal) {
      if(SHOW_RECVS && haveWBChgdVal) {
        let str = '{';
        for (let fc in chgdVals) {
          let name = stateNamesByCode[fc]?.slice(2);
          if(!name) name = fc;
          const val  = chgdVals[fc];
          str += `${name}:${val}, `;
        }
        str = str.slice(0,-2) + '}';
        console.log("--> recvd", str);
      }
      appCB?.(chgdVals);
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
    sentPwrOff = (pendingCmds?.[fcPowerOffCmd] !== undefined);
    pendingCmds = null;
    if(SHOW_SENDS && str != '{"R":0}')
     console.log(`<-- msg sent: ${str}`);
  }
  catch(e) {
    console.log(`Error sending string ` +
                `"${str}" in sendAllCmds: ${e.message}`);
  }
  sendNow = false;
}

const SEND_TIMEOUT = 1000;
let   lastSendTime = 0;

setInterval(async () => {
  const now = Date.now();
  if(sendNow || (now-lastSendTime) > SEND_TIMEOUT) {
    sendAllCmds();
    lastSendTime = now;
  }
}, 100);

const lastFcVal = {};

const send = (code, val = null) => {
  if(val === lastFcVal[code]) return;
  const sendVal = (val === null ? 0 : val);
  if(pendingCmds === null) 
    pendingCmds = {[code]: sendVal};
  else
    pendingCmds[code] = sendVal;
  if(val !== null) lastFcVal[code] = val;
  if(code == fcReport    || code == fcStopCmd ||
     code == fcReportAll || code == fcCalibrate) 
      sendAllCmds();
}

export const setVel = vel => {  // 0 to 100%
               vel = Math.round(vel);
               console.log('sending vel to bot', 
                            Math.round(vel * 1000));
               send(fcVelCmd, vel);
             }
export const setYaw = heading => {
               heading = Math.round(heading);
              //  console.log('sending heading to bot', heading);
               send(fcYawCmd, heading);
             }
export const clrYaw = () => {
              //  console.log('sending clrYaw to bot');
               send(fcClrYawCmd);
             }
export const stop = () => {
               console.log('sending stop to bot');
               send(fcStopCmd);
             };
export const reset = () => {
               console.log('sending reset to bot');
               send(fcResetCmd);
             };
export const pwrOff = () => {
               console.log('sending pwroff to bot');
               send(fcPowerOffCmd);
             };
             
export const setYawPk = yawPk => {
               console.log(
                  'sending yawPk to bot', yawPk);
               send(fcYawPkS, Math.round(yawPk * 1000));
             }
export const setYawIk = yawIk => {
               console.log(
                  'sending yawIk to bot', yawIk);
               send(fcYawIkS, Math.round(yawIk * 1000));
             }
export const setMaxYawIk = maxYawIk => {
               console.log(
                  'sending maxYawIk to bot', maxYawIk);
               send(fcMaxYawIkS, Math.round(maxYawIk * 1000));
             }
export const setBoostMs = boostMs => {
               console.log(
                  'sending boostMs to bot', boostMs);
               send(fcBoostMsS, +boostMs);
             }
export const setBoostPwm = boostPwm => {
               console.log(
                  'sending boostPwm to bot', boostPwm);
               send(fcBoostPwmS, Math.round(boostPwm * 1000));
             }
export const setName = (name) => {
               console.log(`sending name "${name}" to bot`);
               send(fcNameS, name);
             };
export const calibrate = () => {
               console.log('sending calibrate to bot');
               send(fcCalibrate);
             };
             

//////////////  MANAGE WEBSOCKET  /////////////////

const connectToWs = async () => {
  waitingToRetry = false;
  console.log("trying to open websocket");
  webSocket = new WebSocket(`ws://${hostname}:81`);

  webSocket.onmessage = wsRecv;

  webSocket.addEventListener('open', (event) => {
    wsBlocked = false;
    console.log('webSocket connected:', event);
    websocketOpen = true;
    appCB?.({websocketOpen});
    send(fcReportAll);
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
    if(!wsBlocked && !waitingToRetry) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });

  webSocket.addEventListener('close', (event) => {
    console.log('webSocket closed:', event);
    websocketOpen = false;
    appCB({websocketOpen});
    pendingCmds = null;
    if(!wsBlocked && !waitingToRetry) {
      waitingToRetry = true;
      setTimeout(connectToWs, 2000);
    }
  });
}

export const resumeWs = () => {
  wsBlocked = false;
  if(!waitingToRetry) {
    waitingToRetry = true;
    setTimeout(connectToWs, 2000);
  }
}

//////////////  INIT  /////////////////

export const initWebsocket = 
  async (hostnameIn, appCBIn) => {
    hostname = hostnameIn;
    appCB    = appCBIn;
    const fcStateCodes = appCB({fcCmds:{
      fcYawPk:       fcYawPkS, 
      fcYawIk:       fcYawIkS, 
      fcMaxYawIk:    fcMaxYawIkS, 
      fcBoostMs:     fcBoostMsS, 
      fcBoostPwm:    fcBoostPwmS, 
    }});
    for(let [name, fc] of 
          Object.entries(fcStateCodes))
      stateNamesByCode[fc] = name;
    connectToWs();
    send(fcReportAll);
    setInterval(send, REPORT_INTERVAL, fcReport);
  };
