!function(t,e){'object'==typeof exports&&'undefined'!=typeof module?e(exports,require('react')):'function'==typeof define&&define.amd?define(['exports','react'],e):e((t='undefined'!=typeof globalThis?globalThis:t||self).dnd={},t.react)}(this,(function(t,e){'use strict';var s;function r(t,e,s,r){if('a'===s&&!r)throw new TypeError('Private accessor was defined without a getter');if('function'==typeof e?t!==e||!r:!e.has(t))throw new TypeError('Cannot read private member from an object whose class did not declare it');return'm'===s?r:'a'===s?r.call(t):r?r.value:e.get(t)}function i(t,e,s,r,i){if('m'===r)throw new TypeError('Private method is not writable');if('a'===r&&!i)throw new TypeError('Private accessor was defined without a setter');if('function'==typeof e?t!==e||!i:!e.has(t))throw new TypeError('Cannot write private member to an object whose class did not declare it');return'a'===r?i.call(t,s):i?i.value=s:e.set(t,s),s}t.DND_MODE=void 0,(s=t.DND_MODE||(t.DND_MODE={})).SCOPE='scope',s.SWARAJ='swaraj','function'==typeof SuppressedError&&SuppressedError;const o=Symbol('bind-drag'),n=Symbol('easy-dnd');function a(t){return t instanceof HTMLElement}function h(t){const e=()=>t.dropDom.getBoundingClientRect(),s=()=>t.context,r={event:null,getContext:s,getDropInstance:()=>s().dropInstance,getDragType:()=>s().dragType,getDragData:()=>s().dragData};return{...r,getDragDom:()=>s().dragDom,getDomRect:e,isOverTop:(t,r)=>{const{y:i,height:o}=t||e();return s().dragCoord.y<i+o/(r?3:2)},isOverBottom:(t,r)=>{const{y:i,height:o}=t||e();return s().dragCoord.y>i+o/(r?1.5:2)},isOverLeft:(t,r)=>{const{x:i,width:o}=t||e();return s().dragCoord.x<i+o/(r?3:2)},isOverRight:(t,r)=>{const{x:i,width:o}=t||e();return s().dragCoord.x>i+o/(r?1.5:2)},isOverRowCenter(t){return t=t||e(),!this.isOverTop(t,!0)&&!this.isOverBottom(t,!0)},isOverColumnCenter(t){return t=t||e(),!this.isOverLeft(t,!0)&&!this.isOverRight(t,!0)},getRubbish:()=>s().getRubbish(),_s:r}}function d({dndMode:e=t.DND_MODE.SWARAJ,delay:s=0}={}){(s<0||isNaN(s))&&(s=0);const r={};return{dndMode:e,delay:s,dropInstance:null,dragCoord:{x:0,y:0},dragType:null,dragDom:null,dragData:null,enterDom:null,dragItemDragStarts:new Set,dragItemDragEnds:new Set,dropItemDragStarts:new Set,dropItemDragEnds:new Set,getRubbish:()=>r}}function c(t){const e=()=>t.context;return{event:null,getContext:e,getRubbish:()=>e().getRubbish()}}var l,f,g,u,p,m,D,v,E,w,x,b,y,M,k,W,S,L,C,T,I,O,P,R,A,N,_,F;class j{constructor(t){this.monitor=c(this),l.set(this,!0),f.set(this,!1),g.set(this,!0),u.set(this,!1),p.set(this,void 0),this.registerDom=t=>(this.dragDom=t,a(t)&&(t[o]=!0),this),m.set(this,(t=>{const{dragDom:e}=this;a(e)?t?(e.setAttribute('draggable','true'),e.style.cursor='move'):(e.removeAttribute('draggable'),e.style.removeProperty('cursor')):i(this,g,t,'f')})),D.set(this,((t,e)=>{var s;const i=r(this,p,'f')[e];i&&(null===(s=this.dragDom)||void 0===s||s.classList[t](i))})),this.subscribe=()=>{if(r(this,u,'f'))return;const{dragDom:t,context:e}=this;if(!a(t))throw new Error('class Drag调用subscribe方法前必须调用registerDom方法');return r(this,m,'f').call(this,i(this,g,i(this,u,!0,'f'),'f')),e.dragItemDragStarts.add(r(this,W,'f')),e.dragItemDragEnds.add(r(this,S,'f')),r(this,M,'f').call(this),r(this,p,'f').hover&&t.addEventListener('mouseleave',r(this,E,'f')),t.addEventListener('dragstart',r(this,w,'f')),t.addEventListener('drag',r(this,x,'f')),t.addEventListener('dragend',r(this,b,'f')),this},this.unSubscribe=()=>{if(!r(this,u,'f'))return;const{dragDom:t,context:e}=this;t&&(r(this,m,'f').call(this,t[o]=i(this,g,i(this,u,!1,'f'),'f')),!r(this,l,'f')&&r(this,b,'f').call(this,this.monitor.event),r(this,k,'f').call(this),r(this,p,'f').hover&&t.removeEventListener('mouseleave',r(this,E,'f')),t.removeEventListener('dragstart',r(this,w,'f')),t.removeEventListener('drag',r(this,x,'f')),t.removeEventListener('dragend',r(this,b,'f')),this.dragDom=null),e.dragItemDragEnds.delete(r(this,S,'f')),e.dragItemDragStarts.delete(r(this,W,'f'))},v.set(this,(()=>{!this.context.dragDom&&r(this,g,'f')&&(i(this,f,!0,'f'),r(this,D,'f').call(this,'add','hover'))})),E.set(this,(()=>{r(this,f,'f')&&r(this,g,'f')&&(i(this,f,!1,'f'),r(this,D,'f').call(this,'remove','hover'))})),w.set(this,(t=>{var e;const{monitor:s,context:o,params:n,config:a}=this;t.stopPropagation(),s.event=t,o.dragType=a.type,o.dragDom=this.dragDom,o.dropInstance=null,o.dragData=null===(e=a.data)||void 0===e?void 0:e.call(a),i(this,l,!1,'f');const h=Array.from(this.dragDom.children);let d,c;for(d of h)d.style.pointerEvents='none';for(c of(n.dragStart&&n.dragStart(s),this.context.dragItemDragStarts))c();for(c of this.context.dropItemDragStarts)c();c=null,r(this,D,'f').call(this,'add','dragging')})),x.set(this,(t=>{const{dragCoord:e}=this.context;e.x=t.clientX,e.y=t.clientY,this.params.drag&&(this.monitor.event=t,this.params.drag(this.monitor))})),b.set(this,(t=>{const{monitor:e,params:s}=this;i(this,l,!0,'f'),e.event=t;const o=Array.from(this.dragDom.children);let n,a;for(n of o)n.style.pointerEvents='auto';for(a of(s.dragEnd&&s.dragEnd(e),this.context.dragItemDragEnds))a();for(a of this.context.dropItemDragEnds)a();r(this,y,'f').call(this),r(this,D,'f').call(this,'remove','dragging')})),y.set(this,(()=>{this.context.dragDom=null,this.context.dragData=null,this.context.enterDom=null,this.monitor.event=null})),M.set(this,(()=>{r(this,p,'f').hover&&this.dragDom&&this.dragDom.addEventListener('mouseenter',r(this,v,'f'))})),k.set(this,(()=>{r(this,p,'f').hover&&this.dragDom&&this.dragDom.removeEventListener('mouseenter',r(this,v,'f'))})),W.set(this,(()=>{r(this,E,'f').call(this),r(this,k,'f').call(this)})),S.set(this,(()=>{setTimeout((()=>r(this,M,'f').call(this)))})),this.params=t,this.config=t.config;const{className:e,context:s,defaultDraggable:n}=t.config;this.context=s,i(this,p,e||{},'f'),i(this,g,null==n||n,'f')}get draggable(){return r(this,g,'f')}set draggable(t){t!==r(this,g,'f')&&r(this,m,'f').call(this,i(this,g,t,'f'))}}l=new WeakMap,f=new WeakMap,g=new WeakMap,u=new WeakMap,p=new WeakMap,m=new WeakMap,D=new WeakMap,v=new WeakMap,E=new WeakMap,w=new WeakMap,x=new WeakMap,b=new WeakMap,y=new WeakMap,M=new WeakMap,k=new WeakMap,W=new WeakMap,S=new WeakMap;class B{constructor(e){this.monitor=h(this),this.isEnter=!1,this.prePosition={x:0,y:0},L.set(this,0),C.set(this,!1),T.set(this,void 0),I.set(this,!1),this.registerDom=t=>(this.dropDom=t,this),this.subscribe=()=>{if(r(this,C,'f'))return;const{dropDom:t}=this;if(!a(t))throw new Error('class Drop调用subscribe方法前必须调用registerDom方法');return i(this,C,!0,'f'),this.context.dropItemDragStarts.add(r(this,_,'f')),this.context.dropItemDragEnds.add(r(this,F,'f')),t.addEventListener('dragenter',r(this,P,'f')),t.addEventListener('dragover',r(this,R,'f')),t.addEventListener('dragleave',r(this,A,'f')),t.addEventListener('drop',r(this,N,'f')),this},this.unSubscribe=()=>{if(!r(this,C,'f'))return;const{dropDom:t}=this;t&&(i(this,C,!1,'f'),this.context.dropItemDragEnds.delete(r(this,F,'f')),this.context.dropItemDragStarts.delete(r(this,_,'f')),t.removeEventListener('dragenter',r(this,P,'f')),t.removeEventListener('dragover',r(this,R,'f')),t.removeEventListener('dragleave',r(this,A,'f')),t.removeEventListener('drop',r(this,N,'f')),this.dropDom=null)},O.set(this,((t,e)=>{var s;const i=r(this,T,'f')[e];i&&(null===(s=this.dropDom)||void 0===s||s.classList[t](i))})),this.canDrop=t=>{const{dragDom:e}=this.context;return!!e&&(this.monitor.event=t,(!this.dropDom[o]||e!==this.dropDom)&&(!!this.config.acceptType.has(this.monitor.getDragType())&&(this.config.canDrop?!!this.config.canDrop(this.monitor._s)&&(null==t||t.preventDefault(),!0):(null==t||t.preventDefault(),!0))))},this.stopPropagation=e=>{this.context.dndMode===t.DND_MODE.SWARAJ&&e.stopPropagation()},P.set(this,(t=>{var e,s;if(this.stopPropagation(t),this.canDrop(t)&&0===(i(this,L,(s=r(this,L,'f'),e=s++,s),'f'),e)){this.context.enterDom=this.dropDom;const t=()=>{var t,e;this.enterTimer=null,this.context.enterDom===this.dropDom&&(this.isEnter=!0,null===(e=(t=this.params).dragEnter)||void 0===e||e.call(t,this.monitor),r(this,O,'f').call(this,'add','dragEnter'))},e=this.context.delay;e>0?this.enterTimer=setTimeout(t,e):t()}})),R.set(this,(t=>{var e,s;if(this.stopPropagation(t),this.canDrop(t)&&this.isEnter){const r=this.prePosition;r.x===t.clientX&&r.y===t.clientY||(r.x=t.clientX,r.y=t.clientY,null===(s=(e=this.params).dragOver)||void 0===s||s.call(e,this.monitor))}})),A.set(this,(t=>{var e,s,o;this.stopPropagation(t),this.canDrop(t)&&(i(this,L,(o=r(this,L,'f'),--o),'f')||(this.enterTimer?clearTimeout(this.enterTimer):this.isEnter&&(this.isEnter=!1,r(this,O,'f').call(this,'remove','dragEnter'),null===(s=(e=this.params).dragLeave)||void 0===s||s.call(e,this.monitor))))})),N.set(this,(t=>{var e,s;this.stopPropagation(t),this.canDrop(t)&&(this.context.dropInstance=this,r(this,O,'f').call(this,'remove','dragEnter'),null===(s=(e=this.params).drop)||void 0===s||s.call(e,this.monitor))})),_.set(this,(()=>{const{dragStart:t}=this.params;i(this,I,this.canDrop(),'f'),r(this,I,'f')&&(null==t||t(this.monitor),r(this,O,'f').call(this,'add','canDrop'))})),F.set(this,(()=>{const{dragEnd:t}=this.params;t&&r(this,I,'f')&&(null==t||t(this.monitor)),r(this,O,'f').call(this,'remove','canDrop'),i(this,L,0,'f'),this.isEnter=!1,this.monitor.event=null})),this.params=e,this.config=e.config,i(this,T,this.config.className||{},'f'),this.context=this.config.context}}L=new WeakMap,C=new WeakMap,T=new WeakMap,I=new WeakMap,O=new WeakMap,P=new WeakMap,R=new WeakMap,A=new WeakMap,N=new WeakMap,_=new WeakMap,F=new WeakMap;const X=e.createContext(null);class J extends e.PureComponent{constructor(t){super(t),this.dndCtx=d(t)}render(){return e.createElement(X.Provider,{value:this.dndCtx,children:this.props.children})}}class Y extends j{constructor(){super(...arguments),this.hooksFirst=!0,this.dragRef=t=>(this.registerDom(t),t)}}class q extends B{constructor(){super(...arguments),this.hooksFirst=!0,this.dropRef=t=>{if('function'==typeof t)return e=>{this.registerDom(t(e))};this.registerDom(t)}}}const G=[],H=['dragStart','dragEnd','drag'];const z=['dragStart','dragEnd','drop','dragEnter','dragOver','dragLeave'];t.BIND_DRAG=o,t.DND_CTX=n,t.DndProvider=J,t.Drag=Y,t.DragCore=j,t.Drop=q,t.DropCore=B,t.createDragMonitor=c,t.createDropMonitor=h,t.createProvider=d,t.isElement=a,t.useDrag=function(t,s=G){const r=e.useContext(X),i=e.useRef(null),o=e.useMemo((()=>{const e=t();return e.config.context=r,new Y(e)}),[]);return e.useEffect((()=>{if(o.hooksFirst)o.hooksFirst=!1;else{const{params:e}=o,s=t();for(let t of H)e[t]&&(e[t]=s[t]);e.config.data=s.config.data}}),s),e.useLayoutEffect((()=>(null===o.dragDom&&(o.dragDom=i.current),i.current=o.dragDom,o.subscribe(),()=>o.unSubscribe())),[]),o},t.useDrop=function(t,s=G){const r=e.useContext(X),i=e.useRef(null),o=e.useMemo((()=>{const e=t();return e.config.context=r,new q(e)}),[]);return e.useEffect((()=>{if(o.hooksFirst)o.hooksFirst=!1;else{const{params:e}=o,s=t();for(let t of z)e[t]&&(e[t]=s[t]);e.config.canDrop=s.config.canDrop}}),s),e.useLayoutEffect((()=>(null===o.dropDom&&(o.dropDom=i.current),i.current=o.dropDom,o.subscribe(),()=>o.unSubscribe())),[]),o},Object.defineProperty(t,'__esModule',{value:!0})}));
