import{defineComponent as t,provide as e,inject as s,onMounted as r,onBeforeUnmount as i}from'vue';var n;function o(t,e,s,r){if('a'===s&&!r)throw new TypeError('Private accessor was defined without a getter');if('function'==typeof e?t!==e||!r:!e.has(t))throw new TypeError('Cannot read private member from an object whose class did not declare it');return'm'===s?r:'a'===s?r.call(t):r?r.value:e.get(t)}function a(t,e,s,r,i){if('m'===r)throw new TypeError('Private method is not writable');if('a'===r&&!i)throw new TypeError('Private accessor was defined without a setter');if('function'==typeof e?t!==e||!i:!e.has(t))throw new TypeError('Cannot write private member to an object whose class did not declare it');return'a'===r?i.call(t,s):i?i.value=s:e.set(t,s),s}!function(t){t.SCOPE='scope',t.SWARAJ='swaraj'}(n||(n={})),'function'==typeof SuppressedError&&SuppressedError;const h=Symbol('bind-drag'),d=Symbol('easy-dnd');function c(t){return t instanceof HTMLElement}function l(t){const e=()=>t.dropDom.getBoundingClientRect(),s=()=>t.context,r={event:null,getContext:s,getDropInstance:()=>s().dropInstance,getDragType:()=>s().dragType,getDragData:()=>s().dragData};return{...r,getDragDom:()=>s().dragDom,getDomRect:e,isOverTop:(t,r)=>{const{y:i,height:n}=t||e();return s().dragCoord.y<i+n/(r?3:2)},isOverBottom:(t,r)=>{const{y:i,height:n}=t||e();return s().dragCoord.y>i+n/(r?1.5:2)},isOverLeft:(t,r)=>{const{x:i,width:n}=t||e();return s().dragCoord.x<i+n/(r?3:2)},isOverRight:(t,r)=>{const{x:i,width:n}=t||e();return s().dragCoord.x>i+n/(r?1.5:2)},isOverRowCenter(t){return t=t||e(),!this.isOverTop(t,!0)&&!this.isOverBottom(t,!0)},isOverColumnCenter(t){return t=t||e(),!this.isOverLeft(t,!0)&&!this.isOverRight(t,!0)},getRubbish:()=>s().getRubbish(),_s:r}}function f({dndMode:t=n.SWARAJ,delay:e=0}={}){(e<0||isNaN(e))&&(e=0);const s={};return{dndMode:t,delay:e,dropInstance:null,dragCoord:{x:0,y:0},dragType:null,dragDom:null,dragData:null,enterDom:null,dragItemDragStarts:new Set,dragItemDragEnds:new Set,dropItemDragStarts:new Set,dropItemDragEnds:new Set,getRubbish:()=>s}}function g(t){const e=()=>t.context;return{event:null,getContext:e,getRubbish:()=>e().getRubbish()}}var m,p,u,v,D,w,E,b,x,y,M,W,k,S,L,I,T,R,C,P,A,O,N,J,j,B,X,Y;class _{constructor(t){this.monitor=g(this),m.set(this,!0),p.set(this,!1),u.set(this,!0),v.set(this,!1),D.set(this,void 0),this.registerDom=t=>(this.dragDom=t,c(t)&&(t[h]=!0),this),w.set(this,(t=>{const{dragDom:e}=this;c(e)?t?(e.setAttribute('draggable','true'),e.style.cursor='move'):(e.removeAttribute('draggable'),e.style.removeProperty('cursor')):a(this,u,t,'f')})),E.set(this,((t,e)=>{var s;const r=o(this,D,'f')[e];r&&(null===(s=this.dragDom)||void 0===s||s.classList[t](r))})),this.subscribe=()=>{if(o(this,v,'f'))return;const{dragDom:t,context:e}=this;if(!c(t))throw new Error('class Drag调用subscribe方法前必须调用registerDom方法');return o(this,w,'f').call(this,a(this,u,a(this,v,!0,'f'),'f')),e.dragItemDragStarts.add(o(this,I,'f')),e.dragItemDragEnds.add(o(this,T,'f')),o(this,S,'f').call(this),o(this,D,'f').hover&&t.addEventListener('mouseleave',o(this,x,'f')),t.addEventListener('dragstart',o(this,y,'f')),t.addEventListener('drag',o(this,M,'f')),t.addEventListener('dragend',o(this,W,'f')),this},this.unSubscribe=()=>{if(!o(this,v,'f'))return;const{dragDom:t,context:e}=this;t&&(o(this,w,'f').call(this,t[h]=a(this,u,a(this,v,!1,'f'),'f')),!o(this,m,'f')&&o(this,W,'f').call(this,this.monitor.event),o(this,L,'f').call(this),o(this,D,'f').hover&&t.removeEventListener('mouseleave',o(this,x,'f')),t.removeEventListener('dragstart',o(this,y,'f')),t.removeEventListener('drag',o(this,M,'f')),t.removeEventListener('dragend',o(this,W,'f')),this.dragDom=null),e.dragItemDragEnds.delete(o(this,T,'f')),e.dragItemDragStarts.delete(o(this,I,'f'))},b.set(this,(()=>{!this.context.dragDom&&o(this,u,'f')&&(a(this,p,!0,'f'),o(this,E,'f').call(this,'add','hover'))})),x.set(this,(()=>{o(this,p,'f')&&o(this,u,'f')&&(a(this,p,!1,'f'),o(this,E,'f').call(this,'remove','hover'))})),y.set(this,(t=>{var e;const{monitor:s,context:r,params:i,config:n}=this;t.stopPropagation(),s.event=t,r.dragType=n.type,r.dragDom=this.dragDom,r.dropInstance=null,r.dragData=null===(e=n.data)||void 0===e?void 0:e.call(n),a(this,m,!1,'f');const h=Array.from(this.dragDom.children);let d,c;for(d of h)d.style.pointerEvents='none';for(c of(i.dragStart&&i.dragStart(s),this.context.dragItemDragStarts))c();for(c of this.context.dropItemDragStarts)c();c=null,o(this,E,'f').call(this,'add','dragging')})),M.set(this,(t=>{const{dragCoord:e}=this.context;e.x=t.clientX,e.y=t.clientY,this.params.drag&&(this.monitor.event=t,this.params.drag(this.monitor))})),W.set(this,(t=>{const{monitor:e,params:s}=this;a(this,m,!0,'f'),e.event=t;const r=Array.from(this.dragDom.children);let i,n;for(i of r)i.style.pointerEvents='auto';for(n of(s.dragEnd&&s.dragEnd(e),this.context.dragItemDragEnds))n();for(n of this.context.dropItemDragEnds)n();o(this,k,'f').call(this),o(this,E,'f').call(this,'remove','dragging')})),k.set(this,(()=>{this.context.dragDom=null,this.context.dragData=null,this.context.enterDom=null,this.monitor.event=null})),S.set(this,(()=>{o(this,D,'f').hover&&this.dragDom&&this.dragDom.addEventListener('mouseenter',o(this,b,'f'))})),L.set(this,(()=>{o(this,D,'f').hover&&this.dragDom&&this.dragDom.removeEventListener('mouseenter',o(this,b,'f'))})),I.set(this,(()=>{o(this,x,'f').call(this),o(this,L,'f').call(this)})),T.set(this,(()=>{setTimeout((()=>o(this,S,'f').call(this)))})),this.params=t,this.config=t.config;const{className:e,context:s,defaultDraggable:r}=t.config;this.context=s,a(this,D,e||{},'f'),a(this,u,null==r||r,'f')}get draggable(){return o(this,u,'f')}set draggable(t){t!==o(this,u,'f')&&o(this,w,'f').call(this,a(this,u,t,'f'))}}m=new WeakMap,p=new WeakMap,u=new WeakMap,v=new WeakMap,D=new WeakMap,w=new WeakMap,E=new WeakMap,b=new WeakMap,x=new WeakMap,y=new WeakMap,M=new WeakMap,W=new WeakMap,k=new WeakMap,S=new WeakMap,L=new WeakMap,I=new WeakMap,T=new WeakMap;class H{constructor(t){this.monitor=l(this),this.isEnter=!1,this.prePosition={x:0,y:0},R.set(this,0),C.set(this,!1),P.set(this,void 0),A.set(this,!1),this.registerDom=t=>(this.dropDom=t,this),this.subscribe=()=>{if(o(this,C,'f'))return;const{dropDom:t}=this;if(!c(t))throw new Error('class Drop调用subscribe方法前必须调用registerDom方法');return a(this,C,!0,'f'),this.context.dropItemDragStarts.add(o(this,X,'f')),this.context.dropItemDragEnds.add(o(this,Y,'f')),t.addEventListener('dragenter',o(this,N,'f')),t.addEventListener('dragover',o(this,J,'f')),t.addEventListener('dragleave',o(this,j,'f')),t.addEventListener('drop',o(this,B,'f')),this},this.unSubscribe=()=>{if(!o(this,C,'f'))return;const{dropDom:t}=this;t&&(a(this,C,!1,'f'),this.context.dropItemDragEnds.delete(o(this,Y,'f')),this.context.dropItemDragStarts.delete(o(this,X,'f')),t.removeEventListener('dragenter',o(this,N,'f')),t.removeEventListener('dragover',o(this,J,'f')),t.removeEventListener('dragleave',o(this,j,'f')),t.removeEventListener('drop',o(this,B,'f')),this.dropDom=null)},O.set(this,((t,e)=>{var s;const r=o(this,P,'f')[e];r&&(null===(s=this.dropDom)||void 0===s||s.classList[t](r))})),this.canDrop=t=>{const{dragDom:e}=this.context;return!!e&&(this.monitor.event=t,(!this.dropDom[h]||e!==this.dropDom)&&(!!this.config.acceptType.has(this.monitor.getDragType())&&(this.config.canDrop?!!this.config.canDrop(this.monitor._s)&&(null==t||t.preventDefault(),!0):(null==t||t.preventDefault(),!0))))},this.stopPropagation=t=>{this.context.dndMode===n.SWARAJ&&t.stopPropagation()},N.set(this,(t=>{var e,s;if(this.stopPropagation(t),this.canDrop(t)&&0===(a(this,R,(s=o(this,R,'f'),e=s++,s),'f'),e)){this.context.enterDom=this.dropDom;const t=()=>{var t,e;this.enterTimer=null,this.context.enterDom===this.dropDom&&(this.isEnter=!0,null===(e=(t=this.params).dragEnter)||void 0===e||e.call(t,this.monitor),o(this,O,'f').call(this,'add','dragEnter'))},e=this.context.delay;e>0?this.enterTimer=setTimeout(t,e):t()}})),J.set(this,(t=>{var e,s;if(this.stopPropagation(t),this.canDrop(t)&&this.isEnter){const r=this.prePosition;r.x===t.clientX&&r.y===t.clientY||(r.x=t.clientX,r.y=t.clientY,null===(s=(e=this.params).dragOver)||void 0===s||s.call(e,this.monitor))}})),j.set(this,(t=>{var e,s,r;this.stopPropagation(t),this.canDrop(t)&&(a(this,R,(r=o(this,R,'f'),--r),'f')||(this.enterTimer?clearTimeout(this.enterTimer):this.isEnter&&(this.isEnter=!1,o(this,O,'f').call(this,'remove','dragEnter'),null===(s=(e=this.params).dragLeave)||void 0===s||s.call(e,this.monitor))))})),B.set(this,(t=>{var e,s;this.stopPropagation(t),this.canDrop(t)&&(this.context.dropInstance=this,o(this,O,'f').call(this,'remove','dragEnter'),null===(s=(e=this.params).drop)||void 0===s||s.call(e,this.monitor))})),X.set(this,(()=>{const{dragStart:t}=this.params;a(this,A,this.canDrop(),'f'),o(this,A,'f')&&(null==t||t(this.monitor),o(this,O,'f').call(this,'add','canDrop'))})),Y.set(this,(()=>{const{dragEnd:t}=this.params;t&&o(this,A,'f')&&(null==t||t(this.monitor)),o(this,O,'f').call(this,'remove','canDrop'),a(this,R,0,'f'),this.isEnter=!1,this.monitor.event=null})),this.params=t,this.config=t.config,a(this,P,this.config.className||{},'f'),this.context=this.config.context}}R=new WeakMap,C=new WeakMap,P=new WeakMap,A=new WeakMap,O=new WeakMap,N=new WeakMap,J=new WeakMap,j=new WeakMap,B=new WeakMap,X=new WeakMap,Y=new WeakMap;const q=t({name:'DndProvider',props:{type:{default:n.SWARAJ},delay:{type:Number,default:0}},setup:(t,{slots:s})=>(e(d,f(t)),()=>s.default?s.default():null)});class z extends _{constructor(){super(...arguments),this.dragRef=t=>(this.registerDom(t),t)}}class F extends H{constructor(){super(...arguments),this.dropRef=t=>{if('function'==typeof t)return e=>{this.registerDom(t(e))};this.registerDom(t)}}}function G(t){t.config.context=s(d);const e=new z(t);return r((()=>{e.subscribe()})),i((()=>{e.unSubscribe()})),e}function K(t){t.config.context=s(d);const e=new F(t);return r((()=>{e.subscribe()})),i((()=>{e.unSubscribe()})),e}export{h as BIND_DRAG,d as DND_CTX,n as DND_MODE,q as DndProvider,z as Drag,_ as DragCore,F as Drop,H as DropCore,g as createDragMonitor,l as createDropMonitor,f as createProvider,c as isElement,G as useDrag,K as useDrop};