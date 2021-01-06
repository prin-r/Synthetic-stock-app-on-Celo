(this["webpackJsonpband-celo"]=this["webpackJsonpband-celo"]||[]).push([[0],{258:function(e,t,n){e.exports=n(674)},263:function(e,t,n){},265:function(e,t,n){},297:function(e,t){},302:function(e,t){},304:function(e,t){},313:function(e,t){},315:function(e,t){},337:function(e,t){},339:function(e,t){},384:function(e,t){},386:function(e,t){},392:function(e,t){},674:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(253),c=n.n(o),l=(n(263),n(19)),i=n.n(l),u=n(48),s=n(136),m=(n(265),n(4)),f={light:"#D25C7D",normal:"#E5718D",dark:"#971E44"},d={normal:"#7864CF",dark:"#56459E"},w={breakpoints:["640px","960px"],fontSizes:[12,14,16,18,20,24,32,48,60],colors:{text:{normal:"#56459E"}.normal},space:[0,4,8,16,32,64,128,256],fonts:{head:"Inter",sans:"Inter, sans-serif"},shadows:{small:"0 0 4px rgba(0, 0, 0, .125)",large:"0 0 24px rgba(0, 0, 0, .125)"},buttons:{primary:{fontFamily:"Inter",fontWeight:400,fontSize:"0.65em",padding:"0.9em 3em",cursor:"pointer",color:"#fff",background:"linear-gradient(247.38deg, #971E44 9.86%, #D25C7D 89.2%)",borderRadius:30,transition:"all 250ms",boxShadow:"0px 4px 8px rgba(151, 30, 68, 0.25)"}}},b=n(96),p=n(256);function v(){var e=Object(p.a)(["\n  text-decoration: none;\n"]);return v=function(){return e},e}var E=b.b.a.attrs((function(e){return{href:e.to||e.href,target:"_blank",rel:"noopener"}}))(v()),h=(n(135),n(140),n(444)),g=function(){var e=Object(u.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=console,e.next=3,t.web3.eth.call({to:"0xa561131a1C8aC25925FB848bCa45A74aF61e5A38",data:"0x70a08231000000000000000000000000498968c2b945ac37b78414f66167b0786e522636"});case 3:e.t1=e.sent,e.t0.log.call(e.t0,e.t1);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=function(e){var t=e.userAddress;return Object(a.useEffect)((function(){function e(){return(e=Object(u.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),r.a.createElement(m.a,{flexDirection:"column",style:{padding:"1.0vw",border:"1px solid #333333",minWidth:"32.0vw",borderRadius:"4px"}},r.a.createElement(m.a,{backgroundColor:f.dark,justifyContent:"space-between",style:{color:"white",margin:"-1.0vw",padding:"1.0vw"}},r.a.createElement(m.b,null,"Celo Dollar Balance"),r.a.createElement(E,{href:"https://celo.org/developers/faucet",style:{color:"white"}},"faucet")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"space-between",style:{fontSize:"0.95vw"}},"Address ",r.a.createElement(m.b,null,t)),r.a.createElement(m.a,{mt:"1.0vw",justifyContent:"space-between",style:{fontSize:"0.95vw"}},"Amount ",r.a.createElement(m.b,null,"2000 cUSD")))},x=function(){return r.a.createElement(m.a,{flexDirection:"column",style:{padding:"1.0vw",border:"1px solid #333333",minWidth:"32.0vw",borderRadius:"4px"}},r.a.createElement(m.a,{backgroundColor:f.dark,justifyContent:"space-between",style:{color:"white",margin:"-1.0vw",padding:"1.0vw"}},r.a.createElement(m.b,null,"Dangerous zone")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"space-between"},r.a.createElement("button",null,"liquidate undercollateralized loan")))},C=function(){return r.a.createElement(m.a,{flexDirection:"column",style:{padding:"1.0vw",border:"1px solid #333333",minWidth:"32.0vw",borderRadius:"4px"}},r.a.createElement(m.a,{backgroundColor:f.dark,justifyContent:"space-between",style:{color:"white",margin:"-1.0vw",padding:"1.0vw"}},r.a.createElement(m.b,null,"Synthetic Stock Balance"),r.a.createElement(m.a,null)),r.a.createElement(m.a,{mt:"3.0vw",justifyContent:"center",style:{fontSize:"2.0vw"}},r.a.createElement(m.b,null,"100 SPX")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"center",style:{fontSize:"2.0vw"}},r.a.createElement("button",null,"borrow"),r.a.createElement(m.a,{mx:"1.5vw"}),r.a.createElement("button",null,"return debt"),r.a.createElement(m.a,{mx:"1.5vw"}),r.a.createElement("button",null,"send")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"space-between",style:{fontSize:"0.95vw"}},"Collateral ",r.a.createElement(m.b,null,"1000 cUSD")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"space-between",style:{fontSize:"0.95vw"}},"Debt ",r.a.createElement(m.b,null,"100 SPX")),r.a.createElement(m.a,{mt:"2.0vw",justifyContent:"center",style:{fontSize:"2.0vw"}},r.a.createElement("button",null,"lock"),r.a.createElement(m.a,{mx:"3.0vw"}),r.a.createElement("button",null,"unlock")))},k=function(e){return e&&null!==e.match(/^[0-9A-Fa-f]{64}$/g)},j=function(){var e=Object(a.useRef)(null),t=Object(a.useState)(""),n=Object(s.a)(t,2),o=n[0],c=n[1],l=Object(a.useState)(""),f=Object(s.a)(l,2),p=f[0],v=f[1];return k(o)?r.a.createElement(b.a,{theme:w},r.a.createElement(m.a,{mt:"2.5vw",mx:"auto",justifyContent:"center",alignItems:"center",flexDirection:"column",width:"70vw"},r.a.createElement(m.a,{flexDirection:"row",width:"100%"},r.a.createElement(m.a,{flex:1},r.a.createElement(m.b,{fontSize:"2.5vw",fontWeight:900,lineHeight:"1.53vw",color:d.dark},"Stock CDP App")),r.a.createElement(m.a,{flex:1})),r.a.createElement(m.a,{mt:"5.0vw",flexDirection:"row",width:"100%",justifyContent:"space-between"},r.a.createElement(m.a,{flexDirection:"column"},r.a.createElement(y,{userAddress:p}),r.a.createElement(m.a,{mt:"5.0vw"}),r.a.createElement(x,null)),r.a.createElement(m.a,null,r.a.createElement(C,null)))),")"):r.a.createElement(m.a,{mt:"40.0vw",mx:"auto",justifyContent:"center",alignItems:"center",flexDirection:"column",width:"70vw"},r.a.createElement("button",{onClick:Object(u.a)(i.a.mark((function t(){var n;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=window.prompt("Login with your private key"),k(n)?(e.current=h.newKit("https://alfajores-forno.celo-testnet.org"),e.current.addAccount(n),c(n),v(e.current.web3.givenProvider.selectedAddress),g(e.current)):alert("invalid private key format");case 2:case"end":return t.stop()}}),t)}))),style:{padding:"1.0vw",borderRadius:"4px"}},r.a.createElement(m.b,{fontSize:"2.0vw"},"Login")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(j,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[258,1,2]]]);