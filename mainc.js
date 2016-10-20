"use strict";var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!(i&&_arr.length===i));_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i["return"]&&_i["return"]()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return sliceIterator(arr,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();(function b(c,d,g){function h(p,q){if(!d[p]){if(!c[p]){var v="function"==typeof require&&require;if(!q&&v)return v(p,!0);if(k)return k(p,!0);var w=new Error("Cannot find module '"+p+"'");throw w.code="MODULE_NOT_FOUND",w}var x=d[p]={exports:{}};c[p][0].call(x.exports,function(y){var z=c[p][1][y];return h(z?z:y)},x,x.exports,b,c,d,g)}return d[p].exports}var k="function"==typeof require&&require;for(var m=0;m<g.length;m++)h(g[m]);return h})({1:[function(b,c,d){function g(aa){R||aa.play()}function h(aa){g(X[aa]),Q[aa].classList.toggle("flip")}function k(){var aa=void 0,ba=void 0,ca=void 0;for(ca=$.length;ca;ca--)aa=Math.floor(Math.random()*ca),ba=$[ca-1],$[ca-1]=$[aa],$[aa]=ba}function m(){N++;1<P.length&&($[P[0]]===$[P[1]]&&P[0]!==P[1]?(O++,P.forEach(function(aa,ba){Q[aa].dispatchEvent(K),1==ba&&function(){var ca=P;Q[aa].addEventListener(_,function(){ca.forEach(function(da){Q[da].dispatchEvent(L)}),g(W.matchSound),O==M&&setTimeout(q,500)})}()}),P=[]):(P[0]!==P[1]&&function(){var aa=P;setTimeout(function(){aa.forEach(function(ba){h(ba)})},500)}(),P=[]));w()}function p(aa){for(;aa.firstChild;)aa.removeChild(aa.firstChild);return!0}function q(){g(W.winSound),D.classList.add("glow"),T>S&&(S=T,I.innerHTML=S,localStorage&&localStorage.setItem("christmas_memory_best",S)),console.log("you win!")}function v(){return Math.round((Date.now()-null)/1e3)}function w(){var aa=20*(120-v()),ba=25*(60-N);J.innerHTML=T=(0<aa?aa:0)+(0<ba?ba:0)}function x(){D.childNodes.length&&p(D);var aa=null;$.forEach(function(ba,ca){var da=B[ba].cloneNode(),ea=C.cloneNode();0==ca%5&&(aa=F.cloneNode(!0),D.appendChild(aa));var fa=E.cloneNode(!0);fa.id="card_"+ca,fa.querySelector(".front").appendChild(da),fa.querySelector(".back").appendChild(ea);var ga=function ga(){h(ca),P.push(ca),m()},ha=function ha(){fa.removeEventListener("click",ga),fa.removeEventListener("correct",ha)},ia=function ia(){da.classList.toggle("glow"),fa.removeEventListener("glow",ia)};fa.addEventListener("click",ga),fa.addEventListener("correct",ha),fa.addEventListener("glow",ia),aa.appendChild(fa),Q.push(fa)}),X=[];for(var ba=0;ba<Q.length;ba++)X.push(W.flipSound.cloneNode())}function y(){var _loop=function _loop(aa){aa==Q.length-1?setTimeout(function(){h(aa),Z()},100*(aa+1)):setTimeout(function(){return h(aa)},100*(aa+1))};for(var aa=0;aa<Q.length;aa++)_loop(aa)}function z(){Y(),O=0,N=0,Q=[],J.innerHTML=0,D.classList.remove("glow"),k(),x(),setTimeout(y,1e3)}var A=["img/candy.png","img/christmas_pudding.png","img/christmas_tree.png","img/elf_hat.png","img/gift.png","img/gingerbread_man.png","img/happy_snowman.png","img/ribbon.png","img/santa.png","img/teddy_bear_socks.png"],B=[],C=void 0,D=document.querySelector(".grid"),E=document.querySelector("#template .flip-container"),F=document.querySelector("#template .grid-row"),G=document.querySelector("#mute"),H=document.querySelector("#replay"),I=document.querySelector(".best"),J=document.querySelector(".score"),K=new Event("correct"),L=new Event("glow"),M=A.length,N=0,O=0,P=[],Q=[],R=!1,S=localStorage&&localStorage.getItem("christmas_memory_best")||0,T=0;I.innerHTML=S,H.addEventListener("click",z),G.addEventListener("click",function(){R=!R,G.classList.toggle("quiet")});var U=["sound/card-flip.wav","sound/card-match.mp3","sound/win-music.wav"],V=["flipSound","matchSound","winSound"],W={},X=[],_ref=function(){var aa=function aa(ba){ba.stopPropagation(),ba.preventDefault};return[function(){return document.addEventListener("click",aa,!0)},function(){return document.removeEventListener("click",aa,!0)}]}(),_ref2=_slicedToArray(_ref,2),Y=_ref2[0],Z=_ref2[1],$=[];for(var aa=0;aa<M;aa++)$.push(aa),$.push(aa);var _=function(){var ba=document.createElement("fakeelement"),ca={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var da in ca)if(void 0!==ba.style[da])return ca[da]}();(function(){var aa=10,ba=function ba(){Promise.all(A.map(function(ca,da){return new Promise(function(ea,fa){var ga=document.createElement("img");B[da]=ga,ga.addEventListener("load",ea),ga.addEventListener("error",fa),ga.src=ca})})).then(function(){return Promise.all(U.map(function(ca,da){return new Promise(function(ea,fa){var ga=new Audio;ga.addEventListener("loadeddata",ea),ga.addEventListener("error",fa),ga.src=ca,W[V[da]]=ga})}))}).then(function(){return new Promise(function(ca,da){var ea=document.createElement("img");ea.addEventListener("load",ca),ea.addEventListener("error",da),C=ea,ea.src="img/snowflake.png"})}).then(z).catch(function(ca){console.log("objects load error: "+ca.toString()),console.log("Let's try again! Tries left: "+aa--),ba()})};ba()})()},{}]},{},[1]);
