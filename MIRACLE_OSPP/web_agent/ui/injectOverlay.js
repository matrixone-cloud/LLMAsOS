let awaitingUserResponse = false; // flag to check if the agent is awaiting user response

// disabled and enabled styles as injected style element
function injectOveralyStyles() {
  // Create a new style element
  let style = document.createElement('style');
  // Set the styles
  style.textContent = `
@import url(https://fonts.googleapis.com/earlyaccess/notosanssc.css);
    
::-webkit-scrollbar {
    width: 6px;
    border: solid 3px transparent;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.6);
    }

  .web-agent-pre-line {
    white-space: pre-line; !important;
  }

  #web-agent-closebutton{
    width:30px;
    height:30px;
    min-width:30px;
    min-height:30px;
    margin-left: auto;
    color:#EAEAEA;
    cursor: pointer;
    background: transparent;
    transition: color 0.3s; 
    border: None;
  }
  #web-agent-closebutton:hover{
    transform: scale(1.1);
  }

  #web-agent-closebutton:active{
    transform: scale(0.8);
  }
  #web-agent-restartbutton{
    width:30px;
    height:30px;
    min-width:30px;
    min-height:30px;
    margin-left: auto;
    color:#EAEAEA;
    cursor: pointer;
    background: transparent;
    transition: color 0.3s; 
    border: None;
  }
  #web-agent-restartbutton:hover{
    transform: scale(1.1);
  }

  #web-agent-restartbutton:active{
    transform: scale(0.8);
  }

  @keyframes web-agent-gradient-animation {
  0% {background-position: 100% 0%}
  100% {background-position: 15% 100%}
  }

  @keyframes web-agent-rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  @keyframes automation_highlight_fadeout_animation {
    0% { border-color: rgba(128, 0, 128, 1); }
    50% { border-color: rgba(128, 0, 128, 1); }
    100% { border-color: rgba(128, 0, 128, 0); }
  }
  
   @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .web-agent-new-message {
        animation: fadeIn 0.6s;
    }
  
  .web-agent-ui-automation-highlight {
    border-width: 2px !important;
    border-style: solid !important;
    animation: automation_highlight_fadeout_animation 5s linear 1 forwards !important;
  }

  .web-agent-processing{
  background: linear-gradient(90deg, 
                              rgba(255, 0, 255, 1) 0%,  /* Bright Magenta */
                              rgba(0, 191, 255, 1) 100%    /* Deep Sky Blue */
                              );
  background-size: 100% 200%;
  animation: web-agent-rotate 1s linear infinite;
  }
  
  .web-agent-init{
    background: darkgray;
    box-shadow: rgba(120, 120, 120, 0.3) 0px 0px 20px
  }
  
  .web-agent-done{
  background: lightgreen;
  }

  .web-agent-processingLine {
    background: linear-gradient(60deg, #FF5733, #00AEEF);
    background-size: 500% 100%;
    animation: web-agent-gradient-animation 3s linear infinite;
  }

  .web-agent-initStateLine{
  background: lightgray;
  }

  .web-agent-doneStateLine{
  background: lightgreen;
  }

  .web-agent-collapsed{
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 6vh;
  height: 6vh;
  border-radius: 50%;
  right: 1.5vw;
  bottom: 1.5vw;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 20px
  }

  .web-agent-chat-container {
    margin:1%,1%,1%,1%;
    width: 30vw;
    min-width: 350px;
    height:70vh;
    bottom: 2vh;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 6%;
    padding: 1%;
    box-sizing: border-box; 
  } 
  
  .web-agent-chat-input{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
    margin-top:1.5vh;
  }

  .web-agent-agent{
    justify-content: flex-start;
  }
  
  .web-agent-user{
    justify-content: flex-end;
  }

  #web-agent-user-input {
    flex: 1;
    padding: 3px 3px;
    border: transparent;
    width:100%;	
    resize: none;
    font-family: 'Noto Sans SC';
    font-size: 1.6vh;
    min-font-size: 12px;
    line-height: 1.5;
    display: flex; 
    vertical-align: middle;
    text-align: middle;
    align-items: center;
    justify-content: center;
    border-color: #ccc;
    background: white;
    color:#333;
    min-height: calc(1.2em * 2);
    scrollbar-width: thin;
  }

  #web-agent-user-input:focus {
    outline: none !important;
    border:0px solid transparent !important;
    box-shadow: none !important;
  }

  #web-agent-send-btn {
    cursor: pointer;
    transition: transform 0.2s ease; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background: #FF3D00; 
    border: none; 
    border-radius: 100%; 
  }

  #web-agent-send-btn:hover{
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .web-agent-highlight_overlay{
    box-shadow: 1px 1px 1px 1px rgb(50 50 50 / 40%);
    border-radius: 16px;
    border: 1px solid #E1DEE2;
    bottom:3px;
    right:5px;
    background: #FBFAFA;
  }
  .agent-highlight_overlay {
    box-shadow: none;  
    border-radius: 16px; 
    border: 1px solid rgba(225, 222, 226, 0);  
    bottom: 3px;  
    right: 5px;  
    background: rgba(251, 250, 250, 0.8);  
    display: flex;  
    flex-direction: column;  
}

  #web-agent-chat-box {
    overflow-y: auto;
    scrollbar-width: thin;
    height: 90%;
    display: flex;
    flex-direction: column;
    gap:1%;
    margin:1% 5%;
    padding-bottom:1%;
    margin-top:10%;
  }
  
  #web-agent-overlay {
    position: fixed;
    min-width: 50px;
    min-height: 50px;
    margin-left: auto;
    margin-right: auto;
    z-index:20000000;
    scrollbar-color: gray lightgray; 
    margin-bottom: 1%;
    display: flex;
    flex-direction: column;
  }

  .web-agent-input-container {
    display: flex;
    flex-direction: column;
    padding: 1%;
    height:20%;
    background: white;
    border: 1px solid #E1DEE2;
    box-shadow: 1px 1px 1px 1px rgb(50 50 50 / 40%);
    border-radius: 16px;
  }
  
  .web-agent-chat{
    width: 90%;
    color: black;
    overflow-wrap: break-word;
    font-family: 'Noto Sans SC';
    margin-top: 5px;
  }

  .web-agent-systemMessage{
    text-align: left;
    justify-content: flex-start;
    font-family: 'Noto Sans SC';
    padding: 2% 4%;
    font-size: 1.5vh;
    min-font-size: 12px;
    min-height: 30px;
    background: #EEEEEF;
    line-height: 1.7;
    border-radius: 10px;
    width:auto;
    max-width: 90%;
  }

  .web-agent-usertext{
    text-align: right;
    justify-content: flex-end;
    align-items: flex-end;
    font-family: 'Noto Sans SC';
    font-size: 1.5vh;
    min-font-size: 12px;
    padding: 2% 4%;
    line-height: 1.7;
    min-height: 30px;
    width:auto;
    background: #ECEBF3;
    border-radius: 10px;
    color: black;
  }
  
  .web-agent-agentstep{
  color: #4B4B4B;
  }
  .web-agent-agentplan{
  color: #4B4B4B;
  }
  .web-agent-agentcloud{
  color: #4B4B4B;
  }
  .web-agent-agentanswer{
  color: black;
  }
  

  .web-agent-toggle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #E1DEE2;
  transition: background-color ease 0.3s;
  align-self: center;
}
.web-agent-toggle:focus {
  border: none; !important;
  outline: none; !important;
}
.web-agent-toggle:before {
  content: "";
  display: block;
  position: absolute;
  z-index: 2;
  width: 20px;
  height: 20px;
  background: #fff;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  color: #fff;
  text-shadow: -1px -1px rgba(0,0,0,0.15);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}
.info-container-system-cloud {
  display: flex;
  align-items: left;
  margin-bottom: 5px; 
}
.info-container-user {
  display: flex;
  align-items: right;
  margin-bottom: 5px; 
}
.sender-name {
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px; 
}
.avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
}
.timestamp {
    font-size: 0.8em;
    color: #888;
    margin-left: 10px;
}
.user-info {
  align-self: flex-end;
}

.system-info {
  align-self: flex-start;
}
.user-chat {
  align-self: flex-end; 
}
.system-chat {
  align-self: flex-start; 
}

.web-agent-toggle:checked {
  background-color: #c9ffc4;
}

.web-agent-toggle:checked:before {
  left: 20px;
}
`;
  // Append the style element to the head of the document
  document.head.appendChild(style);
}
let savedSelection = null;
let show_details = true;


function showCollapsedOverlay(processing_state = "processing", steps) {
  show_details = steps;
  removeOverlay();
  window.overlay_state_changed(true);
  let collapsed_web_agent = document.createElement("div");
  collapsed_web_agent.id = "web-agent-overlay";
  collapsed_web_agent.classList.add("web-agent-collapsed");
  collapsed_web_agent.style.backgroundColor = "transparent";
  collapsed_web_agent.setAttribute("aria-hidden", "true");
  collapsed_web_agent.style.justifyContent = "center";
  let wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.justifyContent = "center";
  let logodiv= document.createElement("div");
  logodiv.style.width = "90%";
  logodiv.style.height = "90%";
  logodiv.style.left = "5%";
  logodiv.style.top = "5%";
  let borderdiv = document.createElement("div");
  borderdiv.style.width = "100%";
  borderdiv.style.height = "100%";
  borderdiv.style.borderRadius = "50%";

  let logo = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7 12C7 10 5.5 8 3.5 8C1.5 8 0 9.5 0 11.5C0 13.5 1.5 15 3.5 15C5.5 15 7 13.5 7 12Z" stroke="#827C8C" stroke-width="1.5" fill="none"/>  <path d="M17 12C17 10 18.5 8 20.5 8C22.5 8 24 9.5 24 11.5C24 13.5 22.5 15 20.5 15C18.5 15 17 13.5 17 12Z" stroke="#827C8C" stroke-width="1.5" fill="none"/>  <path d="M7 12C7 14 10 16 12 18C14 16 17 14 17 12C17 10 14 8 12 6C10 8 7 10 7 12Z" stroke="#827C8C" stroke-width="1.5" fill="none"/></svg>`;
  let encodedSvg = encodeURIComponent(logo);
  let svgUrl = 'data:image/svg+xml;utf8,' + encodedSvg;
  logodiv.style.backgroundImage = `url("${svgUrl}")`;
  logodiv.style.backgroundRepeat = "no-repeat";
  logodiv.style.backgroundSize = "contain";
  logodiv.style.borderRadius = "50%";
  logodiv.style.backgroundPosition = "center";
  logodiv.style.backgroundColor = "white";
  logodiv.style.alignSelf = "center";
  borderdiv.style.position = "absolute";
  borderdiv.style.top = "0";
  borderdiv.style.left = "0";
  borderdiv.id="WebAgentOverlayBorder";
  logodiv.style.position = "absolute";
  logodiv.style.justifySelf = "center";
  wrapper.appendChild(borderdiv);
  wrapper.appendChild(logodiv);
  collapsed_web_agent.appendChild(wrapper);
  document.body.appendChild(collapsed_web_agent);
  
  updateOverlayState(processing_state, true);
  
  let element = document.getElementById('web-agent-overlay');
  document.getElementById('web-agent-overlay').addEventListener('mouseover', function () {
    this.style.transform = 'scale(1.1)';
  });

  document.getElementById('web-agent-overlay').addEventListener('mouseout', function () {
    this.style.transform = 'scale(1)';
  });
  document.getElementById('web-agent-overlay').addEventListener('click', function () {
    let ui_state = document.getElementById("WebAgentOverlayBorder").classList.contains("web-agent-init") ? "init" : document.getElementById("WebAgentOverlayBorder").classList.contains("web-agent-processing") ? "processing" : "done";
    showExpandedOverlay(ui_state, show_details);
  });
}

function removeOverlay() {
  let element = document.getElementById("web-agent-overlay");
  if (element) {
    element.parentNode.removeChild(element);
  }
}

function clearOverlayMessages(keep_default=false) {
  try {
    let chatBox = document.getElementById('web-agent-chat-box');
    if (!chatBox) {
      return;
    }
    while (chatBox.firstChild) {
      chatBox.removeChild(chatBox.firstChild);
    }
  } catch (error) {
    //No action can be taken at this point. Just ensure subsequent messages are not affected
    console.error("Error clearing chat box", error);
  }
}

function updateOverlayState(processing_state, is_collapsed) 
{
  if (is_collapsed) {
    let borderdiv = document.getElementById("WebAgentOverlayBorder");
    if (processing_state === "init"){
      borderdiv.classList.add("web-agent-init");
      borderdiv.classList.remove("web-agent-processing");
      borderdiv.classList.remove("web-agent-done");
    }
    else if (processing_state === "processing"){
      borderdiv.classList.remove("web-agent-init");
      borderdiv.classList.add("web-agent-processing");
      borderdiv.classList.remove("web-agent-done");
    }
    else if (processing_state === "done"){
      borderdiv.classList.remove("web-agent-init");
      borderdiv.classList.remove("web-agent-processing");
      borderdiv.classList.add("web-agent-done");
    }
  } else {
    let animation = document.getElementById("WebAgentExpandedAnimation");
    if (processing_state === "init"){
      animation.classList.remove("web-agent-processingLine");
      animation.classList.add("web-agent-initStateLine");
      animation.classList.remove("web-agent-doneStateLine");
      enableOverlay();
    }
    else if (processing_state === "processing"){
      animation.classList.add("web-agent-processingLine");
      animation.classList.remove("web-agent-initStateLine");
      animation.classList.remove("web-agent-doneStateLine");
      disableOverlay();
    }
    else if (processing_state === "done"){
      animation.classList.remove("web-agent-processingLine");
      animation.classList.remove("web-agent-initStateLine");
      animation.classList.add("web-agent-doneStateLine");
      enableOverlay();
    }
  }
}

function showExpandedOverlay(processing_state = "init", show_steps=true) {
  ui_state = processing_state;
  show_details = show_steps;
  let webagent_logo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="240" height="35">
<g transform="matrix(1.3333334 0 0 1.3333334 0 0)"> <image  x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAG1gAAAPoCAYAAADXYHpTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7N0tdCJLt4DhK5FIZCQSiYxEIpFIJDIuEolERiKRyEgkEhmJRCK5a3M68w0nNXNmEgLV1c+z1mvv+u4h0139V/v/TgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMiGAWsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEA2DFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyYcAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQDQPWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAbBiwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZMOANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBsGrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANkwYA0AAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAACIIbAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEEFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiCKwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxBNYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAYAmsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAMgTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCGwBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBDYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIghsAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQQWAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGIIrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEE1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBgCawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAyBNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIIbAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEENgDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiCGwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxBBYAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYgisAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQTWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAGAJrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADIE1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAghsAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQ2ANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIIbAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEEFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiCKwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxBNYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAYAmsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAMgTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCGwBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBDYA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIghsAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQQWAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGIIrAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEE1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBgCawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAyBNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIIbAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEENgDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiCGwBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxBBYAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYgisAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQTWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAGAJrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADIE1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAghsAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQQ2ANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIIbAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEEFgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiCKwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLpdfZFNOs6sJwugAAAAASUVORK5CYII="  width="180" height="30"/></g></svg>`;

  let close_icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">  <circle cx="12" cy="12" r="11" stroke="#827C8C" stroke-width="2"/>  <line x1="7" y1="12" x2="17" y2="12" stroke="#827C8C" stroke-width="2"/></svg>`;
  let icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">  <path d="M7 12C7 10 5.5 8 3.5 8C1.5 8 0 9.5 0 11.5C0 13.5 1.5 15 3.5 15C5.5 15 7 13.5 7 12Z" stroke="#827C8C" stroke-width="1.5" fill="none"/>  <path d="M17 12C17 10 18.5 8 20.5 8C22.5 8 24 9.5 24 11.5C24 13.5 22.5 15 20.5 15C18.5 15 17 13.5 17 12Z" stroke="#827C8C" stroke-width="1.5" fill="none"/>  <path d="M7 12C7 14 10 16 12 18C14 16 17 14 17 12C17 10 14 8 12 6C10 8 7 10 7 12Z"  stroke="#827C8C" stroke-width="1.5" fill="none"/></svg>`;
  let refresh_icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12C3 16.9706 7.02944 21 12 21C14.3051 21 16.4077 20.1334 18 18.7083L21 16M21 12C21 7.02944 16.9706 3 12 3C9.69494 3 7.59227 3.86656 6 5.29168L3 8M21 21V16M21 16H16M3 3V8M3 8H8" stroke="#827C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  removeOverlay();
  window.overlay_state_changed(false);
  let newDiv = document.createElement("div");
  newDiv.id = "web-agent-overlay";
  newDiv.classList.add("agent-highlight_overlay");
  newDiv.setAttribute("aria-hidden", "true");
  newDiv.setAttribute("tabindex", "0");
  newDiv.style.backgroundColor = "transparent";

  let containerA = document.createElement("div");
  containerA.classList.add("web-agent-highlight_overlay");
  containerA.setAttribute("aria-hidden", "true");
  containerA.setAttribute("tabindex", "0");

  let header = document.createElement("div");
  header.style.display = "flex";
  header.style.flexDirection = "row";
  header.style.margin = "2%";

  let logoIcon = document.createElement("div");
  logoIcon.style.width = "25px";
  logoIcon.style.height = "25px";
  logoIcon.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(icon)}')`;
  logoIcon.style.backgroundRepeat = "no-repeat";
  logoIcon.style.backgroundSize = "contain";
  logoIcon.style.backgroundPosition = "bottom";
  logoIcon.style.order = 1;
  logoIcon.style.alignSelf = "flex-end";
  logoIcon.style.marginRight = "1%";
  header.appendChild(logoIcon);

  // fetch('http://localhost:8000/pic/icon.svg')
  //     .then(response => response.text())
  //     .then(data => {
  //         console.log(data);
  //         webagent_logo = data;
  //         let logoDiv = document.createElement("div");
  //         logoDiv.style.width = "240px";
  //         logoDiv.style.height = "30px";
  //         logoDiv.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(webagent_logo)}')`;
  //         logoDiv.style.backgroundRepeat = "no-repeat";
  //         logoDiv.style.backgroundSize = "contain";
  //         logoDiv.style.backgroundPosition = "bottom";
  //          // Style the logoDiv and button
  //         logoDiv.style.order = 1;
  //         header.appendChild(logoDiv);
  //     })
  //     .catch(error => console.error('Error loading SVG:', error));
  let logoDiv = document.createElement("div");
  logoDiv.style.width = "240px";
  logoDiv.style.height = "30px";
  logoDiv.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(webagent_logo)}')`;
  logoDiv.style.backgroundRepeat = "no-repeat";
  logoDiv.style.backgroundSize = "contain";
  logoDiv.style.backgroundPosition = "bottom";
  // Style the logoDiv and button
  logoDiv.style.order = 1;
  header.appendChild(logoDiv);

  let restartButton = document.createElement("button");
  restartButton.id = "web-agent-restartbutton";
  restartButton.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(refresh_icon)}')`;
  restartButton.style.backgroundRepeat = "no-repeat";
  restartButton.style.backgroundSize = "contain";
  restartButton.style.backgroundPosition = "bottom";
  restartButton.onclick = function () {
      if (typeof window.restart_command === 'function') {
        window.restart_command();  // Call the exposed Python function
    } else {
        console.error("restart_command is not available yet.");
    }
};
  restartButton.style.order = 3;

  let closeButton = document.createElement("button");
  closeButton.id = "web-agent-closebutton";
  closeButton.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(close_icon)}')`;
  closeButton.style.backgroundRepeat = "no-repeat";
  closeButton.style.backgroundSize = "contain";
  closeButton.style.backgroundPosition = "bottom";
  closeButton.onclick = function () {
    let ui_state = document.getElementById("WebAgentExpandedAnimation").classList.contains("web-agent-initStateLine") ? "init" : document.getElementById("WebAgentExpandedAnimation").classList.contains("web-agent-processingLine") ? "processing" : "done";
    showCollapsedOverlay(ui_state, show_details);
  };
  closeButton.style.order = 3;

  header.appendChild(restartButton);

  let animation = document.createElement("div");
  animation.id = "WebAgentExpandedAnimation";
  animation.style.height = "2px";
  animation.style.width = "100%";

  header.appendChild(closeButton);
  // Append the close button to the newDiv
  containerA.appendChild(header);

  let chatContainer = document.createElement("div");
  chatContainer.className = "web-agent-chat-container";

  let chatBox = document.createElement("div");
  chatBox.id = "web-agent-chat-box";

  let chatInput = document.createElement("div");
  chatInput.className = "web-agent-chat-input";
  chatBox.appendChild(chatInput);

  let inputContainer = document.createElement("div");
  inputContainer.className = "web-agent-input-container";
  inputContainer.id = "web-agent-input-container";
  let userInput = document.createElement("textarea");
  userInput.id = "web-agent-user-input";
  userInput.placeholder = "What can I help you solve today?";
  userInput.addEventListener('input', function (event) {
    let text = event.target.value;
    if (text.trim() == "") {
      let button_disabled_svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">  <circle cx="20" cy="20" r="20" fill="#EEEEEF"/>  <path d="M10 20L30 10L22 30L18 22L10 20Z" stroke="#AEA9B4" stroke-width="1.5" fill="none"/></svg>`;
      let sendBtn = document.getElementById('web-agent-send-btn');
      sendBtn.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(button_disabled_svg)}')`;
    } else {
      let button_enabled_svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">  <circle cx="20" cy="20" r="20" fill="#252539"/> <path d="M10 20L30 10L22 30L18 22L10 20Z" stroke="white" stroke-width="1.5" fill="none"/></svg>`;
      let sendBtn = document.getElementById('web-agent-send-btn');
      sendBtn.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(button_enabled_svg)}')`;
    }
  });
  let userinput_footer = document.createElement("div");
  userinput_footer.style.display = "flex";
  userinput_footer.style.flexDirection = "row";
  userinput_footer.style.justifyContent = "space-between";
  userinput_footer.style.alignItems = "center";
  userinput_footer.style.height = "40%";
  userinput_footer.style.margin = "2% 1%";
  userinput_footer.id = "userinput_section"

  let toggleLabel = document.createElement("label");  // Create a new label element
  toggleLabel.textContent = "Show More details";  // Set the text content of the label
  toggleLabel.style.color = "#6B6673";  // Set the color of the label
  toggleLabel.style.fontFamily = "Noto Sans SC";  // Set the font of the label
  toggleLabel.style.fontSize = "14px";  // Set the font size of the label
  toggleLabel.style.fontWeight = "400";  // Set the font weight of the label
  toggleLabel.style.margin = "0px";  // Add some margin to the right of the label
  toggleLabel.style.marginRight = "10px";  // Add some margin to the right of the label

  let toggleSwitch = document.createElement("input");

  toggleSwitch.type = "checkbox";
  toggleSwitch.className = "web-agent-toggle";
  toggleSwitch.style.width = "44px";
  toggleSwitch.style.height = "24px";
  toggleSwitch.style.margin = "0px";

  if (show_details) {
    toggleSwitch.checked = true;
  } else {
    toggleSwitch.checked = false;
  }

  toggleSwitch.addEventListener('change', function () {
    if (this.checked) {
      show_details = true;
      window.show_steps_state_changed(true)
    } else {
      show_details = false;
      window.show_steps_state_changed(false)
    }
  });

  let sendicon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">  <circle cx="20" cy="20" r="20" fill="#EEEEEF"/>  path d="M10 20L30 10L22 30L18 22L10 20Z" stroke="#AEA9B4" stroke-width="1.5" fill="none"/></svg>`;
  let sendBtn = document.createElement("div");
  sendBtn.id = "web-agent-send-btn";
  sendBtn.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(sendicon)}')`;
  sendBtn.style.backgroundRepeat = "no-repeat";
  sendBtn.style.backgroundSize = "contain";
  sendBtn.style.backgroundPosition = "right";
  sendBtn.style.width = "8%";
  sendBtn.style.height = "100%";
  sendBtn.style.marginLeft = "auto";

  userinput_footer.appendChild(toggleSwitch);
  userinput_footer.appendChild(toggleLabel);  // Add the label to the div
  userinput_footer.appendChild(sendBtn);

  inputContainer.appendChild(userInput);
  inputContainer.appendChild(userinput_footer);

  chatContainer.appendChild(chatBox);
  // chatContainer.appendChild(inputContainer);

  containerA.appendChild(chatContainer);

  let disclaimer = document.createElement("p");
  disclaimer.style.fontFamily = "Noto Sans SC";
  disclaimer.style.fontSize = "12px";
  disclaimer.style.color = "#6B6673";
  disclaimer.style.alignSelf = "center";
  disclaimer.style.margin = "1% 3% 1% 1%";
  disclaimer.textContent = "The MIRACLE may make mistakes. Verify infomation.";

  containerA.appendChild(animation);
  containerA.appendChild(disclaimer);
  newDiv.appendChild(containerA);
  newDiv.appendChild(inputContainer);
  document.body.appendChild(newDiv);
  updateOverlayState(processing_state, false);
  document.getElementById('web-agent-send-btn').addEventListener('click', function () {
    let task = document.getElementById('web-agent-user-input').value
    let task_trimmed = task.trim();
    if (task_trimmed && !isDisabled() && task_trimmed.length > 0) {
      if (awaitingUserResponse) {
        addUserMessage(task);
        document.getElementById('web-agent-user-input').value = "";
      } else {
        clearOverlayMessages();
        addUserMessage(task);
        disableOverlay();
        window.process_task(task)
        document.getElementById('web-agent-user-input').value = "";
      }
    } else {
      console.log("Empty message no task to send");
    }
  });

  userInput.addEventListener('focus', function () {
    if (window.getSelection().rangeCount > 0) {
      let selectedText = window.getSelection().toString();
      if (selectedText) {
        document.getElementById('web-agent-user-input').value = selectedText + '\n';
        setTimeout(function () {
          userInput.selectionStart = userInput.selectionEnd = userInput.value.length;
          userInput.scrollTop = userInput.scrollHeight;
        }, 0);

      }
    }
  });

  userInput.addEventListener('blur', function () {
    if (savedSelection) {
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  });

  document.getElementById('web-agent-user-input').addEventListener('keydown', function (event) {
    // Check if the pressed key is the Enter key
    if (event.key === "Enter") {
      event.preventDefault();

      let targetElement = document.getElementById('web-agent-send-btn');

      // Create a new click event
      let clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });

      // Dispatch the click event on the send button
      targetElement.dispatchEvent(clickEvent);
    }
  });
  focusOnOverlayInput();
}


function focusOnOverlayInput() {
  document.getElementById('web-agent-user-input').focus();
}

function addMessage(message, sender, message_type = "plan") {
  let userAvatarSVG = '<svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="20" cy="20" r="20" fill="#4A90E2"/> <path d="M20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10Z" fill="white"/> <path d="M10 32C10 26.4772 14.4772 22 20 22H20.0986C25.5228 22 30 26.4772 30 32H10Z" fill="white"/> </svg>'
  let systemAvatarSVG = '<svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="40" height="40" rx="8" fill="url(#grad1)" /> <defs> <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" style="stop-color:rgb(0,128,255);stop-opacity:1" /> <stop offset="100%" style="stop-color:rgb(255,0,150);stop-opacity:1" /> </linearGradient> </defs> <path d="M16 12H24L20 28L16 12Z" fill="white" /></svg>'
  let cloudAvatarSVG = '<svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="40" height="40" rx="8" fill="url(#grad1)" /> <defs> <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" style="stop-color:rgb(0,128,255);stop-opacity:1" /> <stop offset="100%" style="stop-color:rgb(255,0,150);stop-opacity:1" /> </linearGradient></defs> <path d="M10 20C10 18 12 16 15 16C16 13 19 12 22 12C25 12 27 14 27 17C30 17 32 19 32 22C32 25 29 27 26 27H12C10 27 8 25 8 23C8 22 9 20 10 20Z" fill="white"/> </svg>'

  let newDiv = document.createElement("div");
  newDiv.classList.add("web-agent-chat-input");
  let chatDiv = document.createElement("div");
  chatDiv.classList.add("web-agent-chat");

  let encodeSvg = ''
  if(sender === "user"){
    encodeSvg = encodeURIComponent(userAvatarSVG);
  }else if(sender === "system"){
    encodeSvg = encodeURIComponent(systemAvatarSVG)
  }else if(sender === "cloud"){
    encodeSvg = encodeURIComponent(cloudAvatarSVG)
  }
  let svgUrl = 'data:image/svg+xml;utf8,' + encodeSvg;
  let avatarContainer = document.createElement("div");
    avatarContainer.classList.add("avatar");
    avatarContainer.style.backgroundImage = `url("${svgUrl}")`;
    avatarContainer.style.backgroundRepeat = "no-repeat";
    avatarContainer.style.backgroundSize = "contain";
    avatarContainer.style.width = "20px";
    avatarContainer.style.height = "20px";
    avatarContainer.style.borderRadius = "50%";

    // Create a timestamp element with the current time
    let timestamp = document.createElement("span");
    let currentDateTime = new Date();
    timestamp.classList.add("timestamp");
    timestamp.innerText = currentDateTime.toLocaleString();

    // Create the sender name element
    let name = sender === "user" ? "You" : sender === "system" ? "System" : "Cloud";
    let nameSpan = document.createElement("span");
    nameSpan.classList.add("sender-name");
    nameSpan.innerText = name;

  let infoContainer = document.createElement("div");
  if(sender === "user"){
    infoContainer.classList.add("info-container-user");
    infoContainer.appendChild(timestamp);
    infoContainer.appendChild(nameSpan);
    infoContainer.appendChild(avatarContainer);
  }else if(sender === "system"  || sender === "cloud"){
    infoContainer.classList.add("info-container-system-cloud");
    infoContainer.appendChild(avatarContainer);
    infoContainer.appendChild(nameSpan);
    infoContainer.appendChild(timestamp);
  }

  // Apply specific classes for user and system to control alignment
  if (sender === "user") {
    infoContainer.classList.add("user-info");
    chatDiv.classList.add("user-chat");
  } else if (sender === "system"  || sender === "cloud") {
    infoContainer.classList.add("system-info");
    chatDiv.classList.add("system-chat");
  }

  let parsedMessage = message;

  try {
    parsedMessage = JSON.parse(message);
  } catch (e) {
    console.log("Message is not in JSON format, using original message.");
  }

  // Customize based on the sender
  if (sender === "system") {
    newDiv.classList.add("web-agent-agent");
    chatDiv.classList.add("web-agent-systemMessage", "web-agent-pre-line");
    handleMessageType(chatDiv,message_type)
    chatDiv.textContent = parsedMessage;
  } else if (sender === "user") {
    newDiv.classList.add("web-agent-agent")
    chatDiv.classList.add("web-agent-usertext", "web-agent-pre-line");
    chatDiv.textContent = parsedMessage;
  } else if (sender === "cloud") {
    newDiv.classList.add("web-agent-cloud");
    chatDiv.classList.add("web-agent-systemMessage", "web-agent-pre-line");
    handleMessageType(chatDiv,message_type)
    chatDiv.textContent = parsedMessage;
  }
  newDiv.appendChild(infoContainer);
  newDiv.appendChild(chatDiv);

  let chatBox = document.getElementById('web-agent-chat-box');
  chatBox.appendChild(newDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
  newDiv.scrollIntoView({ behavior: 'instant' });

  if (sender === "user" && awaitingUserResponse) {
    awaitingUserResponse = false;
    // Notify the server that the user has responded to the agent's prompt
    window.process_task(message);
  }

}
function addSystemMessage(message, is_awaiting_user_response , message_type = "plan") {
  // Function to actually add the message
  function executeAddMessage() {
    awaitingUserResponse = is_awaiting_user_response;
    let sender = (message_type === "action") ? "cloud" : "system";
    addMessage(message, sender, message_type);
  }
    requestAnimationFrame(executeAddMessage);
}
// Helper function for handling message type-specific actions
function handleMessageType(chatDiv, message_type) {
    if (message_type === "step") {
        chatDiv.classList.add("web-agent-agentstep");
    } else if (message_type === "plan" || message_type === "question") {
        chatDiv.classList.add("web-agent-agentplan");
    } else if (message_type === "answer") {
        chatDiv.classList.add("web-agent-agentanswer");
    }
}
function addUserMessage(message) {
  addMessage(message, "user");
}

function disableOverlay() {
  let input_field= document.getElementById("web-agent-user-input");
  if(input_field){
    input_field.placeholder = "Please wait for processing...";
  }
}

function isDisabled() {
  if (!awaitingUserResponse) {
        let input_field = document.getElementById("web-agent-user-input");
        if (input_field) {
            return input_field.placeholder === "Please wait for processing...";
        }
    }
    return false;
}


function enableOverlay() {
    let input_field= document.getElementById("web-agent-user-input");
    if(input_field){
      input_field.placeholder = "\tSend any instruct to the agent";
    }
}

function commandExecutionCompleted() {
  console.log("Command execution completed");
}

injectOveralyStyles();