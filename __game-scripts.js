var Multiplayer=pc.createScript("multiplayer");Multiplayer.prototype.initialize=function(){this.socket=io("https://bombz-royale-server.glitch.me"),"crazygames"==window.CrazyGames.SDK.environment||"gamepix"!=window.location.hostname?this.socket=io("https://bombz-royale-server.fly.dev/"):this.socket=io("https://bombz-royale-server.glitch.me"),this.id="",this.socket.on("connect",(()=>{this.entity.findByName("Connecting").enabled=!1,this.entity.findByName("Title Screen").enabled=!0,this.entity.findByName("Game UI").enabled=!1,this.entity.findByName("Death Screen").enabled=!1,document.getElementById("username").style.display="block",document.getElementById("chatInput").style.display="none",this.id=this.socket.id,"crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.game.loadingStop()})),this.socket.on("map",(e=>{this.app.fire("map",e)})),this.socket.on("playerUpdate",(e=>{this.app.fire("playerUpdate",e,this.id)})),this.socket.on("bombUpdate",(e=>{this.app.fire("bombUpdate",e)})),this.socket.on("explosion",(e=>{this.app.fire("explosion",e)})),this.entity.findByName("Play Button").button.on("click",(()=>{this.skin=0,this.entity.findByName("Skin Selector").children.forEach((e=>{e.enabled&&(this.skin=Number(e.name))})),this.socket.emit("joined",{name:document.getElementById("username").value,skin:this.skin}),this.entity.findByName("Game UI").enabled=!0,document.getElementById("username").style.display="none",document.getElementById("chatInput").style.display="block","crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.game.gameplayStart()})),this.app.on("keys",(e=>{this.socket.emit("keyInput",e)})),this.app.on("throw",(e=>{this.socket.emit("throw",e)})),this.app.on("sendMessage",(e=>{this.socket.emit("chatMessage",e)})),this.socket.on("chat",(e=>{let t=e.name;t.length>15&&(t=t.slice(0,12)+"..."),this.entity.findByName("Content").element.text+=`\n${t}: ${e.text}`,this.entity.findByName("VerticalScrollbar").scrollbar.value=1})),this.app.on("death",(e=>{this.playerData=e})),this.app.on("adRespawn",(()=>{this.socket.emit("adRespawn",{name:document.getElementById("username").value,skin:this.skin,maxHp:this.playerData.maxHp})})),this.socket.on("buff",(e=>{if(this.entity.script.playerUpdate.playerEntities[e.id]){let t=this.entity.findByName("Buff Effect").clone();t.enabled=!0,this.entity.script.playerUpdate.playerEntities[e.id].addChild(t),t.setLocalPosition(0,0,0),setTimeout((()=>{t.destroy()}),1e3),e.id==this.socket.id&&this.app.fire("buff",e)}}))},Multiplayer.prototype.update=function(e){};var Button=pc.createScript("button");Button.attributes.add("enableElement",{type:"entity"}),Button.attributes.add("disableElement",{type:"entity"}),Button.attributes.add("scene",{type:"string"}),Button.prototype.initialize=function(){this.entity.button.on("click",(()=>{this.enableElement&&(this.enableElement.enabled=!0),this.disableElement&&(this.disableElement.enabled=!1),this.scene&&this.app.scenes.changeScene(this.scene)}))},Button.prototype.update=function(t){};var PlayerUpdate=pc.createScript("playerUpdate");PlayerUpdate.prototype.initialize=function(){this.playerEntities={},this.playerData={};let e=[new pc.Color(10/255,17/255,29/255,1),new pc.Color(131/255,0,0,1),new pc.Color(181/255,121/255,38/255,1),new pc.Color(214/255,195/255,64/255,1),new pc.Color(18/255,96/255,11/255,1),new pc.Color(15/255,15/255,64/255,1),new pc.Color(46/255,16/255,89/255,1),new pc.Color(202/255,0,1,1),new pc.Color(119/255,119/255,119/255,1)];this.app.on("playerUpdate",((t,i)=>{let a=Object.keys(t);this.playerData=t,a.forEach((a=>{if(!this.playerEntities[a]){this.playerEntities[a]=this.entity.findByName("Player").clone();let n=this.playerEntities[a];n.enabled=!0,this.entity.addChild(n);let s=t[a].position;n.setPosition(s.x,s.y,0),n.findByName("Nametag").element.text=t[a].name,n.findByName("Skin").sprite.color=e[t[a].skin],a==i&&this.app.fire("followCamera",n)}this.playerEntities[a].findByName("Crown").enabled=!1,t[a].dashing&&!this.playerEntities[a].findByName("Dash Particle").isPlaying?this.playerEntities[a].findByName("Dash Particle").particlesystem.play():t[a].dashing||this.playerEntities[a].findByName("Dash Particle").particlesystem.stop(),this.playerEntities[a].sprite.flipX=t[a].left,this.playerEntities[a].sprite.currentClip.name!=t[a].animState&&this.playerEntities[a].sprite.play(t[a].animState);let n=this.playerEntities[a].findByName("Skin");n.sprite.flipX=t[a].left,n.sprite.currentClip.name!=t[a].animState&&n.sprite.play(t[a].animState),t[a].invincible?(this.playerEntities[a].sprite.opacity=.5,n.sprite.opacity=.5):(this.playerEntities[a].sprite.opacity=1,n.sprite.opacity=1),this.playerEntities[a].findByName("Health Bar").element.width=t[a].hp/t[a].maxHp*200,this.playerEntities[a].findByName("killCount").element.text=t[a].kills,a==i&&(this.thisPlayerData={name:document.getElementById("username"),maxHp:t[i].maxHp},t[i].maxHp>5&&console.log(t[i].maxHp));let s=[],l=[...Object.values(t)];if(l=l.sort(((e,t)=>t.kills-e.kills)),this.playerEntities[l[0].id])if(this.playerEntities[l[0].id].findByName("Crown").enabled=!0,l[0].id==i)this.entity.findByName("King Pointer").enabled=!1;else{let e=this.entity.findByName("King Pointer");e.enabled=!0;let t=this.entity.findByName("Camera").getPosition(),i=this.playerEntities[l[0].id].getPosition();e.setLocalEulerAngles(0,0,180*Math.atan2(t.y-i.y,t.x-i.x)/Math.PI+90),e.findByName("Image").setEulerAngles(0,0,0)}for(let e=0;e<5;e++)if(l[e]&&l[e].name){let t=l[e].name;t.length>15&&(t=t.slice(0,12)+"..."),s.push(t+" - "+l[e].kills)}this.entity.findByName("Leaderboard Content").element.text=`1. ${s[0]||""}\n2. ${s[1]||""}\n3. ${s[2]||""}\n4. ${s[3]||""}\n5. ${s[4]||""}`})),Object.keys(this.playerEntities).forEach((e=>{t[e]||(e==i&&(this.entity.findByName("Death Screen").enabled=!0,this.entity.findByName("Game UI").enabled=!1,document.getElementById("chatInput").style.display="none",this.app.fire("death",this.thisPlayerData),"crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.game.gameplayStop()),this.playerEntities[e].destroy(),delete this.playerEntities[e])}))}))},PlayerUpdate.prototype.update=function(e){Object.values(this.playerEntities).forEach((e=>{let t=Object.keys(this.playerEntities),i=Object.values(this.playerEntities).indexOf(e),a=this.playerData[t[i]].position;e.setPosition((new pc.Vec3).lerp(e.getPosition(),new pc.Vec3(a.x,a.y,0),.5))}))};var Keybinds=pc.createScript("keybinds");Keybinds.prototype.initialize=function(){if(this.keys={},this.prevKeys={},addEventListener("keydown",(e=>{this.keys[e.key]=e.key,"Enter"==e.key&&(document.activeElement!=document.getElementById("chatInput")?document.getElementById("chatInput").focus():(this.app.fire("sendMessage",document.getElementById("chatInput").value),document.getElementById("chatInput").value="",document.getElementById("chatInput").blur()))})),addEventListener("keyup",(e=>{delete this.keys[e.key]})),this.app.mouse.on("mouseup",(e=>{let t=new pc.Vec3;this.entity.findByName("Camera").camera.screenToWorld(e.x,e.y,0,t),this.app.fire("throw",t)})),this.app.touch){this.entity.findByName("Play Button").element.on("touchstart",(()=>{this.entity.findByName("Mobile Controls").enabled=!0,this.entity.findByName("Chat").enabled=!1}));let e=this.entity.findByName("Left"),t=this.entity.findByName("Right"),n=this.entity.findByName("Jump"),s=this.entity.findByName("Dash");e.element.on("touchstart",(()=>{this.keys.a="a"})),e.element.on("touchend",(()=>{delete this.keys.a})),t.element.on("touchstart",(()=>{this.keys.d="d"})),t.element.on("touchend",(()=>{delete this.keys.d})),n.element.on("touchstart",(()=>{this.keys.w="w"})),n.element.on("touchend",(()=>{delete this.keys.w})),s.element.on("touchstart",(()=>{this.keys.Shift="Shift"})),s.element.on("touchend",(()=>{delete this.keys.Shift}))}},Keybinds.prototype.update=function(e){document.activeElement!=document.getElementById("chatInput")&&Object.keys(this.keys).sort().toString()!=Object.keys(this.prevKeys).sort().toString()&&(this.app.fire("keys",this.keys),this.prevKeys={...this.keys},console.log("keys"))};var Username=pc.createScript("username");Username.prototype.initialize=function(){let e=document.createElement("input");e.id="username",e.style.setProperty("border","3px solid #01153A","important"),e.style.boxSizing="border-box",e.style.borderRadius="30px",e.style.font="sans serif",e.style.textAlign="center",e.style.width="20%",e.style.height="5%",e.style.color="black",e.style.fontSize="15px",e.spellcheck=!1,e.style.position="absolute",e.style.zIndex="100",e.style.backgroundColor="white",e.style.fontWeight="bold",e.placeholder="Enter your name...",e.style.top="calc(50% - 2.5%)",e.style.left="calc(50% - 10%)",e.style.display="none",e.autocomplete="off";let t=document.createElement("style");t.appendChild(document.createTextNode("input:focus\n{\nborder: 3px solid gray;\noutline: none;\n}")),document.head.appendChild(t),document.body.appendChild(e)},Username.prototype.update=function(e){};var BombUpdate=pc.createScript("bombUpdate");BombUpdate.prototype.initialize=function(){this.bombEntities={},this.app.on("bombUpdate",(t=>{let i=Object.keys(t);this.bombData=t,i.forEach((i=>{if(!this.bombEntities[i]){this.bombEntities[i]=this.entity.findByName("Bomb").clone();let e=this.bombEntities[i];e.enabled=!0,this.entity.addChild(e);let o=t[i].position;e.setPosition(o.x,o.y,0)}})),Object.keys(this.bombEntities).forEach((i=>{t[i]||(this.bombEntities[i].destroy(),delete this.bombEntities[i])}))}))},BombUpdate.prototype.update=function(t){Object.values(this.bombEntities).forEach((t=>{let i=Object.keys(this.bombEntities),e=Object.values(this.bombEntities).indexOf(t),o=this.bombData[i[e]].position;t.setPosition((new pc.Vec3).lerp(t.getPosition(),new pc.Vec3(o.x,o.y,0),.5))}))};var Explosion=pc.createScript("explosion");Explosion.prototype.initialize=function(){this.app.on("explosion",(o=>{let i=this.entity.findByName("Explosion").clone();i.enabled=!0,this.entity.addChild(i),i.setPosition(o.x,o.y,0),setTimeout((()=>{i.destroy()}),600)}))},Explosion.prototype.update=function(o){};var CameraFollow=pc.createScript("cameraFollow");CameraFollow.prototype.initialize=function(){this.app.on("followCamera",(t=>{this.followEntity=t,this.entity.setPosition(t.getPosition())}))},CameraFollow.prototype.update=function(t){if(this.followEntity){let t=new pc.Vec3,o=this.entity.getPosition();o.z=0;let i=this.followEntity.getPosition();t.lerp(o,i,.05),this.entity.setPosition(t.x,t.y,15)}};var ParseMap=pc.createScript("parseMap");ParseMap.prototype.initialize=function(){this.app.on("map",(t=>{let e=[];for(let t=this.entity.children.length-1;t>-1;t--){let i=this.entity.children[t];e.push({position:{x:i.getPosition().x,y:i.getPosition().y},size:{x:i.sprite.width,y:i.sprite.height},sprite:this.app.assets.get(i.sprite.spriteAsset).name}),this.entity.children[t].destroy()}let i={objects:e};i=JSON.stringify(i),console.log(i);let s=this.app.root.findByName("Map Template");t.objects.forEach((t=>{let e=s.clone();e.enabled=!0,e.sprite.width=t.size.x,e.sprite.height=t.size.y,e.setPosition(t.position.x,t.position.y,0),t.sprite&&this.app.assets.find(t.sprite,"sprite")&&(e.sprite.spriteAsset=this.app.assets.find(t.sprite,"sprite")),this.entity.addChild(e)}))}))},ParseMap.prototype.update=function(t){};var ChatInput=pc.createScript("chatInput");ChatInput.prototype.initialize=function(){let t=document.createElement("input");t.id="chatInput",t.style.boxSizing="border-box",t.style.setProperty("border","0px solid gray","important"),t.style.borderRadius="0px 0px 5px 5px",t.style.font="sans serif",t.style.width="calc(20vw - 10px)",t.style.height="20px",t.style.color="gray",t.style.position="absolute",t.style.zIndex="100",t.style.backgroundColor="white",t.style.fontWeight="bold",t.style.padding="1px",t.style.fontSize="10px",t.placeholder="Press Enter to chat...",t.style.bottom="2px",t.style.left="10px",t.style.display="none",t.autocomplete="off";let e=document.createElement("style");e.appendChild(document.createTextNode("#chatInput:focus\n{\noutline: 2px solid gray;\n}")),document.head.appendChild(e),document.body.appendChild(t),this.input=t},ChatInput.prototype.update=function(t){this.entity.findByName("Chat").enabled?this.input.style.display="block":this.input.style.display="none"};pc.script.createLoadingScreen((function(e){var a,t;!async function initCrazyGames(){await window.CrazyGames.SDK.init(),console.log(window.CrazyGames.SDK.environment),"crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.game.loadingStart()}(),a=["body {","    background-color: #283538;","}","","#application-splash-wrapper {","    position: absolute;","    top: 0;","    left: 0;","    height: 100%;","    width: 100%;","    background-color: #283538;","}","","#application-splash {","    position: absolute;","    top: calc(50% - 28px);","    width: 264px;","    left: calc(50% - 132px);","}","","#application-splash img {","    width: 100%;","}","","#progress-bar-container {","    margin: 20px auto 0 auto;","    height: 50px;","    width: 100%;","    background-color: #1d292c;","}","","#progress-bar {","    width: 0%;","    height: 100%;","    background-color: #fff;","}","","@media (max-width: 480px) {","    #application-splash {","        width: 170px;","        left: calc(50% - 85px);","    }","}"].join("\n"),(t=document.createElement("style")).type="text/css",t.styleSheet?t.styleSheet.cssText=a:t.appendChild(document.createTextNode(a)),document.head.appendChild(t),function(){var e=document.createElement("div");e.id="application-splash-wrapper",document.body.appendChild(e);var a=document.createElement("div");a.id="application-splash",e.appendChild(a),a.style.display="none";var t=document.createElement("img");t.src="https://playcanvas.com/static-assets/images/play_text_252_white.png",t.onload=function(){a.style.display="block"};var n=document.createElement("div");n.id="progress-bar-container",a.appendChild(n);var o=document.createElement("div");o.id="progress-bar",n.appendChild(o)}(),e.on("preload:end",(function(){e.off("preload:progress")})),e.on("preload:progress",(function(e){var a=document.getElementById("progress-bar");a&&(e=Math.min(1,Math.max(0,e)),a.style.width=100*e+"%")})),e.on("start",(function(){var e=document.getElementById("application-splash-wrapper");e.parentElement.removeChild(e)}))}));var AdRespawn=pc.createScript("adRespawn");AdRespawn.prototype.initialize=function(){this.entity.button.on("click",(()=>{const e={adFinished:()=>{this.app.root.findByName("Game UI").enabled=!0,document.getElementById("chatInput").style.display="block",this.app.fire("adRespawn")},adError:e=>{this.app.root.findByName("Game UI").enabled=!0,document.getElementById("chatInput").style.display="block",this.app.fire("adRespawn")},adStarted:()=>console.log("Start rewarded ad")};"crazygames"==window.CrazyGames.SDK.environment?window.CrazyGames.SDK.ad.requestAd("rewarded",e):(document.getElementById("username").style.display="block",this.app.root.findByName("Title Screen").enabled=!0)}))},AdRespawn.prototype.update=function(e){};var BackButton=pc.createScript("backButton");BackButton.prototype.initialize=function(){this.entity.button.on("click",(()=>{document.getElementById("username").style.display="block"}))},BackButton.prototype.update=function(t){};var BannerAddiv=pc.createScript("bannerAddiv");BannerAddiv.prototype.initialize=function(){this.adDiv=document.createElement("div"),this.adDiv.id="banner-container",this.adDiv.style.position="absolute",this.adDiv.style.zIndex="100",this.adDiv.style.display="none",this.adDiv.style.width="100%",this.adDiv.style.height="15%",this.adDiv.style.bottom="0",document.body.appendChild(this.adDiv)},BannerAddiv.prototype.update=function(e){this.entity.findByName("Title Screen").enabled&&"none"==this.adDiv.style.display?(this.adDiv.style.display="block","crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.banner.requestResponsiveBanner("banner-container")):this.entity.findByName("Title Screen").enabled||"block"!=this.adDiv.style.display||(this.adDiv.style.display="none","crazygames"==window.CrazyGames.SDK.environment&&window.CrazyGames.SDK.banner.clearAllBanners())};var TutorialFadeAway=pc.createScript("tutorialFadeAway");TutorialFadeAway.prototype.initialize=function(){setTimeout((()=>{this.fading=!0}),1e4)},TutorialFadeAway.prototype.update=function(t){let e=this.entity.findByName("Background"),i=this.entity.findByName("Text");this.fading&&e.element.opacity>0&&i.element.opacity>0?(e.element.opacity-=.002,i.element.opacity-=.005):e.element.opacity<=0&&(this.entity.enabled=!1)};var MidgameAd=pc.createScript("midgameAd");MidgameAd.prototype.initialize=function(){this.entity.button.on("click",(()=>{let e=this.app.root.findByName("Title Screen");const t={adFinished:()=>{e.enabled=!0,document.getElementById("username").style.display="block"},adError:t=>{e.enabled=!0,document.getElementById("username").style.display="block"},adStarted:()=>console.log("Start midgame ad")};"crazygames"==window.CrazyGames.SDK.environment?window.CrazyGames.SDK.ad.requestAd("midgame",t):window.location.hostname.includes("gamepix")?GamePix.interstitialAd().then((function(t){t.success,document.getElementById("username").style.display="block",e.enabled=!0})):t.adFinished()}))},MidgameAd.prototype.update=function(e){};var TitleWiggle=pc.createScript("titleWiggle");TitleWiggle.attributes.add("direction",{type:"number",default:1}),TitleWiggle.prototype.initialize=function(){this.time=0,this.defaultRot=this.entity.getEulerAngles().z},TitleWiggle.prototype.update=function(t){this.time+=1.5*t,this.entity.setEulerAngles(this.entity.getEulerAngles().x,this.entity.getEulerAngles().y,this.defaultRot+this.direction*Math.sin(this.time))};var BuffText=pc.createScript("buffText");BuffText.prototype.initialize=function(){let t=["+1 Max HP","+1 Running Speed","+1 Reload Speed","+1 Throwing Distance"];this.fading=!1,this.app.on("buff",(e=>{this.entity.element.opacity=1,this.entity.element.text=t[e.number],setTimeout((()=>{this.fading=!0}),1500)}))},BuffText.prototype.update=function(t){this.fading&&this.entity.element.opacity>0?this.entity.element.opacity-=.01:this.fading=!1};var CrazygamesLogo=pc.createScript("crazygamesLogo");CrazygamesLogo.prototype.initialize=function(){"crazygames"!=window.CrazyGames.SDK.environment&&(this.entity.element.opacity=0)},CrazygamesLogo.prototype.update=function(e){};