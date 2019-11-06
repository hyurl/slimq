!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("mqtt"));else if("function"==typeof define&&define.amd)define(["mqtt"],t);else{var n="object"==typeof exports?t(require("mqtt")):t(e.mqtt);for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(this,(function(e){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";const r=n(1),i=n(6).default;class o{constructor(e){this.config=e,this.topics=Object.create(null),this.serial=i(0,!0),this.channel=null}connect(){return new Promise((e,t)=>{"undefined"==typeof mqtt&&(global.mqtt=n(7)),this.channel=mqtt.connect(this.config),this.channel.once("connect",()=>{e(this)}).once("error",e=>{t(e)}).on("message",(e,t)=>{let n=this.topics[e];if(n&&n.size>0){let e,i,o=e=>{i&&this.publish(i,e)};try{[e,i]=r.decode(t,[])}catch(n){e=t}for(let t of n.values())t.call(void 0,e,o)}})})}disconnect(){return new Promise(e=>{this.channel.end(!0,null,()=>e(this))})}publish(e,t,n=null,i=null){if(e=this.resolve(e),"function"==typeof n&&(i=n,n=null),i){let{clientId:o}=this.channel.options,s=`${e}@${o}$${this.serial.next().value}`;this.subscribe(s,e=>{this.unsubscribe(s),i(e)}),this.channel.publish(e,r.encode(t,s),n)}else this.channel.publish(e,r.encode(t),n);return this}subscribe(e,t,n){return e=this.resolve(e),"function"==typeof t&&(n=t,t=null),this.topics[e]?this.topics[e].add(n):(this.channel.subscribe(e,t),this.topics[e]=new Set([n])),this}unsubscribe(e,t=null){return e=this.resolve(e),this.topics[e]&&(t?this.topics[e].delete(t):(this.channel.unsubscribe(e),delete this.topics[e])),this}resolve(e){return e=e.replace(/\./g,"/"),this.config.scope&&(e=this.config.scope+"/"+e),e}}t.SliMQ=o,t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(2).sprintf,i=n(3),{isBufferLike:o}=n(5),s="function"==typeof Buffer,c=s?Buffer:Uint8Array;let a,u;function l(e){if(s)return Buffer.from(e);if(a)return a.encode(e);throw new Error("No implementation of text encoder was found")}function f(e){if(s)return Buffer.from(e).toString("utf8");if(u)return u.decode(e);throw new Error("No implementation of text decoder was found")}function p(e){return i(c,...e)}function d(...e){if(0===e.length)throw new SyntaxError("encode function requires at least one argument");let t=c.from([]);for(let n of e){let e=NaN,i=typeof n;switch(i){case"string":e=1,n=l(n);break;case"number":e=2,n=l(n.toString());break;case"bigint":e=3,n=l(n.toString());break;case"boolean":e=4,n=c.from([Number(n)]);break;case"object":case"undefined":null==n?(e=0,n=c.from([])):o(n)?e=6:(e=5,n=l(JSON.stringify(n)));break;default:throw new TypeError(`unsupported payload type (${i})`)}let s=[e],a=n.byteLength;if(a<=255)s.push(1,a);else{let e=a<=65535?16:64,t=r(`%0${e}b`,a);s.push(a<=65535?2:3);for(let n=0;n<e;)s.push(parseInt(t.slice(n,n+=8),2))}t=p([t,c.from(s),n])}return t}function h(e){return 3===e.length&&void 0===e[0]&&void 0===e[1]&&e[2]instanceof Uint8Array}function y(e,t){h(t)&&(e=p([t[2],e]));let n=function(e){if(e.byteLength<3)return null;let[t,n]=e,i=[0,3,4,10][n],o=-1;if(t>6||n>3)return!1;if(e.byteLength<i)return null;if(1===n)o=e[2];else{let t="",i=2===n?4:10;for(let n=2;n<i;n++)t+=r("%08b",e[n]);o=parseInt(t,2)}return{type:t,offset:i,length:o}}(e);if(!1!==n)if(null===n)t[0]=t[1]=void 0,t[2]=e;else{let{type:r,length:i,offset:o}=n;0!==o&&(t[0]=r,t[1]=i,t[2]=e.slice(o))}}function*b(e,t){for(0===t.length||h(t)?y(e,t):3===t.length&&(t[2]=p([t[2],e]));3===t.length&&t[2].byteLength>=t[1];){let[e,n,i]=t,o=i.slice(0,n);switch(i=i.slice(n),e){case 0:yield null;break;case 1:yield f(o);break;case 2:yield Number(f(o));break;case 3:yield BigInt(f(o));break;case 4:yield Boolean(o[0]);break;case 5:yield JSON.parse(f(o));break;case 6:yield o;break;default:throw TypeError(`unknown payload type (${r("0x02X",e)})`)}i.byteLength>0?y(i,t):t.splice(0,3)}}function g(e){return 2===arguments.length&&Array.isArray(arguments[1])?b(e,arguments[1]):b(e,[]).next().value}"function"==typeof TextEncoder&&(a=new TextEncoder),"function"==typeof TextDecoder&&(u=new TextDecoder("utf8")),t.encode=d,t.decode=g,t.wrap=function(e){let t=e.write.bind(e),n=e.on.bind(e),r=e.once.bind(e),i=e.prependListener.bind(e),o=e.prependOnceListener.bind(e),s=(e,t,n)=>{if("data"===t){let t=[];return e("data",e=>{for(let r of g(e,t))n(r)})}return e(t,n)};return e.write=function(e,n,r){return t(d(e),n,r)},e.on=e.addListener=function(e,t){return s(n,e,t)},e.once=function(e,t){return s(r,e,t)},e.prependListener=function(e,t){return s(i,e,t)},e.prependOnceListener=function(e,t){return s(o,e,t)},e}},function(e,t,n){var r;!function(){"use strict";var i={not_string:/[^s]/,not_bool:/[^t]/,not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/[bcdiefguxX]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[+-]/};function o(e){return function(e,t){var n,r,s,c,a,u,l,f,p,d=1,h=e.length,y="";for(r=0;r<h;r++)if("string"==typeof e[r])y+=e[r];else if("object"==typeof e[r]){if((c=e[r]).keys)for(n=t[d],s=0;s<c.keys.length;s++){if(null==n)throw new Error(o('[sprintf] Cannot access property "%s" of undefined value "%s"',c.keys[s],c.keys[s-1]));n=n[c.keys[s]]}else n=c.param_no?t[c.param_no]:t[d++];if(i.not_type.test(c.type)&&i.not_primitive.test(c.type)&&n instanceof Function&&(n=n()),i.numeric_arg.test(c.type)&&"number"!=typeof n&&isNaN(n))throw new TypeError(o("[sprintf] expecting number but found %T",n));switch(i.number.test(c.type)&&(f=n>=0),c.type){case"b":n=parseInt(n,10).toString(2);break;case"c":n=String.fromCharCode(parseInt(n,10));break;case"d":case"i":n=parseInt(n,10);break;case"j":n=JSON.stringify(n,null,c.width?parseInt(c.width):0);break;case"e":n=c.precision?parseFloat(n).toExponential(c.precision):parseFloat(n).toExponential();break;case"f":n=c.precision?parseFloat(n).toFixed(c.precision):parseFloat(n);break;case"g":n=c.precision?String(Number(n.toPrecision(c.precision))):parseFloat(n);break;case"o":n=(parseInt(n,10)>>>0).toString(8);break;case"s":n=String(n),n=c.precision?n.substring(0,c.precision):n;break;case"t":n=String(!!n),n=c.precision?n.substring(0,c.precision):n;break;case"T":n=Object.prototype.toString.call(n).slice(8,-1).toLowerCase(),n=c.precision?n.substring(0,c.precision):n;break;case"u":n=parseInt(n,10)>>>0;break;case"v":n=n.valueOf(),n=c.precision?n.substring(0,c.precision):n;break;case"x":n=(parseInt(n,10)>>>0).toString(16);break;case"X":n=(parseInt(n,10)>>>0).toString(16).toUpperCase()}i.json.test(c.type)?y+=n:(!i.number.test(c.type)||f&&!c.sign?p="":(p=f?"+":"-",n=n.toString().replace(i.sign,"")),u=c.pad_char?"0"===c.pad_char?"0":c.pad_char.charAt(1):" ",l=c.width-(p+n).length,a=c.width&&l>0?u.repeat(l):"",y+=c.align?p+n+a:"0"===u?p+a+n:a+p+n)}return y}(function(e){if(c[e])return c[e];var t,n=e,r=[],o=0;for(;n;){if(null!==(t=i.text.exec(n)))r.push(t[0]);else if(null!==(t=i.modulo.exec(n)))r.push("%");else{if(null===(t=i.placeholder.exec(n)))throw new SyntaxError("[sprintf] unexpected placeholder");if(t[2]){o|=1;var s=[],a=t[2],u=[];if(null===(u=i.key.exec(a)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(s.push(u[1]);""!==(a=a.substring(u[0].length));)if(null!==(u=i.key_access.exec(a)))s.push(u[1]);else{if(null===(u=i.index_access.exec(a)))throw new SyntaxError("[sprintf] failed to parse named argument key");s.push(u[1])}t[2]=s}else o|=2;if(3===o)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");r.push({placeholder:t[0],param_no:t[1],keys:t[2],sign:t[3],pad_char:t[4],align:t[5],width:t[6],precision:t[7],type:t[8]})}n=n.substring(t[0].length)}return c[e]=r}(e),arguments)}function s(e,t){return o.apply(null,[e].concat(t||[]))}var c=Object.create(null);t.sprintf=o,t.vsprintf=s,"undefined"!=typeof window&&(window.sprintf=o,window.vsprintf=s,void 0===(r=function(){return{sprintf:o,vsprintf:s}}.call(t,n,t,e))||(e.exports=r))}()},function(e,t,n){"use strict";var r,i=n(4),o=(r=i)&&r.__esModule?r:{default:r};e.exports=o.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){for(var t=0,n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];var o=!0,s=!1,c=void 0;try{for(var a,u=r[Symbol.iterator]();!(o=(a=u.next()).done);o=!0){var l=a.value;t+=l.length}}catch(e){s=!0,c=e}finally{try{!o&&u.return&&u.return()}finally{if(s)throw c}}var f=new e(t),p=0,d=!0,h=!1,y=void 0;try{for(var b,g=r[Symbol.iterator]();!(d=(b=g.next()).done);d=!0){var m=b.value;f.set(m,p),p+=m.length}}catch(e){h=!0,y=e}finally{try{!d&&g.return&&g.return()}finally{if(h)throw y}}return f}},function(e,t,n){"use strict";function r(e,t){return"object"==typeof e&&null!==e&&t.every(t=>t in e)}Object.defineProperty(t,"__esModule",{value:!0}),t.isArrayLike=function(e){return r(e,["length"])||"string"==typeof e},t.isCollectionLike=function(e,t=!1){return r(e,["size"])&&"function"==typeof e[Symbol.iterator]||!t&&(e instanceof WeakMap||e instanceof WeakSet)},t.isBufferLike=function(e){return r(e,["byteLength"])&&"function"==typeof e.slice},t.isErrorLike=function(e){return r(e,["name","message","stack"])},t.isPromiseLike=function(e){return r(e,[])&&"function"==typeof e.then}},function(e,t,n){"use strict";function*r(e,t){let n=e||0;for(;;)if(yield++n,n===Number.MAX_SAFE_INTEGER){if(!t)break;n=e||0}}e.exports=r,e.exports.default=r},function(t,n){t.exports=e}])}));
//# sourceMappingURL=slimq.js.map