!function(t,e){'object'==typeof exports&&'undefined'!=typeof module?e(exports):'function'==typeof define&&define.amd?define(['exports'],e):e((t='undefined'!=typeof globalThis?globalThis:t||self).dnd={})}(this,(function(t){'use strict';var e;function s(t,e,s,r){if('a'===s&&!r)throw new TypeError('Private accessor was defined without a getter');if('function'==typeof e?t!==e||!r:!e.has(t))throw new TypeError('Cannot read private member from an object whose class did not declare it');return'm'===s?r:'a'===s?r.call(t):r?r.value:e.get(t)}function r(t,e,s,r,i){if('m'===r)throw new TypeError('Private method is not writable');if('a'===r&&!i)throw new TypeError('Private accessor was defined without a setter');if('function'==typeof e?t!==e||!i:!e.has(t))throw new TypeError('Cannot write private member to an object whose class did not declare it');return'a'===r?i.call(t,s):i?i.value=s:e.set(t,s),s}t.DND_MODE=void 0,(e=t.DND_MODE||(t.DND_MODE={})).SCOPE='scope',e.SWARAJ='swaraj','function'==typeof SuppressedError&&SuppressedError;const i=Symbol('bind-drag'),o=Symbol('easy-dnd');function n(t){return t instanceof HTMLElement}function a(t){const e=()=>t.dropDom.getBoundingClientRect(),s=()=>t.context,r={event:null,getContext:s,getDropInstance:()=>s().dropInstance,getDragType:()=>s().dragType,getDragData:()=>s().dragData};return{...r,getDragDom:()=>s().dragDom,getDomRect:e,isOverTop:(t,r)=>{const{y:i,height:o}=t||e();return s().dragCoord.y<i+o/(r?3:2)},isOverBottom:(t,r)=>{const{y:i,height:o}=t||e();return s().dragCoord.y>i+o/(r?1.5:2)},isOverLeft:(t,r)=>{const{x:i,width:o}=t||e();return s().dragCoord.x<i+o/(r?3:2)},isOverRight:(t,r)=>{const{x:i,width:o}=t||e();return s().dragCoord.x>i+o/(r?1.5:2)},isOverRowCenter(t){return t=t||e(),!this.isOverTop(t,!0)&&!this.isOverBottom(t,!0)},isOverColumnCenter(t){return t=t||e(),!this.isOverLeft(t,!0)&&!this.isOverRight(t,!0)},getRubbish:()=>s().getRubbish(),_s:r}}function h(t){const e=()=>t.context;return{event:null,getContext:e,getRubbish:()=>e().getRubbish()}}var d,l,c,f,g,m,p,u,D,v,w,E,x,y,b,M,W,k,S,L,T,I,C,O,P,R,A,N;d=new WeakMap,l=new WeakMap,c=new WeakMap,f=new WeakMap,g=new WeakMap,m=new WeakMap,p=new WeakMap,u=new WeakMap,D=new WeakMap,v=new WeakMap,w=new WeakMap,E=new WeakMap,x=new WeakMap,y=new WeakMap,b=new WeakMap,M=new WeakMap,W=new WeakMap;k=new WeakMap,S=new WeakMap,L=new WeakMap,T=new WeakMap,I=new WeakMap,C=new WeakMap,O=new WeakMap,P=new WeakMap,R=new WeakMap,A=new WeakMap,N=new WeakMap,t.BIND_DRAG=i,t.DND_CTX=o,t.DragCore=class{constructor(t){this.monitor=h(this),d.set(this,!0),l.set(this,!1),c.set(this,!0),f.set(this,!1),g.set(this,void 0),this.registerDom=t=>(this.dragDom=t,n(t)&&(t[i]=!0),this),m.set(this,(t=>{const{dragDom:e}=this;n(e)?t?(e.setAttribute('draggable','true'),e.style.cursor='move'):(e.removeAttribute('draggable'),e.style.removeProperty('cursor')):r(this,c,t,'f')})),p.set(this,((t,e)=>{var r;const i=s(this,g,'f')[e];i&&(null===(r=this.dragDom)||void 0===r||r.classList[t](i))})),this.subscribe=()=>{if(s(this,f,'f'))return;const{dragDom:t,context:e}=this;if(!n(t))throw new Error('class Drag调用subscribe方法前必须调用registerDom方法');return s(this,m,'f').call(this,r(this,c,r(this,f,!0,'f'),'f')),e.dragItemDragStarts.add(s(this,M,'f')),e.dragItemDragEnds.add(s(this,W,'f')),s(this,y,'f').call(this),s(this,g,'f').hover&&t.addEventListener('mouseleave',s(this,D,'f')),t.addEventListener('dragstart',s(this,v,'f')),t.addEventListener('drag',s(this,w,'f')),t.addEventListener('dragend',s(this,E,'f')),this},this.unSubscribe=()=>{if(!s(this,f,'f'))return;const{dragDom:t,context:e}=this;t&&(s(this,m,'f').call(this,t[i]=r(this,c,r(this,f,!1,'f'),'f')),!s(this,d,'f')&&s(this,E,'f').call(this,this.monitor.event),s(this,b,'f').call(this),s(this,g,'f').hover&&t.removeEventListener('mouseleave',s(this,D,'f')),t.removeEventListener('dragstart',s(this,v,'f')),t.removeEventListener('drag',s(this,w,'f')),t.removeEventListener('dragend',s(this,E,'f')),this.dragDom=null),e.dragItemDragEnds.delete(s(this,W,'f')),e.dragItemDragStarts.delete(s(this,M,'f'))},u.set(this,(()=>{!this.context.dragDom&&s(this,c,'f')&&(r(this,l,!0,'f'),s(this,p,'f').call(this,'add','hover'))})),D.set(this,(()=>{s(this,l,'f')&&s(this,c,'f')&&(r(this,l,!1,'f'),s(this,p,'f').call(this,'remove','hover'))})),v.set(this,(t=>{var e;const{monitor:i,context:o,params:n,config:a}=this;t.stopPropagation(),i.event=t,o.dragType=a.type,o.dragDom=this.dragDom,o.dropInstance=null,o.dragData=null===(e=a.data)||void 0===e?void 0:e.call(a),r(this,d,!1,'f');const h=Array.from(this.dragDom.children);let l,c;for(l of h)l.style.pointerEvents='none';for(c of(n.dragStart&&n.dragStart(i),this.context.dragItemDragStarts))c();for(c of this.context.dropItemDragStarts)c();c=null,s(this,p,'f').call(this,'add','dragging')})),w.set(this,(t=>{const{dragCoord:e}=this.context;e.x=t.clientX,e.y=t.clientY,this.params.drag&&(this.monitor.event=t,this.params.drag(this.monitor))})),E.set(this,(t=>{const{monitor:e,params:i}=this;r(this,d,!0,'f'),e.event=t;const o=Array.from(this.dragDom.children);let n,a;for(n of o)n.style.pointerEvents='auto';for(a of(i.dragEnd&&i.dragEnd(e),this.context.dragItemDragEnds))a();for(a of this.context.dropItemDragEnds)a();s(this,x,'f').call(this),s(this,p,'f').call(this,'remove','dragging')})),x.set(this,(()=>{this.context.dragDom=null,this.context.dragData=null,this.context.enterDom=null,this.monitor.event=null})),y.set(this,(()=>{s(this,g,'f').hover&&this.dragDom&&this.dragDom.addEventListener('mouseenter',s(this,u,'f'))})),b.set(this,(()=>{s(this,g,'f').hover&&this.dragDom&&this.dragDom.removeEventListener('mouseenter',s(this,u,'f'))})),M.set(this,(()=>{s(this,D,'f').call(this),s(this,b,'f').call(this)})),W.set(this,(()=>{setTimeout((()=>s(this,y,'f').call(this)))})),this.params=t,this.config=t.config;const{className:e,context:o,defaultDraggable:a}=t.config;this.context=o,r(this,g,e||{},'f'),r(this,c,null==a||a,'f')}get draggable(){return s(this,c,'f')}set draggable(t){t!==s(this,c,'f')&&s(this,m,'f').call(this,r(this,c,t,'f'))}},t.DropCore=class{constructor(e){this.monitor=a(this),this.isEnter=!1,this.prePosition={x:0,y:0},k.set(this,0),S.set(this,!1),L.set(this,void 0),T.set(this,!1),this.registerDom=t=>(this.dropDom=t,this),this.subscribe=()=>{if(s(this,S,'f'))return;const{dropDom:t}=this;if(!n(t))throw new Error('class Drop调用subscribe方法前必须调用registerDom方法');return r(this,S,!0,'f'),this.context.dropItemDragStarts.add(s(this,A,'f')),this.context.dropItemDragEnds.add(s(this,N,'f')),t.addEventListener('dragenter',s(this,C,'f')),t.addEventListener('dragover',s(this,O,'f')),t.addEventListener('dragleave',s(this,P,'f')),t.addEventListener('drop',s(this,R,'f')),this},this.unSubscribe=()=>{if(!s(this,S,'f'))return;const{dropDom:t}=this;t&&(r(this,S,!1,'f'),this.context.dropItemDragEnds.delete(s(this,N,'f')),this.context.dropItemDragStarts.delete(s(this,A,'f')),t.removeEventListener('dragenter',s(this,C,'f')),t.removeEventListener('dragover',s(this,O,'f')),t.removeEventListener('dragleave',s(this,P,'f')),t.removeEventListener('drop',s(this,R,'f')),this.dropDom=null)},I.set(this,((t,e)=>{var r;const i=s(this,L,'f')[e];i&&(null===(r=this.dropDom)||void 0===r||r.classList[t](i))})),this.canDrop=t=>{const{dragDom:e}=this.context;return!!e&&(this.monitor.event=t,(!this.dropDom[i]||e!==this.dropDom)&&(!!this.config.acceptType.has(this.monitor.getDragType())&&(this.config.canDrop?!!this.config.canDrop(this.monitor._s)&&(null==t||t.preventDefault(),!0):(null==t||t.preventDefault(),!0))))},this.stopPropagation=e=>{this.context.dndMode===t.DND_MODE.SWARAJ&&e.stopPropagation()},C.set(this,(t=>{var e,i;if(this.stopPropagation(t),this.canDrop(t)&&0===(r(this,k,(i=s(this,k,'f'),e=i++,i),'f'),e)){this.context.enterDom=this.dropDom;const t=()=>{var t,e;this.enterTimer=null,this.context.enterDom===this.dropDom&&(this.isEnter=!0,null===(e=(t=this.params).dragEnter)||void 0===e||e.call(t,this.monitor),s(this,I,'f').call(this,'add','dragEnter'))},e=this.context.delay;e>0?this.enterTimer=setTimeout(t,e):t()}})),O.set(this,(t=>{var e,s;if(this.stopPropagation(t),this.canDrop(t)&&this.isEnter){const r=this.prePosition;r.x===t.clientX&&r.y===t.clientY||(r.x=t.clientX,r.y=t.clientY,null===(s=(e=this.params).dragOver)||void 0===s||s.call(e,this.monitor))}})),P.set(this,(t=>{var e,i,o;this.stopPropagation(t),this.canDrop(t)&&(r(this,k,(o=s(this,k,'f'),--o),'f')||(this.enterTimer?clearTimeout(this.enterTimer):this.isEnter&&(this.isEnter=!1,s(this,I,'f').call(this,'remove','dragEnter'),null===(i=(e=this.params).dragLeave)||void 0===i||i.call(e,this.monitor))))})),R.set(this,(t=>{var e,r;this.stopPropagation(t),this.canDrop(t)&&(this.context.dropInstance=this,s(this,I,'f').call(this,'remove','dragEnter'),null===(r=(e=this.params).drop)||void 0===r||r.call(e,this.monitor))})),A.set(this,(()=>{const{dragStart:t}=this.params;r(this,T,this.canDrop(),'f'),s(this,T,'f')&&(null==t||t(this.monitor),s(this,I,'f').call(this,'add','canDrop'))})),N.set(this,(()=>{const{dragEnd:t}=this.params;t&&s(this,T,'f')&&(null==t||t(this.monitor)),s(this,I,'f').call(this,'remove','canDrop'),r(this,k,0,'f'),this.isEnter=!1,this.monitor.event=null})),this.params=e,this.config=e.config,r(this,L,this.config.className||{},'f'),this.context=this.config.context}},t.createDragMonitor=h,t.createDropMonitor=a,t.createProvider=function({dndMode:e=t.DND_MODE.SWARAJ,delay:s=0}={}){(s<0||isNaN(s))&&(s=0);const r={};return{dndMode:e,delay:s,dropInstance:null,dragCoord:{x:0,y:0},dragType:null,dragDom:null,dragData:null,enterDom:null,dragItemDragStarts:new Set,dragItemDragEnds:new Set,dropItemDragStarts:new Set,dropItemDragEnds:new Set,getRubbish:()=>r}},t.isElement=n,Object.defineProperty(t,'__esModule',{value:!0})}));
