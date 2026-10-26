var e={cirrus:{label:`Cirrus`,alias:`Mare's tail`,abbr:`Ci`,level:`high`,form:`filament`,opacity:.15},cirrostratus:{label:`Cirrostratus`,alias:`Veil cloud`,abbr:`Cs`,level:`high`,form:`stratiform`,opacity:.45},cirrocumulus:{label:`Cirrocumulus`,alias:`Mackerel sky`,abbr:`Cc`,level:`high`,form:`granular`,opacity:.25},altostratus:{label:`Altostratus`,alias:`Grey veil`,abbr:`As`,level:`mid`,form:`stratiform`,opacity:.9},altocumulus:{label:`Altocumulus`,alias:`Sheep cloud`,abbr:`Ac`,level:`mid`,form:`granular`,opacity:.45},nimbostratus:{label:`Nimbostratus`,alias:`Rain cloud`,abbr:`Ns`,level:`mid`,form:`stratiform`,opacity:1},stratus:{label:`Stratus`,alias:`Fog cloud`,abbr:`St`,level:`low`,form:`stratiform`,opacity:.95},stratocumulus:{label:`Stratocumulus`,alias:`Roll cloud`,abbr:`Sc`,level:`low`,form:`granular`,opacity:.75},cumulus:{label:`Cumulus`,alias:`Cotton cloud`,abbr:`Cu`,level:`low`,form:`convective`,opacity:.4},cumulonimbus:{label:`Cumulonimbus`,alias:`Thunderhead`,abbr:`Cb`,level:`low`,form:`convective`,opacity:.28}},t=Object.keys(e),n=e=>e<0?0:e>1?1:e;function r(e,t,r){let i=n((e-t)/(r-t));return i*i*(3-2*i)}var i=.65,a=.6;function o(e){let t=n(e);return{anvil:r(t,.68,1),velum:r(t,.22,.5)*(1-r(t,.68,.95)),distance:i,softness:a}}var s={cirrus:0,cirrostratus:0,cirrocumulus:0,altostratus:0,altocumulus:0,nimbostratus:0,stratus:0,stratocumulus:0,cumulus:0,cumulonimbus:0};function c(e){if(e==null)return{...s};if(typeof e==`string`)return{...s,[e]:1};if(Array.isArray(e)){let t={...s};for(let n of e)t[n]=1;return t}let r={...s};for(let i of t)r[i]=n(e[i]??0);return r}function l(e,t,i,a){let o=n(e),s=n(t),c=1-s,l=1-r(o,.45,.85),u=1-r(o,.5,.85);return{cirrus:r(o,.02,.45)*.7*l,cirrostratus:r(o,.1,.45)*.45*l,cirrocumulus:r(o,.14,.4)*.35*l*c,altostratus:r(o,.55,.9)*.85*c,altocumulus:r(o,.22,.55)*.7*(1-r(o,.7,.95))*c,nimbostratus:s*r(o,.5,.85),stratus:r(o,.5,.9)*a*.9,stratocumulus:r(o,.3,.75)*.85*(1-s*.7),cumulus:r(o,.02,.1)*Math.min(1,.22+o*.95)*u*c,cumulonimbus:n(i)*r(o,.02,.25)}}function u(r){let i=1;for(let n of t)i*=1-r[n]*e[n].opacity;return n(1-i)}var d={tau:2.2,windBase:.006,windGust:.22,evoBase:.07,evoGust:.09,windPerHour:.25,evoPerHour:.06},f=Math.PI*2;function p(e){return{filter:{...e.filter,tint:[e.filter.tint[0],e.filter.tint[1],e.filter.tint[2]]},tone:{...e.tone},polarizer:{...e.polarizer},celestial:{...e.celestial,radiant:e.celestial.radiant?[e.celestial.radiant[0],e.celestial.radiant[1]]:null},lens:{...e.lens},particles:{...e.particles},ground:{...e.ground},sunset:{...e.sunset},clouds:{...e.clouds},features:{...e.features}}}function m(e,t,n,r){let i=r/2;return(e+((t-e+r*1.5)%r-i)*n+r)%r}var h=class{current;windOff=41.7;evoOff=7.3;opts;constructor(e,t={}){this.current={...e,...p(e)},this.opts={...d,...t}}get wind(){return this.windOff}get evolution(){return this.evoOff}jump(e){Object.assign(this.current,e,p(e))}step(e,n){let r=this.opts,i=this.current,a=1-Math.exp(-n/r.tau),o=i.timeOfDay;i.timeOfDay=m(i.timeOfDay,e.timeOfDay,a,24);let s=(i.timeOfDay-o+36)%24-12;i.sunElevation+=(e.sunElevation-i.sunElevation)*a,i.sunAzimuth=m(i.sunAzimuth,e.sunAzimuth,a,f),i.moonElevation+=(e.moonElevation-i.moonElevation)*a,i.moonAzimuth=m(i.moonAzimuth,e.moonAzimuth,a,f),i.moonPhase+=(e.moonPhase-i.moonPhase)*a,i.moonEclipse+=(e.moonEclipse-i.moonEclipse)*a,i.cloudCover+=(e.cloudCover-i.cloudCover)*a;for(let n of t)i.clouds[n]+=(e.clouds[n]-i.clouds[n])*a;i.features.anvil+=(e.features.anvil-i.features.anvil)*a,i.features.velum+=(e.features.velum-i.features.velum)*a,i.features.distance+=(e.features.distance-i.features.distance)*a,i.features.softness+=(e.features.softness-i.features.softness)*a,i.rain+=(e.rain-i.rain)*a,i.snow+=(e.snow-i.snow)*a,i.wind+=(e.wind-i.wind)*a,i.thunder+=(e.thunder-i.thunder)*a,i.haze+=(e.haze-i.haze)*a;let c=i.filter,l=e.filter;c.amount+=(l.amount-c.amount)*a,c.saturation+=(l.saturation-c.saturation)*a,c.lift+=(l.lift-c.lift)*a,c.tint=[c.tint[0]+(l.tint[0]-c.tint[0])*a,c.tint[1]+(l.tint[1]-c.tint[1])*a,c.tint[2]+(l.tint[2]-c.tint[2])*a];let u=i.tone,d=e.tone;u.exposure+=(d.exposure-u.exposure)*a,u.contrast+=(d.contrast-u.contrast)*a,u.knee+=(d.knee-u.knee)*a,u.bleach+=(d.bleach-u.bleach)*a;let p=i.polarizer,h=e.polarizer;p.strength+=(h.strength-p.strength)*a,p.saturation+=(h.saturation-p.saturation)*a,p.stopLoss+=(h.stopLoss-p.stopLoss)*a,p.angle=m(p.angle,h.angle,a,Math.PI);let g=i.celestial,_=e.celestial;g.bortle+=(_.bortle-g.bortle)*a,g.milkyWay+=(_.milkyWay-g.milkyWay)*a,g.meteors+=(_.meteors-g.meteors)*a,g.aurora+=(_.aurora-g.aurora)*a,g.radiant=_.radiant?[_.radiant[0],_.radiant[1]]:null,i.lens.droplets+=(e.lens.droplets-i.lens.droplets)*a,i.particles.precipitation+=(e.particles.precipitation-i.particles.precipitation)*a,i.particles.contrails+=(e.particles.contrails-i.particles.contrails)*a,i.ground.sea+=(e.ground.sea-i.ground.sea)*a,i.ground.swell+=(e.ground.swell-i.ground.swell)*a,i.sunset.warmth+=(e.sunset.warmth-i.sunset.warmth)*a,i.sunset.glow+=(e.sunset.glow-i.sunset.glow)*a,this.windOff+=(r.windBase+i.wind*r.windGust)*n+Math.abs(s)*r.windPerHour,this.evoOff+=(r.evoBase+i.wind*r.evoGust)*n+Math.abs(s)*r.evoPerHour}},g=[.82246197,.17753803,0,.0331942,.9668058,0,.01708263,.07239744,.91051993];function _(e){let t=t=>[e[t],e[t+3],e[t+6]].map(e=>e.toFixed(8)).join(`, `);return`mat3(${t(0)},
       ${t(1)},
       ${t(2)})`}var v={"dark-sky":{label:`Dark sky`,bortle:2,milkyWay:1,meteors:5,radiant:null,aurora:0},rural:{label:`Rural`,bortle:4,milkyWay:.45,meteors:5,radiant:null,aurora:0},suburban:{label:`Suburban`,bortle:6,milkyWay:0,meteors:0,radiant:null,aurora:0},city:{label:`City`,bortle:8,milkyWay:0,meteors:0,radiant:null,aurora:0},perseids:{label:`Perseids`,bortle:3,milkyWay:.75,meteors:100,radiant:[1.05,.79],aurora:0},geminids:{label:`Geminids`,bortle:3,milkyWay:.75,meteors:150,radiant:[.98,1.48],aurora:0},aurora:{label:`Aurora`,bortle:2,milkyWay:.55,meteors:5,radiant:null,aurora:.8}};Object.keys(v);var y={bortle:6,milkyWay:0,meteors:0,radiant:null,aurora:0};function b(e){return Math.min(1,Math.max(0,(5.5-e)/3.5))}function x(e){return{bortle:e.bortle,milkyWay:e.milkyWay,meteors:e.meteors,radiant:e.radiant?[e.radiant[0],e.radiant[1]]:null,aurora:e.aurora}}var S=(e,t,n)=>Math.min(n,Math.max(t,e));function C(e){if(e==null)return x(y);if(typeof e==`string`)return x(v[e]??y);let t=e.id?v[e.id]??y:y,n=S(e.bortle??t.bortle,1,9);return x({bortle:n,milkyWay:S(e.milkyWay??(e.id?t.milkyWay:b(n)),0,1),meteors:Math.max(0,e.meteors??t.meteors),radiant:e.radiant===void 0?t.radiant:e.radiant,aurora:S(e.aurora??t.aurora,0,1)})}var w={none:{label:`None`,amount:0,tint:[1,1,1],saturation:1,lift:0},sepia:{label:`Sepia`,amount:1,tint:[1.07,.93,.72],saturation:.1,lift:.02},mono:{label:`Monochrome`,amount:1,tint:[1,1,1],saturation:0,lift:0},faded:{label:`Faded`,amount:1,tint:[1.02,.99,.94],saturation:.35,lift:.06},cyanotype:{label:`Cyanotype`,amount:1,tint:[.72,.9,1.12],saturation:.08,lift:.03},gold:{label:`Gold`,amount:1,tint:[1.15,.95,.6],saturation:.45,lift:.02},ash:{label:`Ash`,amount:1,tint:[.92,.95,1],saturation:.2,lift:.04}};Object.keys(w);var T=w.none;function E(e){return{amount:e.amount,tint:[e.tint[0],e.tint[1],e.tint[2]],saturation:e.saturation,lift:e.lift}}function ee(e){if(e==null||e===!1)return E(T);if(e===!0)return E(w.sepia);if(typeof e==`string`)return E(w[e]??T);let t=e.id?w[e.id]??T:{amount:1,tint:[1,1,1],saturation:0,lift:0};return E({amount:e.amount??t.amount,tint:e.tint??t.tint,saturation:e.saturation??t.saturation,lift:e.lift??t.lift})}var D={land:{label:`Land`,sea:0,swell:.4},sea:{label:`Sea`,sea:1,swell:.4}};Object.keys(D);var O={sea:0,swell:.4},te=e=>Math.min(1,Math.max(0,e));function ne(e){if(e==null)return{...O};if(typeof e==`string`){let t=D[e]??D.land;return{sea:t.sea,swell:t.swell}}return{sea:te(e.sea??1),swell:te(e.swell??O.swell)}}var re={droplets:1},ie=e=>Math.min(1,Math.max(0,e));function ae(e){let t=e?.droplets;return{droplets:t==null?re.droplets:typeof t==`boolean`?+!!t:ie(t)}}var oe={warmth:1,glow:1},se=(e,t,n)=>Math.min(n,Math.max(t,e));function ce(e){return{warmth:se(e?.warmth??oe.warmth,0,2),glow:se(e?.glow??oe.glow,0,2)}}var le={precipitation:1,contrails:0},ue=e=>Math.min(1,Math.max(0,e));function de(e){let t=e?.precipitation,n=e?.contrails;return{precipitation:t==null?le.precipitation:typeof t==`boolean`?+!!t:ue(t),contrails:n==null?le.contrails:typeof n==`boolean`?+!!n:ue(n)}}var k={none:{label:`None`,strength:0,angle:0,saturation:0,stopLoss:0},light:{label:`Light CPL`,strength:.45,angle:0,saturation:.2,stopLoss:0},strong:{label:`Strong CPL`,strength:.85,angle:0,saturation:.4,stopLoss:0},crossed:{label:`Crossed CPL`,strength:.85,angle:Math.PI/2,saturation:.1,stopLoss:0}};Object.keys(k);var A=k.none;function j(e){return{strength:e.strength,angle:e.angle,saturation:e.saturation,stopLoss:e.stopLoss}}var fe=e=>Math.min(1,Math.max(0,e));function pe(e){if(e==null||e===!1)return j(A);if(e===!0)return j(k.light);if(typeof e==`string`)return j(k[e]??A);let t=e.id?k[e.id]??A:A;return j({strength:fe(e.strength??t.strength),angle:e.angle??t.angle,saturation:fe(e.saturation??t.saturation),stopLoss:fe(e.stopLoss??t.stopLoss)})}var M=Math.PI/180,me=864e5,he=2440588,ge=2451545,_e=23.4397*M;function ve(e,t){let n=e.getTime()/me-.5+he-ge,r=M*(357.5291+.98560028*n),i=r+M*(1.9148*Math.sin(r)+.02*Math.sin(2*r)+3e-4*Math.sin(3*r))+M*102.9372+Math.PI,a=Math.asin(Math.sin(_e)*Math.sin(i));return ye(Math.atan2(Math.sin(i)*Math.cos(_e),Math.cos(i)),a,n,t)}function ye(e,t,n,r){let i=M*-r.longitude,a=M*r.latitude,o=M*(280.16+360.9856235*n)-i-e;return{elevation:Math.asin(Math.sin(a)*Math.sin(t)+Math.cos(a)*Math.cos(t)*Math.cos(o)),azimuth:((Math.atan2(Math.sin(o),Math.cos(o)*Math.sin(a)-Math.tan(t)*Math.cos(a))+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)}}function be(e){return e.getTime()/me-.5+he-ge}function xe(e){let t=Math.min(Math.max(e.getUTCFullYear(),1950),2050);return t<2e3?29+(t-1950)*.68:64+(t-2e3)*.2}function Se(e){return(be(e)+xe(e)/86400)/36525}var N=e=>(e%360+360)%360,Ce=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],[1,0,-2,0,-487,-1739],[2,0,-1,-2,0,8752]],we=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],[0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],[0,1,0,-1,-1344],[1,0,0,-1,-1335],[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833]];function Te(e){let t=Se(e),n=t*t,r=n*t,i=r*t,a=M*N(218.3164477+481267.88123421*t-.0015786*n+r/538841-i/65194e3),o=M*N(297.8501921+445267.1114034*t-.0018819*n+r/545868-i/113065e3),s=M*N(357.5291092+35999.0502909*t-1536e-7*n+r/2449e4),c=M*N(134.9633964+477198.8675055*t+.0087414*n+r/69699-i/14712e3),l=M*N(93.272095+483202.0175233*t-.0036539*n-r/3526e3+i/86331e4),u=M*N(119.75+131.849*t),d=M*N(53.09+479264.29*t),f=M*N(313.45+481266.484*t),p=1-.002516*t-74e-7*n,m=e=>e===0?1:Math.abs(e)===1?p:p*p,h=0,g=0,_=0;for(let[e,t,n,r,i,a]of Ce){let u=e*o+t*s+n*c+r*l,d=m(t);h+=i*d*Math.sin(u),g+=a*d*Math.cos(u)}for(let[e,t,n,r,i]of we)_+=i*m(t)*Math.sin(e*o+t*s+n*c+r*l);return h+=3958*Math.sin(u)+1962*Math.sin(a-l)+318*Math.sin(d),_+=-2235*Math.sin(a)+382*Math.sin(f)+175*Math.sin(u-l)+175*Math.sin(u+l)+127*Math.sin(a-c)-115*Math.sin(a+c),{longitude:M*N(a/M+h/1e6),latitude:_/1e6*M,distance:385000.56+g/1e3}}function Ee(e){let t=Se(e),n=280.46646+36000.76983*t+3032e-7*t*t,r=M*N(357.52911+35999.05029*t-1537e-7*t*t),i=(1.914602-.004817*t-14e-6*t*t)*Math.sin(r)+(.019993-101e-6*t)*Math.sin(2*r)+289e-6*Math.sin(3*r),a=.016708634-42037e-9*t,o=1.000001018*(1-a*a)/(1+a*Math.cos(r+M*i));return{longitude:M*N(n+i-.005691611/o),distance:o}}function De(e){return M*(23.4392911-.0130042*Se(e))}function Oe(e,t){let n=be(e),{longitude:r,latitude:i}=Te(e),a=De(e),o=Math.asin(Math.sin(i)*Math.cos(a)+Math.cos(i)*Math.sin(a)*Math.sin(r)),{elevation:s,azimuth:c}=ye(Math.atan2(Math.sin(r)*Math.cos(a)-Math.tan(i)*Math.sin(a),Math.cos(r)),o,n,t);return{elevation:s,azimuth:c,phase:je(ve(e,t),{elevation:s,azimuth:c})}}function ke(e){let t=Te(e),n=Ee(e),r=Math.cos(t.latitude)*Math.cos(t.longitude-n.longitude-Math.PI),i=Math.acos(Math.min(Math.max(r,-1),1))/M,a=Math.asin(6378.14/t.distance)/M,o=.266563/n.distance,s=.00244/n.distance,c=.272481*a,l=1.02*(.99834*a-o+s),u=1.02*(.99834*a+o+s);return{umbra:Ae(c,l,i),penumbra:Ae(c,u,i),magnitude:(l+c-i)/(2*c)}}function Ae(e,t,n){if(n>=e+t)return 0;if(n<=t-e)return 1;if(n<=e-t)return t*t/(e*e);let r=e=>Math.acos(Math.min(Math.max(e,-1),1)),i=r((n*n+e*e-t*t)/(2*n*e)),a=r((n*n+t*t-e*e)/(2*n*t)),o=e*e*i+t*t*a-.5*Math.sqrt(Math.max((-n+e+t)*(n+e-t)*(n-e+t)*(n+e+t),0));return Math.min(Math.max(o/(Math.PI*e*e),0),1)}function je(e,t){let n=Me(e),r=Me(t);return(1-(n[0]*r[0]+n[1]*r[1]+n[2]*r[2]))/2}function Me(e){let t=Math.cos(e.elevation);return[t*Math.sin(e.azimuth),Math.sin(e.elevation),t*Math.cos(e.azimuth)]}function Ne(e){let t=(e-6)/12;return{elevation:Math.asin(Math.sin(t*Math.PI)*.72),azimuth:Math.PI/2+t*Math.PI}}function Pe(e){return{...Ne(e+12),phase:1}}function Fe(e){if(e instanceof Date)return Number.isNaN(e.getTime())?null:e;if(typeof e==`string`&&/\d{4}-\d{2}-\d{2}/.test(e)){let t=new Date(e);return Number.isNaN(t.getTime())?null:t}return null}function Ie(e){if(typeof e==`number`)return(e%24+24)%24;let t=Fe(e);if(t)return t.getHours()+t.getMinutes()/60+t.getSeconds()/3600;if(typeof e==`string`){let t=/^(\d{1,2})(?::(\d{2}))?/.exec(e.trim());if(t)return((Number(t[1])+Number(t[2]??0)/60)%24+24)%24}return 12}var Le={neutral:{label:`Neutral`,exposure:0,contrast:1,knee:.8,bleach:0},flat:{label:`Flat`,exposure:.15,contrast:.82,knee:.55,bleach:.25},punch:{label:`Punch`,exposure:-.2,contrast:1.22,knee:.85,bleach:.1},filmic:{label:`Filmic`,exposure:.1,contrast:1.08,knee:.42,bleach:.55},blown:{label:`Blown`,exposure:.85,contrast:.95,knee:.7,bleach:.4}};Object.keys(Le);var Re=Le.neutral;function ze(e){return{exposure:e.exposure,contrast:e.contrast,knee:e.knee,bleach:e.bleach}}function Be(e){if(e==null)return ze(Re);if(typeof e==`string`)return ze(Le[e]??Re);let t=e.id?Le[e.id]??Re:Re;return ze({exposure:e.exposure??t.exposure,contrast:e.contrast??t.contrast,knee:Math.min(.99,Math.max(.02,e.knee??t.knee)),bleach:Math.min(1,Math.max(0,e.bleach??t.bleach))})}var Ve={clear:{label:`Clear`,cloudCover:0,windSpeed:2,visibility:45},fair:{label:`Fair`,cloudCover:.22,windSpeed:3,visibility:35},summer:{label:`Summer sky`,cloudCover:.38,windSpeed:3,visibility:25,convection:.7},overcast:{label:`Overcast`,cloudCover:.82,windSpeed:5,visibility:15},fog:{label:`Fog`,cloudCover:.75,windSpeed:1,visibility:.6},rain:{label:`Rain`,cloudCover:.95,windSpeed:7,visibility:8,precipitation:8,thunder:.08},thunderstorm:{label:`Thunderstorm`,cloudCover:.97,windSpeed:12,visibility:5,precipitation:25,thunder:1,convection:.5},snow:{label:`Snow`,cloudCover:.9,windSpeed:3,visibility:4,precipitation:3,precipitationType:`snow`},typhoon:{label:`Typhoon`,cloudCover:1,windSpeed:30,visibility:6,precipitation:40,thunder:.5}};Object.keys(Ve);var P=e=>e<0?0:e>1?1:e;function He(e){return P(P(e/30)**.55)}function Ue(e){return P(P(e/33)**.8)}function We(e){return P(P(e/5)**.6)}function Ge(e){return P(P((20-e)/20)**2.6)}function Ke(e){let t=typeof e==`string`?Ve[e]??Ve.clear:e??{},n=t.precipitation??0,r=t.precipitationType===`snow`,i=r?0:He(n),a=r?We(n):0,s=Ge(t.visibility??30),d=P(t.convection??0),f,p;t.clouds==null?(p=P(t.cloudCover??0),f=l(p,Math.max(i,a),d,s)):(f=c(t.clouds),p=u(f));let m=o(f.cumulonimbus);return{clouds:f,features:{anvil:P(t.features?.anvil??m.anvil),velum:P(t.features?.velum??m.velum),distance:P(t.features?.distance??m.distance),softness:P(t.features?.softness??m.softness)},cloudCover:p,rain:i,snow:a,wind:Ue(t.windSpeed??0),thunder:P(t.thunder??0),haze:s}}var qe={yaw:Math.PI,pitch:.46,fov:.86},Je=[{yaw:Math.PI/2,pitch:0,fov:Math.PI/2},{yaw:-Math.PI/2,pitch:0,fov:Math.PI/2},{yaw:0,pitch:Math.PI/2,fov:Math.PI/2},{yaw:0,pitch:-Math.PI/2,fov:Math.PI/2},{yaw:0,pitch:0,fov:Math.PI/2},{yaw:Math.PI,pitch:0,fov:Math.PI/2}],Ye={time:12,weather:`clear`};function Xe(e){let t=e.time??Ye.time,n=Ie(t),r=Fe(t),i=e.location&&r?ve(r,e.location):Ne(n),a=e.location&&r?Oe(r,e.location):Pe(n),o=e.location&&r?ke(r).umbra:0;return{timeOfDay:n,sunElevation:i.elevation,sunAzimuth:i.azimuth,moonElevation:a.elevation,moonAzimuth:a.azimuth,moonPhase:a.phase,moonEclipse:o,...Ke(e.weather??Ye.weather),filter:ee(e.filter),tone:Be(e.tone),polarizer:pe(e.polarizer),celestial:C(e.celestial),lens:ae(e.lens),particles:de(e.particles),ground:ne(e.ground),sunset:ce(e.sunset)}}function Ze(e){return{...qe,...e}}var Qe=.15,F=e=>Math.min(1,Math.max(0,e)),I=(e,t,n)=>{let r=F((n-e)/(t-e));return r*r*(3-2*r)},L=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,$e=e=>e<=.0031308?e*12.92:1.055*e**(1/2.4)-.055,et=e=>.2126*e[0]+.7152*e[1]+.0722*e[2];function tt(e,t){let n=Math.cos(e);return[n*Math.sin(t),Math.sin(e),n*Math.cos(t)]}function nt(e){let t=[L(e[0]),L(e[1]),L(e[2])],n=Math.max(t[0],t[1],t[2],1e-6);return[t[0]/n,t[1]/n,t[2]/n]}function rt(e,t){let n=Math.cos(t.yaw),r=Math.sin(t.yaw),i=e[0]*n-e[2]*r,a=e[0]*r+e[2]*n,o=Math.cos(t.pitch),s=Math.sin(t.pitch);return[i,e[1]*o-a*s,e[1]*s+a*o]}function it(e,t,n,r,i,a,o){let s=tt(e,t),c=rt(s,n),l=Math.tan(n.fov/2),u=Math.max(c[2],1e-4);return{direction:s,elevation:e,azimuth:t,view:c,screen:{x:c[0]/(u*l*r)*.5+.5,y:.5-c[1]/(u*l)*.5,inFront:c[2]>0},color:i,visibility:a,intensity:a*o}}function at(e,t,n){let r=Math.sin(e.sunElevation),i=1-I(-.17,.14,r),a=I(.35,.02,Math.abs(r)),o=F(Math.max(e.rain,Math.max(e.snow*.5,e.wind*.7))),s=I(-.06,.06,r)*F(1-e.cloudCover*.75-o*.95),c=[1+(1.05-1)*a,.98+-.38*a,.92+(.3-.92)*a],l=it(e.sunElevation,e.sunAzimuth,t,n,nt(c),s,1),u=I(-.03,.03,Math.sin(e.moonElevation))*F(1-e.cloudCover*.9-o),d=F(e.moonEclipse??0),f=it(e.moonElevation,e.moonAzimuth,t,n,nt([1,.96-.5*d,.88-.62*d]),u,Qe*e.moonPhase*(.4+.6*i)*(1-.9*d));return{sun:l,moon:f,key:l.intensity<=0&&f.intensity<=0?null:l.intensity>=f.intensity?`sun`:`moon`}}var R=4,z=16;function ot(e,t,n){e=Math.max(1,Math.round(e)),t=Math.max(1,Math.round(t));let r=e*R,i=t*R;return{cols:e,rows:t,environment:n,width:n?Math.max(r,z*6):r,height:n?i+z:i,frameHeight:i}}var B=Array.from({length:256},(e,t)=>L(t/255));function st(e){let t=[Math.max(0,e[0]),Math.max(0,e[1]),Math.max(0,e[2])];return{srgb:[$e(t[0]),$e(t[1]),$e(t[2])],linear:t,luminance:et(t)}}var V=null;function ct(){if(V)return V;let e=z;return V=Je.map(t=>{let n=[],r=Math.cos(t.pitch),i=Math.sin(t.pitch);for(let t=0;t<e;t++)for(let a=0;a<e;a++){let o=(a+.5)/e*2-1,s=(t+.5)/e*2-1,c=Math.hypot(o,s,1),l=(s*r+i)/c;n.push({weight:(1+o*o+s*s)**-1.5,elevation:Math.asin(Math.max(-1,Math.min(1,l)))})}return n}),V}var H=class{r=0;g=0;b=0;w=0;add(e,t,n,r){this.r+=e*r,this.g+=t*r,this.b+=n*r,this.w+=r}sample(){let e=this.w||1;return st([this.r/e,this.g/e,this.b/e])}};function lt(e,t){let{cols:n,rows:r,width:i}=t,a=(e,t)=>(t*i+e)*4,o=[],s=new H;for(let t=0;t<r;t++){let i=(r-1-t)*R;for(let t=0;t<n;t++){let n=new H;for(let r=i;r<i+R;r++)for(let i=t*R;i<(t+1)*R;i++){let t=a(i,r);n.add(B[e[t]],B[e[t+1]],B[e[t+2]],1)}s.add(n.r/n.w,n.g/n.w,n.b/n.w,1),o.push(n.sample())}}let c={average:s.sample(),grid:{cols:n,rows:r,cells:o}};if(!t.environment)return{frame:c,environment:null};let l=ct(),u=l.map(()=>new H),d=new H,f=new H,p=new H,m=new H,h=Math.PI/3,g=Math.PI/12,_=z;l.forEach((n,r)=>{for(let i=0;i<_;i++)for(let o=0;o<_;o++){let s=n[i*_+o],c=a(r*_+o,t.frameHeight+i),l=B[e[c]],v=B[e[c+1]],y=B[e[c+2]];u[r].add(l,v,y,s.weight),s.elevation>0?(d.add(l,v,y,s.weight),s.elevation>h&&p.add(l,v,y,s.weight),s.elevation<g&&m.add(l,v,y,s.weight)):f.add(l,v,y,s.weight)}});let[v,y,b,x,S,C]=u.map(e=>e.sample());return{frame:c,environment:{sky:d.sample(),ground:f.sample(),zenith:p.sample(),horizon:m.sample(),directions:{east:v,west:y,up:b,down:x,north:S,south:C}}}}function U(e,t,n){return st([e.linear[0]+(t.linear[0]-e.linear[0])*n,e.linear[1]+(t.linear[1]-e.linear[1])*n,e.linear[2]+(t.linear[2]-e.linear[2])*n])}function ut(e,t,n){let r=e.frame.grid,i=t.frame.grid;if(r.cols!==i.cols||r.rows!==i.rows||!e.environment!=!t.environment)return t;let a={average:U(e.frame.average,t.frame.average,n),grid:{cols:i.cols,rows:i.rows,cells:i.cells.map((e,t)=>U(r.cells[t],e,n))}},o=e.environment,s=t.environment;if(!o||!s)return{frame:a,environment:null};let c=e=>U(o.directions[e],s.directions[e],n);return{frame:a,environment:{sky:U(o.sky,s.sky,n),ground:U(o.ground,s.ground,n),zenith:U(o.zenith,s.zenith,n),horizon:U(o.horizon,s.horizon,n),directions:{east:c(`east`),west:c(`west`),up:c(`up`),down:c(`down`),north:c(`north`),south:c(`south`)}}}}var W=1/32,dt=12,ft=6,pt=3,mt=.88,ht=.8,gt=1.1,_t=2e3,vt=6e4,yt=5e3,bt=class{budget;min;max;samples=[];expected=0;skip=pt;changedAt=-1/0;probeWait=_t;lastProbeAt=-1/0;scale;constructor(e){this.budget=Math.max(.1,e.budget),this.max=Math.min(1,Math.max(W,e.max??1)),this.min=Math.min(this.max,Math.max(W,e.min??.5)),this.scale=this.max}update(e,t,n){let r=t*this.scale*this.scale;Math.abs(r-this.expected)>this.expected*.03&&(this.expected=r,this.samples=[],this.skip=pt);for(let t of e)t.ms>0&&t.pixels>0&&(Math.abs(t.pixels-this.expected)>this.expected*.03||(this.skip>0?this.skip--:this.samples.push(t.ms)));if(this.samples.length>dt&&this.samples.splice(0,this.samples.length-dt),this.samples.length<ft||t<=0)return this.scale;let i=xt(this.samples),a=this.scale;return i>this.budget?(a=Math.floor(this.scale*Math.sqrt(this.budget*mt/i)/W)*W,a>=this.scale&&(a=this.scale-W),n-this.lastProbeAt<yt&&(this.probeWait=Math.min(vt,this.probeWait*2))):i<this.budget*ht&&this.scale<this.max&&n-this.changedAt>=this.probeWait?(a=Math.max(this.scale+W,Math.floor(this.scale*gt/W)*W),this.lastProbeAt=n):n-this.changedAt>=3e4&&(this.probeWait=_t),a=Math.min(this.max,Math.max(this.min,a)),a!==this.scale&&(this.scale=a,this.changedAt=n,this.expected=t*a*a,this.samples=[],this.skip=pt),this.scale}};function xt(e){let t=[...e].sort((e,t)=>e-t),n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2}var G=256,K=Math.fround,St=K(.1031),Ct=K(33.33),wt=e=>K(e-Math.floor(e));function q(e,t){let n=wt(K(e*St)),r=wt(K(t*St)),i=n,a=K(K(K(n*K(r+Ct))+K(r*K(i+Ct)))+K(i*K(n+Ct)));return n=K(n+a),r=K(r+a),i=K(i+a),wt(K(K(n+r)*i))}var Tt=null;function Et(){if(Tt)return Tt;let e=new Uint8Array(G*G);for(let t=0;t<G;t++)for(let n=0;n<G;n++)e[t*G+n]=Math.round(q(n,t)*255);return Tt=e,e}var Dt=null;function Ot(){if(Dt)return Dt;let e=Et(),t=G,n=new Uint8Array(t*t*4);for(let r=0;r<t;r++){let i=(r+1)%t;for(let a=0;a<t;a++){let o=(a+1)%t,s=(r*t+a)*4;n[s]=e[r*t+a],n[s+1]=e[r*t+o],n[s+2]=e[i*t+a],n[s+3]=e[i*t+o]}}return Dt=n,n}var J=4,Y=512,X=40,Z=72,kt=.25;function At(e){return Math.exp(.8515*(Math.exp(2.585*(e-.65))-1))}function jt(e){return e*.12}function Q(e,t){let n=Et(),r=G,i=Math.floor(e),a=Math.floor(t),o=e-i,s=t-a;o=o*o*(3-2*o),s=s*s*(3-2*s);let c=(i%r+r)%r,l=(a%r+r)%r,u=(c+1)%r,d=(l+1)%r,f=n[l*r+c]/255,p=n[l*r+u]/255,m=n[d*r+c]/255,h=n[d*r+u]/255,g=f+(p-f)*o;return g+(m+(h-m)*o-g)*s}function Mt(e,t,n){let r=Math.floor(t),i=t-r,a=(q(e,n)-.5)*.4;return e>r-.5?r+i*(.5+a):e+.5+a}var Nt=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function Pt(e){return(Math.sqrt(1+2.4*Math.max(e-1,0))-1)/1.2}function Ft(e,t){let n=t*1.1,r=e*.7,i=1-Math.min(r/n,1);return n*(1-i*i)+.25*Math.max(r-n,0)}function It(e,t,n,r){let i=Math.min(Math.max(Math.max(t,Math.max(n*.5,r*.7)),0),1);return Math.max(e,.3)*(1-i*.6)}function Lt(e,t,n){let r=Math.round(Math.min(Math.max(n,0),1)*65025),i=Math.floor(r/255);e[t]=i,e[t+1]=r-i*255}function Rt(e,t,n=.3,r=new Uint8Array(Y*J*4)){let i=At(e),a=jt(t),o=17.3,s=9.1,c=1.05+1.35*n,l=.44+.11*n,u=.2*(.6+.4*n)*Nt(.02,.2,n);return[[X,0],[Z,17]].forEach(([e,n],d)=>{let f=e*i,p=Math.floor(f),m=f-p,h=t*.35*(d===0?1:1.3),g=Math.fround(n+3.1),_=Math.fround(n+7.7),v=Math.fround(n+5.3),y=Math.min(Math.ceil(f)+1,Y);for(let e=0;e<y;e++){let t=Mt(e,f,n)*2*Math.PI/f,y=Math.sin(t)*.85*i,b=Math.cos(t)*.85*i+a,x=y*2.03+o,S=b*2.03+s,C=.5*Q(y,b)+.25*Q(x,S),w;if(d===0){let t=e*4,n=x*2.03+o,i=S*2.03+s,a=.125*Q(n,i)+.0625*Q(n*2.03+o,i*2.03+s),u=b-kt,d=u*2.03+s,f=.5*Q(y,u)+.25*Q(x,d);Lt(r,t,C+a),Lt(r,t+2,f+a),w=Ft(Pt((Math.max(C+a-.42,0)*4.6)**1.5*c+.25),l)}else w=Nt(.35,.47,C+.094)*u;let T=q(e,g),E=q(e,_),ee=q(e,v),D=e>p-.5,O=(q(e,n)-.5)*.4,te=w*(.74+.26*(.5+.5*Math.sin(h*(.7+.6*T)+E*6.2831853)))*(D?Nt(0,.6,m):1),ne=((d+1)*Y+e)*4;Lt(r,ne,te*.5),Lt(r,ne+2,D?m*(.5+O):.5+O);let re=(3*Y+e)*4+d*2;r[re]=Math.round(T*255),r[re+1]=Math.round(ee*255)}}),r}var zt=`
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`,Bt=`
// highp is optional for fragment shaders in WebGL1. Without this guard the
// shader fails to compile outright on older mobile GPUs, and the sky silently
// disappears (available === false). Banding gets worse at mediump, but a
// degraded sky beats no sky.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
precision highp sampler2D;
#else
precision mediump float;
precision mediump sampler2D;
#endif

// The sampler's precision is what carries vnoise's interpolation, not the
// texel's: at the default lowp a filtered fetch comes back in ~1/128 steps and
// every cloud edge terraces. The texels themselves are only 8-bit endpoints.
uniform sampler2D u_noise;   // the baked value-noise lattice \u2014 see noise.ts
#ifdef FEAT_CB
uniform sampler2D u_noiseQ;  // the same lattice, each texel's square of four in rgba (vnoiseHQ)
uniform sampler2D u_turrets; // each turret's thrust, height, center and hashes this frame, worked out on the CPU (turretThrust, rowTurret)
#endif

uniform vec4  u_frame;     // the viewport being drawn: origin xy, size zw (pixels)
uniform float u_aspect;    // width / height of the picture this viewport stands for
uniform float u_time;      // seconds
uniform vec3  u_cam;       // yaw, pitch, fov (radians)
uniform vec2  u_sun;       // sun's elevation, azimuth (radians)
uniform vec3  u_moon;      // moon's elevation, azimuth (radians), and its light: the lit fraction of the disc, dimmed by the Earth's shadow
uniform float u_moonEclipse; // how much of the moon's disc is in the Earth's umbra, 0..1
uniform float u_cover;     // 0..1 total occlusion (accumulated from the cloud-genus mix)
uniform vec3  u_high;      // amount of the ten cloud genera: cirrus Ci, cirrostratus Cs, cirrocumulus Cc
uniform vec3  u_mid;       //                                 altostratus As, altocumulus Ac, nimbostratus Ns
uniform vec4  u_low;       //                                 stratus St, stratocumulus Sc, cumulus Cu, cumulonimbus Cb
uniform float u_rain;      // 0..1 rain
uniform float u_snow;      // 0..1 snow
uniform float u_wind;      // 0..1 wind
uniform float u_thunder;   // 0..1 thunder
uniform float u_haze;      // 0..1 haze
uniform vec4  u_cbFeat;    // cumulonimbus companion forms: anvil, veil; the storm's distance; its softness
uniform float u_windOff;   // wind's integrated offset (speed\xD7dt accumulated on the CPU side)
uniform float u_evo;       // shape evolution's integrated offset (same idea)
uniform float u_filtAmt;   // color filter: strength
uniform vec3  u_filtTint;  //               white point
uniform float u_filtSat;   //               saturation kept
uniform float u_filtLift;  //               black lift
uniform float u_p3;        // 1 when the drawing buffer is Display P3, else 0
uniform float u_headroom;  // display ceiling in multiples of SDR white. 1 = SDR
uniform vec4  u_tone;      // tone curve: exposure (stops), contrast, knee, bleach
uniform vec4  u_pol;       // polarizer: strength, angle, saturation, stopLoss
uniform vec4  u_sky;       // celestial: bortle, milkyWay, meteors/hr, hasRadiant
uniform vec2  u_radiant;   // meteor radiant: elevation, azimuth (radians)
uniform float u_lensDrops; // 0..1 ceiling on the raindrops that collect on the lens
uniform float u_lensFx;    // 1 = draw the flare and vignette, 0 = the bare sky (environment probes)
uniform float u_fall;      // 0..1 ceiling on the falling rain streaks and snowflakes
uniform vec3 u_snowDrift;  // how far the snow has fallen, integrated on the CPU (see snowFallDir)
uniform vec2  u_sea;       // ground: how much is open water, how much it heaves
uniform vec2  u_sunset;    // sunset: the warmth of the band on the sun's side, the glow all round
uniform float u_aurora;    // 0..1 how much aurora is in the sky
uniform float u_contrails; // 0..1 how often a jet draws a trail
uniform float u_rays;      // 0..1 crepuscular rays, in the split variant's composite
#ifdef CLOUD_SPLIT
uniform float u_cloudMode; // 0 = one pass, 1 = the cloud stack alone, 2 = composite it from u_clouds
uniform sampler2D u_clouds; // the cloud stack drawn by mode 1: rgb = what it adds, a = what it lets through
#endif

const float PI = 3.14159265;
// how many radians the default framing (fov 0.86) shows top to bottom, near
// the middle. The falling rain and snow were tuned in screen units at that
// framing; dividing by this re-expresses those scales per radian of view
const float FALL_REF = 0.88;

// \u2500\u2500 Linear light \u2500\u2500
// Every color literal below is authored as an sRGB-encoded value (that is how
// they were hand-tuned), but compositing them in that space is wrong: mixing two
// gamma-encoded colors darkens the midpoint, and adding light is only additive in
// linear light. So each literal is decoded on the way in with L(), the whole
// composite runs in linear light, and the result is tone-mapped and re-encoded at
// the end.
//
// Two properties make this a small change rather than a rewrite:
//   - a mix()'s endpoints are preserved exactly; only midpoints move (that IS the fix)
//   - a multiplicative tint is exactly equivalent, since L(g*v) = L(g)*L(v) above
//     the knee \u2014 so every "* vec3(1.12, 0.92, 0.76)" style gain keeps its meaning
vec3 L(vec3 c) {
  c = max(c, 0.0);
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 encodeSrgb(vec3 c) {
  c = max(c, 0.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

/**
 * An artistic overlay: a wash of the whole picture toward some color.
 *
 * Unlike adding light, this is not a physical process \u2014 it is a chosen
 * appearance, and every one of these was hand-tuned as a display-space blend. So
 * do the blend where it was authored and come back to linear. That keeps the
 * palette exactly as published while the additive light stays correct.
 */
vec3 overlay(vec3 lin, vec3 dispCol, float a) {
  return L(mix(encodeSrgb(lin), dispCol, a));
}

// How much light each source emits, in multiples of SDR white. Nowhere near
// physically right (the sun is ~10^5 SDR white); these are set to what reads
// correctly once the shoulder has them.
//
// SUN_LUM deliberately blooms wider than the pre-linear-light renderer did. That
// is not drift to be corrected \u2014 a sun you cannot look at is what the eye
// actually reports, and it was judged closer to perception than the old flat
// disc. Emission is the one place this pipeline is *meant* to depart from the
// published look; brightness that leaks in anywhere else is a bug.
//
// Raise u_headroom and this is the range they expand into.
const float SUN_LUM   = 12.0;
const float HALO_LUM  = 1.6;
const float FLASH_LUM = 6.0;
const float MOON_LUM  = 2.6;
const float STAR_LUM  = 2.5;
const float AURORA_LUM = 1.4;

/**
 * Linear scene light \u2192 display.
 *
 * Scene-referred, so every stage here means what it says: the exposure is a
 * multiply, the contrast pivots on 18% grey, and the highlights desaturate the way
 * film does. None of that was expressible while compositing ran on gamma-encoded
 * values.
 *
 * The shoulder is identity below u_tone.z, so at the default knee of 0.8 only
 * blown highlights are shaped and the published look is untouched. Bring the knee
 * down to put the curve through the midtones \u2014 that is where it becomes a look.
 * The same shoulder is what expands into u_headroom when there is HDR to expand
 * into, so a curve dialled in today stays the curve later.
 */
vec3 tonemap(vec3 c) {
  const float PIVOT = 0.18;   // 18% grey, the photographic anchor

  c = max(c, 0.0) * exp2(u_tone.x);

  if (abs(u_tone.y - 1.0) > 0.001) {
    c = PIVOT * pow(max(c / PIVOT, 1e-5), vec3(u_tone.y));
  }

  float knee = u_tone.z;

  // bleach: as a pixel climbs toward the ceiling, pull it toward its own peak
  // channel. Keeps brightness, drops hue \u2014 so a blown sky goes white instead of
  // clipping into a muddy cast
  if (u_tone.w > 0.001) {
    float peak = max(max(c.r, c.g), c.b);
    float t = clamp((peak - knee) / max(1.0 - knee, 1e-4), 0.0, 1.0);
    c = mix(c, vec3(peak), t * u_tone.w);
  }

  // x/(1+x) shoulder, rescaled to start with slope 1 at the knee and approach
  // the headroom as x grows
  vec3 hi = max(c - knee, 0.0);
  float span = max(u_headroom - knee, 1e-4);
  return min(c, knee) + span * (hi / (span + hi));
}

/**
 * Degree of polarization of Rayleigh-scattered skylight along this view ray.
 *
 * sin(theta)^2 / (1 + cos(theta)^2) for scattering angle theta \u2014 zero straight at
 * the sun and straight away from it, peaking in the band 90 degrees off. Capped
 * below 1 because multiple scattering, aerosols and ground bounce all depolarize
 * a real sky; a clear high-altitude sky tops out near 0.75.
 */
float skyPolarization(vec3 rd, vec3 sunDir) {
  float ct = dot(rd, sunDir);
  return 0.75 * (1.0 - ct * ct) / (1.0 + ct * ct);
}

/**
 * Transmission through a circular polarizer, normalized so unpolarized light
 * passes unchanged (Malus's law with the filter's flat 50% loss factored out \u2014
 * u_pol.w reintroduces the real loss if asked for).
 *
 * aim is where the ring is turned to: the e-vector's angle at the middle of
 * the frame, so that u_pol.y = 0 is the crossed orientation there \u2014 the one that
 * kills the polarized component and darkens the sky. Rotating by 90 degrees
 * passes it instead and the same band brightens, which is exactly what happens
 * when you turn the ring on a real one.
 */
float polarizerTransmission(float dop, float ePhi, float aim) {
  float d = sin(ePhi - aim - u_pol.y);
  float t = (1.0 - dop) + 2.0 * dop * d * d;
  t = mix(1.0, t, u_pol.x);
  return t * mix(1.0, 0.40, u_pol.w);   // 0.40 ~ the real 1.3-stop bite
}

// \u2500\u2500 Wide gamut \u2500\u2500
// Everything above is authored and composited as sRGB-encoded values, so the
// conversion is: decode with the sRGB transfer function, change primaries,
// re-encode with the same curve (Display P3 shares it). Matrix from gamut.ts.
const mat3 SRGB_TO_P3 = ${_(g)};

vec3 srgbToDisplayP3(vec3 c) {
  // clamp before every pow(): a negative base is undefined, and mix() computes
  // both branches, so one NaN would leak into the selected one
  c = max(c, 0.0);
  vec3 lin = mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
  lin = max(SRGB_TO_P3 * lin, 0.0);
  return mix(lin * 12.92, 1.055 * pow(lin, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, lin));
}

float hash11(float n) { return fract(sin(n) * 43758.5453123); }
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
// three at once, for one hash where three were taken (the snowflakes)
vec3 hash32(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
/**
 * Value noise \u2014 the four lattice corners and their bilinear blend, read out of
 * a baked texture rather than hashed here.
 *
 * This is not an approximation of the arithmetic it replaces. Smoothstepping
 * the *coordinate* and then letting the sampler filter linearly computes
 * mix(mix(a, b, f.x), mix(c, d, f.x), f.y) over exactly the same four texels \u2014
 * which is the expression that used to be spelled out below. The differences
 * are that the lattice now repeats every NOISE_SIZE units (see noise.ts) and
 * that its values are quantized to 8 bits.
 *
 * The half-texel offset lands the sample on texel centers, so floor(p) picks
 * the same corner the hash used to.
 *
 * hash12 stays: the stars, snowflakes, raindrops, lens droplets, blob lattice
 * and dither all want an unfiltered point hash at unbounded coordinates, and
 * measurement showed moving those to a texture bought nothing.
 */
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return NOISE_FETCH((i + f + 0.5) * ${(1/G).toFixed(10)}).r;
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}
float fbm4(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}
// two octaves, for modulators that only need broad unevenness cheaply
float fbm2(vec2 p) {
  return vnoise(p) * 0.667 + vnoise(p * 2.03 + vec2(17.3, 9.1)) * 0.333;
}
// \u2500\u2500 Camera \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// World space is x=east, y=up, z=north. yaw=0 faces north; pitch>0 looks up.

vec3 viewRay(vec2 ndc, float yaw, float pitch, float fov, float aspect) {
  float t = tan(fov * 0.5);
  vec3 d = normalize(vec3(ndc.x * aspect * t, ndc.y * t, 1.0));
  float cp = cos(pitch), sp = sin(pitch);
  d = vec3(d.x, d.y * cp + d.z * sp, -d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  return normalize(vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy));
}

// world direction \u2192 NDC. Positive z means in front of the screen (used for the lens flare's optical axis)
vec3 projectDir(vec3 d, float yaw, float pitch, float fov, float aspect) {
  float cy = cos(yaw), sy = sin(yaw);
  vec3 v = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  float cp = cos(pitch), sp = sin(pitch);
  v = vec3(v.x, v.y * cp - v.z * sp, v.y * sp + v.z * cp);
  float t = tan(fov * 0.5);
  float z = max(v.z, 1e-4);
  return vec3(v.x / (z * t * aspect), v.y / (z * t), v.z);
}

// view direction \u2192 a 2D coordinate for placing stars (folded onto a plane per cubemap face)
// an offset is added per face so neighboring faces don't share the same cell IDs
vec2 starGrid(vec3 d) {
  vec3 a = abs(d);
  if (a.x >= a.y && a.x >= a.z) return d.zy / a.x + vec2(d.x > 0.0 ? 11.0 : 23.0, 0.0);
  if (a.y >= a.z)               return d.xz / a.y + vec2(d.y > 0.0 ? 37.0 : 53.0, 0.0);
  return d.xy / a.z + vec2(d.z > 0.0 ? 71.0 : 97.0, 0.0);
}

// azimuth, elevation \u2192 unit direction vector
vec3 dirFromAngles(float elevation, float azimuth) {
  float ce = cos(elevation);
  return vec3(ce * sin(azimuth), sin(elevation), ce * cos(azimuth));
}

/**
 * The Milky Way, as a band around a fixed galactic pole.
 *
 * The renderer has no sidereal time \u2014 the star field is pinned to the view
 * direction, not to a rotating celestial sphere \u2014 so the galactic plane is a
 * fixed great circle too. Chosen to arc overhead at an angle that reads like a
 * summer sky rather than to match any particular date.
 *
 * Returns additive light, which is only correct because the composite is linear
 * now: a faint band over a near-black sky is exactly the case where adding in
 * gamma-encoded values goes wrong.
 */
#ifdef FEAT_DARKSKY
float milkyWayBand(vec3 rd, float amt, out float bulgeOut, out float riftOut,
                   out float glowOut, out float baseOut) {
  bulgeOut = 0.0;
  riftOut = 0.0;
  glowOut = 0.0;
  baseOut = 0.0;
  if (amt < 0.001) return 0.0;
  const vec3 POLE = vec3(0.4338, 0.8073, 0.4000);
  float lat = asin(clamp(dot(rd, POLE), -1.0, 1.0));

  // a coordinate running ALONG the band, so structure can be stretched the way
  // a galaxy's is instead of being isotropic blobs
  vec3 e1 = normalize(cross(POLE, vec3(0.0, 1.0, 0.0)));
  vec3 e2 = cross(POLE, e1);
  float lon = atan(dot(rd, e2), dot(rd, e1));

  // The galactic-centre bulge: the band is not uniform along its length \u2014 one
  // stretch swells wide and bright, and the rest thins away from it. Chord
  // distance (2 sin(dl/2)) keeps the falloff periodic in lon with no seam.
  // -2.45 sits low in the default framing's field of view (measured, not
  // guessed), so the band reads brightest near the horizon and thins overhead.
  float dl = 2.0 * sin(0.5 * (lon + 2.45));
  float bulge = exp(-dl * dl * 2.2);
  bulgeOut = bulge;

  // width swells around the bulge (smaller exponent = wider profile) and the
  // whole band brightens there
  float w = mix(1.45, 0.70, bulge);
  float band = exp(-lat * lat * 30.0 * w) * 0.62 + exp(-lat * lat * 6.0 * w) * 0.38;
  band *= 0.40 + 1.05 * bulge;
  // the SMOOTH band, before the star-cloud structure and the dust: the star
  // grain follows this. Real star density varies gently along the band \u2014 the
  // patchiness the eye sees is absorption, which the rift term carries \u2014 and
  // driving the grain off the structured value instead punches holes of
  // missing stars into every dip of the glow
  baseOut = band * amt;

  // star clouds: two octaves, stretched along the band
  vec2 q = vec2(lon * 2.6, lat * 7.0);
  float structure = fbm4(q) * 0.62 + fbm(q * 3.4) * 0.38;
  band *= 0.30 + 1.25 * structure;

  // Dust, three scales. All of it lives close to the plane, so skip the whole
  // stack for the wide faint skirts of the profile.
  if (abs(lat) < 0.45) {
    // the Great Rift: one long dark lane running along the band past the bulge,
    // wandering off-axis, its width and depth uneven along its length. This is
    // deliberately a path in (lon, lat), not a threshold on isotropic noise \u2014
    // that is what keeps it reading as a rift and not as blobs. A second,
    // finer wobble roughens the shoulders so the edge reads torn, not drawn.
    float riftPath = (fbm2(vec2(lon * 1.1, 2.7)) - 0.5) * 0.24
                   + (fbm2(vec2(lon * 6.3, 4.4)) - 0.5) * 0.055;
    float riftHalf = 0.035 + 0.060 * fbm2(vec2(lon * 1.7, 8.9));
    float rp = (lat - riftPath) / riftHalf;
    float riftDepth = smoothstep(0.04, 0.50, bulge)
                    * (0.45 + 0.55 * fbm2(vec2(lon * 2.3, 15.1)));
    // exported: the dust sits in FRONT of the star field, so the star layers
    // multiply this in \u2014 a rift that only dims the glow floats behind the
    // stars. Faded with amt (saturating well below full) or the rift-hidden
    // stars would pop back the instant the Milky Way crosses zero
    riftOut = exp(-rp * rp) * riftDepth * min(amt * 2.0, 1.0);
    band *= 1.0 - 0.85 * riftOut;

    // Several soft irregular mid-scale lanes, not one drawn line \u2014 and their
    // latitude sheared by a longer noise so they cross the band at shifting
    // angles instead of stacking into corduroy parallel to it
    float laneLat = lat + (fbm2(vec2(lon * 3.1, 7.7)) - 0.5) * 0.16;
    float dust = fbm(vec2(lon * 1.9, laneLat * 5.5) + 11.0);
    float lanes = smoothstep(0.40, 0.66, dust) * smoothstep(0.20, 0.02, abs(laneLat));
    band *= 1.0 - 0.42 * lanes;

    // small-scale mottling, sheared against the band axis for the same reason:
    // the patchiness that keeps the bright parts from reading as an airbrush
    float mott = smoothstep(0.46, 0.80, fbm(vec2(lon * 4.6 + lat * 2.2, lat * 14.0) + 31.0))
               * smoothstep(0.28, 0.05, abs(lat));
    band *= 1.0 - 0.50 * mott;
  }

  // the bulge as light, not only as width: a broad band-shaped swelling for the
  // glow pass to add in the core color. Rift-cut here so it cannot fill the
  // dark lane back in
  glowOut = bulge * bulge * exp(-lat * lat * 7.0) * (1.0 - 0.75 * riftOut) * amt;

  return max(band, 0.0) * amt;
}
#endif


/**
 * One meteor from one independent stream. See meteorStreak for the rate maths.
 */
vec3 meteorOne(vec3 rd, float t, float rate, float hasRadiant, vec2 radiant, float seed) {
  const float CELL = 1.2;                       // seconds per slot
  // Fraction of the slot the head takes to cross its nominal span. It does not
  // stop there: BURN_IN..BURN_OUT is when it goes out, and it keeps travelling
  // the whole time. Halting it and then dimming \u2014 which is what this did at
  // first \u2014 reads exactly as "it stopped", because it did.
  const float FLIGHT = 0.22;
  const float BURN_IN = 0.72;                   // in units of the nominal flight
  const float BURN_OUT = 1.20;
  float slot = floor(t / CELL) + seed;
  float p = hash11(slot * 1.37);
  if (p > clamp(rate / 3600.0 * CELL, 0.0, 0.92)) return vec3(0.0);
  // one in sixteen is a fireball: far brighter, wider, slower to burn out,
  // and it leaves a train that lingers
  float fb = step(0.94, hash11(slot * 23.7));

  float ph = fract(t / CELL);
  float travel = ph / FLIGHT;                   // 1.0 at the nominal end, keeps rising
  if (travel > BURN_OUT) return vec3(0.0);

  float a = hash11(slot * 3.11) * 6.2831;
  float e = 0.12 + hash11(slot * 5.77) * 1.15;
  vec3 origin = dirFromAngles(e, a);
  vec3 dir;
  if (hasRadiant > 0.5) {
    vec3 rad = dirFromAngles(radiant.x, radiant.y);
    vec3 away = normalize(origin - rad * dot(origin, rad));
    origin = normalize(rad + away * (0.10 + hash11(slot * 7.3) * 0.35));
    // re-derive the tangent AT the moved origin. Reusing away would leave dir
    // non-orthogonal to origin, and the perp term below \u2014 which subtracts both
    // components \u2014 would then never reach zero, hiding the streak completely
    dir = normalize(origin - rad);
    dir = normalize(dir - origin * dot(dir, origin));
  } else {
    vec3 up = abs(origin.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 rt = normalize(cross(up, origin));
    vec3 uu = cross(origin, rt);
    float th = hash11(slot * 9.13) * 6.2831;
    dir = normalize(rt * cos(th) + uu * sin(th));
  }

  float along = dot(rd, dir);
  float front = dot(rd, origin);
  if (front < 0.45) return vec3(0.0);
  float perp = length(rd - dir * along - origin * front);

  // how far it crosses, in radians. 0.58..1.06 is 33 to 61 degrees
  float span = 0.58 + hash11(slot * 11.7) * 0.48;
  float head = travel * span;                   // never clamped \u2014 it never halts
  float back = head - along;
  if (back < 0.0) return vec3(0.0);

  // the trail marks where the head has already been, so it grows out of nothing
  // rather than existing at full length on the first frame
  float maxTrail = span * 0.88;
  float trailLen = min(maxTrail, head);
  if (back > trailLen) return vec3(0.0);
  float u = back / max(trailLen, 1e-4);

  // near-constant width, about a pixel: any taper draws a wedge, and a wedge
  // reads as a comet. Brightness carries the shape instead
  float width = mix(0.0019, 0.0016, clamp(u, 0.0, 1.0)) * (1.0 + 1.6 * fb);
  float core = exp(-(perp * perp) / (width * width));

  float u01 = clamp(u, 0.0, 1.0);
  float prof = smoothstep(0.0, 0.07, u01) * (1.0 - smoothstep(0.30, 1.0, u01));
  // decay on age, not position, so the tail is left behind rather than towed
  prof *= exp(-(back / max(span, 1e-4) * FLIGHT) * 3.2);

  // It burns out over a long, smooth ramp while still moving, so there is never a
  // frame where it is stationary and visible. Squared so the last of it goes
  // gently rather than stepping off.
  float burn = 1.0 - smoothstep(BURN_IN, BURN_OUT + 0.6 * fb, travel);
  burn *= burn;
  float life = smoothstep(0.0, 0.035, ph) * burn;
  // the fireball's train: its wake, decaying slower than the trail does
  prof = mix(prof, max(prof, exp(-(back / max(span, 1e-4) * FLIGHT) * 1.2) * 0.35), fb);

  float hue = hash11(slot * 17.3);
  vec3 trailCol = hue < 0.38 ? vec3(0.62, 1.00, 0.70)
                : hue < 0.72 ? vec3(1.00, 0.88, 0.55)
                             : vec3(0.86, 0.92, 1.00);
  vec3 col = mix(trailCol, vec3(1.0), (1.0 - smoothstep(0.0, 0.30, u01)) * 0.7);

  return col * core * prof * life * (0.55 + 0.45 * hash11(slot * 13.9)) * (1.0 + 5.0 * fb);
}

/**
 * Meteors \u2014 the same event machinery as lightning: chop the clock into slots,
 * hash each one, and fire if it clears the threshold.
 *
 * Drawn in ray space, so a meteor stays where it is in the sky while the view
 * swings rather than being glued to the frame.
 *
 * zhr is a real ZHR, and a ZHR is defined for an observer watching the *whole
 * sky*. A 49-degree frame covers under a tenth of it, so an honest ZHR 100 puts
 * roughly one meteor in shot every few minutes \u2014 correct, and useless as a
 * control. What was actually wrong was the ceiling: one meteor per slot capped
 * the whole-sky rate no matter how high the number went. Several independent
 * streams run in parallel now, each carrying its share, so the rate means
 * something across the range and more than one can be in the air at once (which
 * is what shower photographs show anyway).
 */
vec3 meteorStreak(vec3 rd, float t, float zhr, float hasRadiant, vec2 radiant) {
  if (zhr < 0.01) return vec3(0.0);
  const int STREAMS = 4;
  vec3 total = vec3(0.0);
  for (int k = 0; k < STREAMS; k++) {
    float fk = float(k);
    // offset each stream's clock and its hash, or all four fire together
    total += meteorOne(rd, t + fk * 0.31, zhr / float(STREAMS), hasRadiant, radiant, fk * 131.7);
  }
  return total;
}




#ifdef FEAT_AURORA
// \u2500\u2500 Aurora \u2500\u2500
// Curtains of light standing in the upper air toward the north, folding along
// wavy lines that run east to west and shimmering in vertical rays. A curtain
// is a vertical sheet between two altitudes, so a ray crosses it along some
// length of the sheet \u2014 which is what makes the folds: seen edge-on the sheet
// is a bright rib, seen face-on a faint veil. Marched in a few steps of
// altitude; each step projects the ray onto that altitude's plane, the way the
// cloud planes do, and asks how close it lands to the curtain's line. The
// curtains come overhead as the activity rises.
//
// Linear light; the caller gates it on night and cloud and scales it.
vec3 aurora(vec3 rd, float amt) {
  if (amt < 0.001 || rd.y < 0.02) return vec3(0.0);
  const int STEPS = 12;
  const float A_LO = 1.0;     // the lower edge, ~100 km up: the bright green rim
  const float A_HI = 2.8;     // the top, where the red has faded
  float stand = mix(3.2, 0.3, amt);
  float t = u_time;
  // the march is coarse, and a coarse march through a thin sheet draws the
  // sheet once per step, as a stack of bands. Starting each pixel's march at
  // its own fraction of a step turns the stack into grain, which the eye
  // reads as the curtain's own shimmer; the sheet also thickens with height
  // (the top of a curtain is a diffuse glow, not a rib), so the upper steps
  // overlap into one. The fraction is interleaved gradient noise rather than
  // a hash \u2014 evenly spread over any few neighbouring pixels, so the grain
  // stays fine instead of clumping \u2014 stepped along the golden ratio each
  // frame so it never settles into a pattern
  float jitter = fract(52.9829189 * fract(0.06711056 * gl_FragCoord.x + 0.00583715 * gl_FragCoord.y)
                       + floor(t * 30.0) * 0.618034);
  vec3 sum = vec3(0.0);
  for (int i = 0; i < STEPS; i++) {
    float k = (float(i) + jitter) / float(STEPS);
    float a = mix(A_LO, A_HI, k);
    vec2 p = rd.xz / rd.y * a;          // where the ray crosses this altitude
    // the main curtain's line across the sky: a slow, drifting wander
    float wander = (fbm2(vec2(p.x * 0.22 + t * 0.012, 3.1)) - 0.5) * 2.2
                 + (fbm2(vec2(p.x * 0.9 - t * 0.02, 7.7)) - 0.5) * 0.5;
    float d = p.y - (stand + wander);
    // the sheet's thickness varies along its length \u2014 folds bunch and
    // spread \u2014 and grows with height
    float w = (0.10 + 0.16 * fbm2(vec2(p.x * 0.5 + 11.0, t * 0.01))) * (1.0 + 2.2 * k);
    float band = exp(-d * d / (w * w));
    // a second, fainter curtain further north
    float d2 = p.y - (stand + 1.4 + (fbm2(vec2(p.x * 0.3 - t * 0.009, 19.0)) - 0.5) * 2.0);
    float w2 = 0.25 * (1.0 + 2.2 * k);
    band += 0.5 * exp(-d2 * d2 / (w2 * w2));
    // rays: vertical striations along the curtain, shimmering, softer up top
    float ray = vnoise(vec2(p.x * 7.0 + t * 0.35, 1.3)) * 0.6
              + vnoise(vec2(p.x * 19.0 - t * 0.6, 5.1)) * 0.4;
    ray = mix(ray * ray * 1.6 + 0.15, 0.75, k * 0.7);
    // bright at the lower edge, thinning upward
    float prof = exp(-k * 2.2);
    // green at the foot, red up top; at high activity a purple fringe below the green
    vec3 col = mix(vec3(0.20, 1.00, 0.45), vec3(0.95, 0.25, 0.40), smoothstep(0.25, 1.0, k));
    col = mix(col, vec3(0.70, 0.35, 1.00), smoothstep(0.2, 0.0, k) * amt * 0.6);
    sum += col * band * ray * prof;
  }
  // the path through the slab lengthens as the ray flattens toward the
  // horizon. Brightness rises faster than the amount: a quiet night's arc is
  // faint, a storm's curtains are not
  return sum * (1.0 / float(STEPS)) * amt * (0.35 + 0.65 * amt)
       * min(1.0 / max(rd.y, 0.15), 3.0) * 0.35;
}
#endif

#ifdef FEAT_HALOS
// \u2500\u2500 Ice halos \u2500\u2500
// What the ice crystals of a cirrostratus do with the sun and the moon: the
// 22\xB0 halo (refraction through the crystals, red on its inner edge), the
// parhelia \u2014 the sun dogs \u2014 that sit on it level with a low sun, and a pillar
// of light standing on a sun at the horizon, off the flat faces of falling
// plates; and high over a sun below 32 degrees, the circumzenithal arc. The
// moon gets its halo too. Linear light to add; nothing without the veil.
vec3 iceHalo(vec3 rd, float el, vec3 sunDir, float sunAng, float sunVis,
             vec3 moonDir, float moonAng, float moonVis, float nightF) {
  float ice = u_high.y;
  if (ice < 0.001 || rd.y < 0.0) return vec3(0.0);
  // The crystals are where the veil is. A halo drawn evenly round the sun is
  // a drawn circle; the real one is patchy and broken where the veil thins,
  // so everything here is weighted by the veil's own density along this ray
  vec2 vuv = rd.xz / max(rd.y, 0.03) * (3.2 * 0.5) + vec2(u_windOff * 0.3, u_windOff * 0.045);
  float veil = 0.35 + 0.65 * smoothstep(0.30, 0.72, fbm4(vuv + vec2(u_evo * 0.15, 0.0)));
  vec3 add = vec3(0.0);
  if (sunVis > 0.0) {
    float sunEl = sunDir.y;
    // the 22\xB0 halo: a sharp inner edge, red, and a long fade outward into a
    // faint brightening of the sky \u2014 the refraction has a minimum deviation
    // and no maximum. The inside of the ring is a shade darker than the sky
    float d = sunAng - 0.379;
    float ring = smoothstep(-0.014, 0.006, d) * exp(-max(d, 0.0) * 22.0);
    vec3 ringCol = mix(vec3(1.0, 0.62, 0.50), vec3(1.0, 0.96, 0.90), smoothstep(0.0, 0.035, d));
    add += L(ringCol) * ring * 0.16 * sunVis;
    // sun dogs: level with the sun, 22\xB0 out and a little more as it climbs,
    // red on the side toward the sun and a white tail trailing away from it;
    // brightest with the sun low, gone above 45\xB0 or so
    float low = smoothstep(0.70, 0.10, sunEl);
    if (low > 0.0) {
      float spread = 0.384 / max(sqrt(1.0 - sunEl * sunEl), 0.5);
      vec2 hs = normalize(sunDir.xz + vec2(1e-5)), hr = normalize(rd.xz + vec2(1e-5));
      // signed azimuth from the sun, scaled to sky radians at this elevation
      float dAz = atan(hr.x * hs.y - hr.y * hs.x, dot(hr, hs)) * sqrt(max(1.0 - rd.y * rd.y, 0.0));
      float dEl = el - u_sun.x;
      float x = abs(dAz) - spread * sqrt(max(1.0 - sunEl * sunEl, 0.0));   // outward from the dog
      float dog = exp(-dEl * dEl / 0.00028)
                * (exp(-x * x / 0.0004) + smoothstep(0.0, 0.02, x) * exp(-x * 22.0) * 0.5);
      vec3 dogCol = mix(vec3(1.0, 0.55, 0.40), vec3(1.0, 0.95, 0.88), smoothstep(-0.012, 0.012, x));
      add += L(dogCol) * dog * 0.45 * low * sunVis;
    }
    // the pillar: a column above and below a sun near the horizon
    float lowP = smoothstep(0.20, 0.02, sunEl) * smoothstep(-0.08, 0.0, sunEl);
    if (lowP > 0.0) {
      vec2 hs = normalize(sunDir.xz + vec2(1e-5)), hr = normalize(rd.xz + vec2(1e-5));
      float dAz = acos(clamp(dot(hs, hr), -1.0, 1.0)) * sqrt(max(1.0 - rd.y * rd.y, 0.0));
      float dEl = el - u_sun.x;
      float column = exp(-dAz * dAz / 0.0008) * exp(-abs(dEl) * 12.0) * smoothstep(0.0, 0.02, abs(dEl));
      add += L(vec3(1.0, 0.70, 0.45)) * column * 0.25 * lowP * sunVis;
    }
    // the circumzenithal arc: light in through the top face of a flat plate
    // and out through a side, a 90 degree prism. The top face keeps the
    // horizontal part of the ray and the side face the vertical, which puts
    // the arc on a circle round the zenith at sin(altitude) = sqrt(n^2 -
    // cos^2(sun altitude)): 32 degrees from the zenith with the sun on the
    // horizon, closing to nothing at the zenith as the sun reaches 32.2.
    // Red bends least, so it is the lower edge, toward the sun, and the
    // violet the upper. Brightest with the sun near 22, and the most
    // saturated thing a veil does \u2014 the dispersion is not smeared out by
    // the spread of crystal tilts the way the 22 degree ring's is
    float czaSun = smoothstep(0.04, 0.26, sunEl) * smoothstep(0.532, 0.44, sunEl);
    if (czaSun > 0.0) {
      vec2 hs = normalize(sunDir.xz + vec2(1e-5)), hr = normalize(rd.xz + vec2(1e-5));
      float dAz = acos(clamp(dot(hs, hr), -1.0, 1.0));
      // a quarter turn of arc, its ends fading
      float span = smoothstep(0.92, 0.55, dAz);
      float c2 = 1.0 - sunEl * sunEl;
      float sRed = sqrt(max(1.307 * 1.307 - c2, 0.0));
      float sBlue = sqrt(max(1.317 * 1.317 - c2, 0.0));
      // 0 at the red edge, 1 at the violet, measured in the sine of the
      // altitude (the arc is only a couple of degrees wide, so that is near
      // enough even)
      float t = (rd.y - sRed) / max(sBlue - sRed, 1e-4);
      float band = smoothstep(-0.45, 0.10, t) * (1.0 - smoothstep(0.80, 1.45, t));
      vec3 czaCol = vec3(1.0, 0.25, 0.12);
      czaCol = mix(czaCol, vec3(1.0, 0.85, 0.20), smoothstep(0.05, 0.30, t));
      czaCol = mix(czaCol, vec3(0.30, 0.95, 0.45), smoothstep(0.30, 0.55, t));
      czaCol = mix(czaCol, vec3(0.25, 0.45, 1.0), smoothstep(0.55, 0.80, t));
      czaCol = mix(czaCol, vec3(0.50, 0.30, 1.0), smoothstep(0.80, 1.05, t));
      add += L(czaCol) * band * span * czaSun * 0.85 * sunVis;
    }
  }
  if (moonVis > 0.0) {
    // A moon's halo is soft: its light is a fraction of the sun's, and what
    // shows is less an edge than a band where the veil is a shade brighter,
    // over a veil already glowing round the moon itself (the aureole \u2014
    // light the crystals send on almost straight). The ring's inside is only
    // a little darker than the ring; the glow keeps it from being a hole
    float d = moonAng - 0.379;
    float ring = smoothstep(-0.035, 0.012, d) * exp(-max(d, 0.0) * 11.0);
    float aureole = exp(-moonAng / 0.045) * 0.45 + exp(-moonAng / 0.24) * 0.16;
    // faintly colored, as the sun's is: red on the inner edge (red bends
    // least, so it reaches the smallest angle), through yellow to white, and
    // a trace of blue where the band fades outward
    vec3 ringCol = mix(vec3(1.0, 0.50, 0.36), vec3(1.0, 0.86, 0.62), smoothstep(-0.025, 0.012, d));
    ringCol = mix(ringCol, vec3(0.92, 0.95, 1.0), smoothstep(0.012, 0.05, d));
    ringCol = mix(ringCol, vec3(0.70, 0.82, 1.0), smoothstep(0.05, 0.13, d));
    add += (L(ringCol) * ring * 0.12 + L(vec3(0.92, 0.95, 1.0)) * aureole) * moonVis * u_moon.z * nightF;
  }
  return add * ice * veil;
}
#endif

#ifdef FEAT_SHAFTS
// The grain of a rain shaft, seen from tens of kilometres off: x is the
// sheets a curtain gathers into, a few degrees across, and y the streaks
// within them. Both are noise stretched tall \u2014 most of the band high \u2014 so
// they read as falling rain and never as cloud. Sampled on a circle round
// the sky (the radius standing in for height, as the cumulonimbus does)
// rather than at the raw azimuth, which would tear a seam due south where
// atan wraps
vec2 shaftGrain(float a, float y) {
  vec2 d = vec2(sin(a), cos(a));
  float sheets = vnoise(d * (12.0 + y * 1.6) + vec2(3.1, u_evo * 0.08));
  float streaks = vnoise(d * (38.0 + y * 2.6) + vec2(0.0, u_evo * 0.20)) * 0.65
                + vnoise(d * (83.0 + y * 4.5) + vec2(5.3, 1.7 - u_evo * 0.35)) * 0.35;
  return vec2(sheets, streaks);
}
#endif

#ifdef FEAT_RAINBOW
// One wavelength's color, 400..700 nm in seven steps, each channel scaled so
// the seven sum to white: light spread evenly across them adds back up to
// the sunlight it came from
vec3 waveColor(int i) {
  if (i == 0) return vec3(0.30, 0.00, 0.55) / vec3(2.95, 2.10, 1.95);
  if (i == 1) return vec3(0.05, 0.10, 0.90) / vec3(2.95, 2.10, 1.95);
  if (i == 2) return vec3(0.00, 0.60, 0.45) / vec3(2.95, 2.10, 1.95);
  if (i == 3) return vec3(0.35, 0.90, 0.05) / vec3(2.95, 2.10, 1.95);
  if (i == 4) return vec3(1.00, 0.45, 0.00) / vec3(2.95, 2.10, 1.95);
  if (i == 5) return vec3(0.90, 0.05, 0.00) / vec3(2.95, 2.10, 1.95);
  return vec3(0.35, 0.00, 0.00) / vec3(2.95, 2.10, 1.95);
}
// The light the raindrops send back at angle a (degrees from the point
// opposite the sun). Each wavelength has its own bow, a little further out
// the redder it is, and every one of them is a bright edge with a tail of
// light toward the inside \u2014 so the colors are not bands laid side by side
// but bows overlapping, smeared by the half degree of the sun's disc, and
// inside the primary they add back up to a whitish glow. The secondary is the
// same turned over: wider, fainter, red on the inside, its tail outside
vec3 bowLight(float a) {
  vec3 c = vec3(0.0);
  for (int i = 0; i < 7; i++) {
    float f = float(i) / 6.0;                     // 0 violet .. 1 red
    float a1 = 40.4 + f * 2.0;                    // primary: 40.4\xB0 violet .. 42.4\xB0 red
    float d1 = a - a1;
    float p = exp(-d1 * d1 / 0.36) + (d1 < 0.0 ? 0.40 * exp(d1 / 2.5) : 0.0);
    float a2 = 53.6 - f * 3.2;                    // secondary: 50.4\xB0 red .. 53.6\xB0 violet
    float d2 = a - a2;
    float q = exp(-d2 * d2 / 0.50) + (d2 > 0.0 ? 0.25 * exp(-d2 / 2.5) : 0.0);
    c += waveColor(i) * (p + q * 0.40);
  }
  return c;
}
#endif

// \u2500\u2500 Clouds \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// cloud field density and lit-ness (x=density 0..1, y=lit-ness -1..1, z=raw density value)
// the difference against a resample shifted slightly toward the sun becomes lit/shadowed
//
// clear is the raw density at or below which the caller draws nothing at all \u2014
// the lower edge of whichever smoothstep its alpha is cut with. Below it the
// lit-ness is never looked at, so the resample is skipped; and where even the
// most the detail octaves could add would not lift the density past it, the
// detail is skipped too. Both are exact: fbm is a sum of texels in 0..1 under
// weights that total FBM_MAX, so that is a hard ceiling, not an estimate.
const float FBM_MAX = 0.96875;
vec3 cloudField(vec2 cuv, float churn, vec2 ldir, float edge, float ramp, float clear) {
  // shape evolution: the warp field itself drifts slowly, so the silhouette
  // crumbles and reassembles over time
  // (u_evo is integrated on the CPU side, so the offset doesn't jump even when the wind picks up)
  vec2 q = cuv + (0.30 + churn * 0.34) * vec2(
    fbm(cuv * 1.6 + u_evo),
    fbm(cuv * 1.6 - u_evo * 0.8)
  );
  // detail drifts at a different speed from the base, so edges erode and reform gradually.
  // rides u_evo rather than u_time: the CPU integrates it, so the phase
  // survives u_time's wrap, and the rate follows the wind like the rest of
  // the cloud motion (the factors reproduce the old u_time \xD7 0.026 / 0.017
  // at light wind)
  vec2 drift = vec2(u_evo * 0.33, -u_evo * 0.21);
  float base = fbm(q);
  float dmax = (base * 0.72 + FBM_MAX * 0.28 - 0.5) * 2.2 + 0.5;
  if (dmax <= clear) return vec3(0.0, 0.0, dmax);
  float detail = fbm(q * 3.3 + 17.0 + drift);
  float dcomb = (base * 0.72 + detail * 0.28 - 0.5) * 2.2 + 0.5;
  float den = smoothstep(edge - 0.01, edge + ramp, dcomb);
  float lit = 0.0;
  if (dcomb > clear) {
    vec2 ql = q + ldir * 0.16;
    float dl = fbm(ql) * 0.72 + fbm(ql * 3.3 + 17.0 + drift) * 0.28;
    // \xD74 saturates immediately into flat blocks of light and dark, so keep it gentle
    lit = clamp((dcomb - dl) * 2.5, -1.0, 1.0);
  }
  return vec3(den, lit, dcomb);
}

// How far a ray looks into the sun, as a cloud's lighting sees it: 1 for a
// cloud standing in front of the disc, fading out by thirty-five degrees off
// it \u2014 past that the face turned to the eye is the sun's side or its flank.
// squash shrinks the vertical part of the separation before it is measured.
// A tall cloud with a low sun behind it is backlit all the way up, not just
// where it covers the disc: its head, thirty degrees above a sun on the
// horizon, still shows the eye its shadowed face. Only a sun that is up and
// not taken by an overcast can light anything from behind.
// sunApart is the angle that is reckoned in, backGate whether a sun can
// backlight at all; the tower reads both to carry its backlight further
// round the sky than a small cloud's (see the cumulonimbus)
float sunApart(vec3 rd, vec3 sunDir, float squash) {
  vec3 a = normalize(vec3(rd.x, rd.y * squash, rd.z));
  vec3 b = normalize(vec3(sunDir.x, sunDir.y * squash, sunDir.z));
  return acos(clamp(dot(a, b), -1.0, 1.0));
}
float backGate(vec3 sunDir) {
  return smoothstep(-0.05, 0.03, sunDir.y) * (1.0 - smoothstep(0.55, 0.95, u_cover));
}
float backlit(vec3 rd, vec3 sunDir, float squash) {
  return (1.0 - smoothstep(0.26, 0.60, sunApart(rd, sunDir, squash))) * backGate(sunDir);
}

// Everything from here to the anvil's plate is the cumulonimbus's alone, and
// compiled only into the variants that draw one (FEAT_CB) \u2014 save the storm's
// scale and clock, which the rain shafts read as well
#ifdef FEAT_CB
// A cluster of round lobes read as a pack of bubbles as well as a sum (the
// mammatus's pouches; the tower's lobes are lobes of their own, lobeCell).
// blobs() adds its spheres up, which is what a silhouette wants: the edge of a
// sum is a chain of arcs. But a sum has no front or back, and shading it gives
// smoke, not cauliflower. Read the same spheres as a pack instead \u2014 at each
// point the dome standing tallest is the one on top \u2014 and every lobe gets a
// normal of its own, meeting its neighbors in a crease.
//   x   the same sum blobs() returns, so the silhouette is unchanged
//   yz  the sideways part of the top dome's unit normal
//   w   the top dome's height
vec4 blobPack(vec2 p, float radius) {
  vec2 ip = floor(p), fp = fract(p);
  float sum = 0.0;
  vec3 top = vec3(0.0);
  float wsum = 1e-6;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(hash12(ip + g), hash12(ip + g + 31.7));
      float r = radius * (0.60 + 0.70 * hash12(ip + g + 7.3));
      vec2 d = g + o - fp;
      float q = max(1.0 - dot(d, d) / (r * r), 0.0);
      sum += q * q;
      // not a hard max: weighting each dome by the square of its height
      // lets the tallest win while rounding the crease where two meet. A
      // hard max (or a steep power) cuts the pack into a polygonal net, and
      // the fine octave reads as hammered metal or reptile skin
      float h = r * sqrt(q);
      float wt = h * h;
      top += vec3(-d / r, h) * wt;
      wsum += wt;
    }
  }
  return vec4(sum, top / wsum);
}

// The tower's lobes are not spheres. Read off a sum of perfect circles, every
// lobe was shaded as one: its outline a clean arc, and its rim drawn as a
// line \u2014 a sphere's term q\xB2 climbs straight out of nothing at its rim, so the
// face's tilt changed its rate there in a step, and the pack's normal
// (blobDome's) swung from flat to its full outward lean over the last few
// hundredths of the radius, a pixel or two. Up close, and wherever a big lobe
// overhung the one behind, the eye saw balls pressed into one another: a
// clean circular seam, stair-stepped on the pixels, a dark crescent along it
// where the rim leaned away from the sun, a smooth dome inside. A real lobe is
// a cauliflower's floret: its rim swells into smaller bulges and tucks in
// between them, no two alike, and its light dies away over its margin with no
// edge anywhere.
//
// So each lobe's outline is pushed in and out round its middle \u2014 two, three
// and five swellings at once (the second, third and fifth harmonics of the
// bearing, each turned by a phase of its own, together at most a quarter of
// the radius), so no two lobes are alike and none is round. The swellings
// are the rim's: faded in from nothing at the middle, where a bearing has no
// meaning \u2014 swelling there too, a lobe's crown came to a point the light
// picked out as a pinwheel. The face's slope, which is all the shading reads,
// is taken off q\xB3 rather than q\xB2, and leaves the rim with neither a value nor
// a turn of the face to show: it dies away into the margin, and the lobe is
// modelled by the light alone.
//
// The lobes stand where the spheres stood: the tower's outline was shaped
// round them over many rounds, and laid out afresh the same envelope came
// up with new peaks. Their swellings must keep inside the 3\xD73 cells read \u2014
// a lobe reaching past a whole cell from its middle is cut off along the
// cell two away \u2014 so no lobe is drawn wider than 0.795 (its widest bulge
// then reaches 0.99). The few largest are drawn that much smaller: left
// round instead, they were the very discs this is rid of, and big ones
// most of all. The sum is brought back to the mean and spread the spheres'
// had (lobeNorm, measured over the plane at the sizes the tower reads),
// so every threshold that reads it keeps its meaning.
//   x   q, how far inside the lobe (0 outside)
//   yz  q's gradient in p, uphill toward the middle
//   w   the lobe's radius along this bearing
vec4 lobeCell(vec2 c, vec2 g, vec2 fp, float radius, out vec2 d) {
  vec3 h = vec3(hash12(c), hash12(c + 31.7), hash12(c + 7.3));
  d = g + h.xy - fp;
  float r = min(radius * (0.60 + 0.70 * h.z), 0.795);
  float r2 = r * r;
  float dd = dot(d, d);
  // (the swellings reach out to 1.283 of the radius at most \u2014 the three
  // harmonics' weights against phases of at most a half each way \u2014 so the
  // lobe is let go only past that. Let go at 1.245, as it was, the widest
  // swellings were cut off along a circle: a step in the sum, which the
  // shading drew as a hard, stair-stepped arc across the face)
  if (dd >= r2 * 1.65) return vec4(0.0);
  // (the swellings' phases, stirred out of the three hashes the lobe has)
  vec3 a = fract(h * vec3(41.31, 27.17, 33.71) + h.zxy * 13.7) - 0.5;
  float ir = inversesqrt(dd + 1e-12);
  float rho = dd * ir;
  vec2 u = d * ir;
  // (cos k\u03B8, sin k\u03B8) for k = 2, 3, 5, by complex products of the bearing
  vec2 e2 = vec2(u.x * u.x - u.y * u.y, 2.0 * u.x * u.y);
  vec2 e3 = vec2(e2.x * u.x - e2.y * u.y, e2.x * u.y + e2.y * u.x);
  vec2 e5 = vec2(e3.x * e2.x - e3.y * e2.y, e3.x * e2.y + e3.y * e2.x);
  float b = 0.12 * dot(e2, a.xy) + 0.18 * dot(e3, a.yz) + 0.10 * dot(e5, a.zx);
  // and how it turns along the bearing, for the slope
  float db = 0.24 * dot(vec2(-e2.y, e2.x), a.xy) + 0.54 * dot(vec2(-e3.y, e3.x), a.yz)
           + 0.50 * dot(vec2(-e5.y, e5.x), a.zx);
  float k2 = 0.16 * r2;
  float iK = 1.0 / (dd + k2);
  float sF = dd * iK;
  float R = r * (1.0 + b * sF);
  float iR = 1.0 / R;
  float iR2 = iR * iR;
  float q = 1.0 - dd * iR2;
  if (q <= 0.0) return vec4(0.0);
  // q's gradient: the radius's turn along the bearing and its growth out
  // from the middle each lean the slope off the straight line to it
  float dRa = r * db * sF;
  float dRr = r * b * 2.0 * rho * k2 * iK * iK;
  vec2 gq = 2.0 * iR2 * (u * (rho - dd * dRr * iR) - vec2(-u.y, u.x) * (rho * dRa * iR));
  return vec4(q, gq, R);
}
// The sum's gain and offset (x, y) at a scale of this radius, and its
// slope's gain (z), which brings the slopes back to the spheres' spread so
// the faces lean as far as they did
vec3 lobeNorm(float radius) {
  float x = radius - 0.72;
  float k = 0.7086 + 0.4381 * radius;
  return vec3(k, 0.0206 + x * (0.40 + 1.78 * x), k * 3.20 / radius);
}
// The sum of a scale's lobes, as blobs() is of its spheres (what the outline
// is cut from, and what the shadows and the cut against floating pieces read)
float lobesS(vec2 p, float radius) {
  vec2 ip = floor(p), fp = fract(p);
  float sum = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 d;
      float q = lobeCell(ip + g, g, fp, radius, d).x;
      sum += q * q;
    }
  }
  vec3 nm = lobeNorm(radius);
  return sum * nm.x + nm.y;
}
// \u2500\u2500 The lobes as a pack \u2500\u2500
// Read as a sum, the lobes are a smooth surface: it swells over each lobe
// and dips into a soft valley where two meet, and its slope turns the face
// toward or away from the sun. Shaded that way the tower was putty \u2014 a few
// big, smooth lumps under airbrushed gradients, the lobes' boundaries
// showing only as the soft valleys between them, nothing at all smaller
// than the finest octave a pixel or two across, and that octave far from a
// pixel across once the tower stood large on the screen. A cumulus head is
// not that. It is a cauliflower: florets on florets, each crowding the
// next, and where one meets the one beside it there is no valley but a
// fold, its light changing all at once \u2014 the bright top of a floret laid
// against the shaded underside of the one above it, a crisp line drawn by
// the light alone, at every scale down to what the eye can separate.
//
// So the same lobes are read as a pack as well: at each point the lobe in
// front wins, and lends the face its own normal (a sphere's, -d/R, flattened
// a little \u2014 a floret is a bulge, not a ball), so where one lobe gives way
// to the next the face turns over at once. Which lobe is in front is a
// score: how far inside it the point is (R\xB7q, which climbs out of its rim
// at a finite slope, so the change-over between two lobes has a width that
// can be set), raised on a lobe's upper half and lowered on its lower one
// (PACK_TILT). A cauliflower's flank leans back as it climbs, so the lower
// floret stands in front of the one above it and its rounded top cuts
// across that one's shaded underside: the folds come out as arcs bowed
// upward, scallop over scallop, not as the straight creases between equal
// circles that read as a tortoise shell. And the change-over is a softmax
// whose width kc is a pixel or so on the screen, passed in by the caller in
// p's own units: the fold is as crisp as the screen can draw it, and
// antialiased \u2014 never a step that falls between two pixels.
//
// Where no lobe stands \u2014 a gap between them, or past a lobe's rim \u2014 the
// floor of the pack wins: the cloud deeper in, seen through the gap, facing
// the eye. How deep the point lies in the pack (z: 1 in a gap, falling from
// a lobe's rim to nothing at its middle as (1 \u2212 q)\xB2) is how much of it is a
// recess, which sees less of the sky and less of the sun. Only gently
// inside a lobe: darkened hard round every rim, the lobes came out as balls
// each ringed in grey.
//   x   (lobePack's return) the sum lobesS reads, for the silhouette
//   pack.xy  the sideways part of the front lobe's normal, in p's axes
//   pack.z   how deep in the pack: 1 in a gap, 0 at a lobe's middle
//   pack.w   how high the front lobe stands there, as a sphere's height
//            (0 in a gap), where its shadow ray starts (lobeShadow)
// up is the screen's up in p's axes (the tower's dirc), for the tilt
const float PACK_TILT = 0.55;
const float PACK_FLAT = 0.82;
// one lobe into the softmax, kept relative to the best score so far. Its
// weight is also eased in from nothing over its first three folds' worth
// of score: at its rim a lobe's score meets the floor's, and taken at full
// weight there it went from half the say to none at all as the rim passed \u2014
// its lean dropped by half in a pixel, a step in the light the folds'
// width did not smooth, and as the lobes drift it crawled, a pixel at a time
void packAdd(inout vec4 acc, inout float ws, inout float mx, float sc, vec4 v, float kc) {
  float s = min(sc / (3.0 * kc), 1.0);
  if (sc > mx) {
    float e = exp((mx - sc) / kc);
    acc = acc * e + v * s;
    ws = ws * e + s;
    mx = sc;
  } else {
    float e = exp((sc - mx) / kc) * s;
    acc += v * e;
    ws += e;
  }
}
float lobePack(vec2 p, float radius, float kc, vec2 up, out vec4 pack) {
  vec2 ip = floor(p), fp = fract(p);
  float sum = 0.0, mx = 0.0, ws = 1.0;
  vec4 acc = vec4(0.0, 0.0, 1.0, 0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 d;
      vec4 l = lobeCell(ip + g, g, fp, radius, d);
      sum += l.x * l.x;
      if (l.x > 0.0) {
        float iR = 1.0 / l.w;
        packAdd(acc, ws, mx, l.w * l.x * (1.0 + PACK_TILT * clamp(-dot(d, up) * iR, -1.0, 1.0)),
                vec4(-d * (iR * PACK_FLAT), (1.0 - l.x) * (1.0 - l.x), l.w * sqrt(l.x)), kc);
      }
    }
  }
  pack = acc / ws;
  vec3 nm = lobeNorm(radius);
  return sum * nm.x + nm.y;
}
// The florets below the finest lobes: the same pack, of round buds, one to
// a cell anywhere in it and up to a cell across (so the 3\xD73 cells round the
// point are all that can reach it). Kept as loose as that: held near their
// cells' middles, and four cells read instead of nine, the buds stood on a
// lattice, and the face came out quilted \u2014 a waffle of rows and columns.
// Shading only \u2014 the silhouette has its grain \u2014 and only as many octaves of
// them as the screen can hold (see the caller): a tower drawn large gets
// more of them, not bigger ones.
vec3 budPack(vec2 p, float kc, vec2 up) {
  vec2 ip = floor(p), fp = fract(p);
  float mx = 0.0, ws = 1.0;
  vec4 acc = vec4(0.0, 0.0, 1.0, 0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec3 h = hash32(ip + g);
      vec2 d = g + h.xy - fp;
      float R = 0.70 + 0.30 * h.z;
      float iR = 1.0 / R;
      float q = 1.0 - dot(d, d) * iR * iR;
      if (q > 0.0) {
        packAdd(acc, ws, mx, R * q * (1.0 + PACK_TILT * clamp(-dot(d, up) * iR, -1.0, 1.0)),
                vec4(-d * (iR * PACK_FLAT), (1.0 - q) * (1.0 - q), 0.0), kc);
      }
    }
  }
  return acc.xyz / ws;
}

#ifdef FEAT_CBVOL
// (The volumetric tower's florets: the same pack, its buds' places and sizes
// read out of the lattice's squares of four rather than hashed \u2014 three of
// one texel's four corners, the texel taken two cells apart so no two
// buds share one. A third of the arithmetic of hash32, nine times a pixel
// for each octave; the 8-bit places are fixed for a bud, so nothing steps)
vec3 budPackQ(vec2 p, float kc, vec2 up) {
  vec2 ip = floor(p), fp = fract(p);
  float mx = 0.0, ws = 1.0;
  vec4 acc = vec4(0.0, 0.0, 1.0, 0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec3 h = NOISEQ_FETCH(((ip + g) * 2.0 + 0.5) * ${(1/G).toFixed(10)}).xyz;
      vec2 d = g + h.xy - fp;
      float R = 0.70 + 0.30 * h.z;
      float iR = 1.0 / R;
      float q = 1.0 - dot(d, d) * iR * iR;
      if (q > 0.0) {
        packAdd(acc, ws, mx, R * q * (1.0 + PACK_TILT * clamp(-dot(d, up) * iR, -1.0, 1.0)),
                vec4(-d * (iR * PACK_FLAT), (1.0 - q) * (1.0 - q), 0.0), kc);
      }
    }
  }
  return acc.xyz / ws;
}
#endif

// The middle lobes' folds wander at the florets' scale. A fold between two
// lobes is where one's rim passes in front of the other, and drawn off the
// lobes alone it was the arc of a circle a hundred pixels long when the
// tower stood near \u2014 a smooth, ruled seam across the face. A real lobe's rim
// is its florets' outlines, so the point the middle lobes are read at is
// pushed about by two octaves of noise at about the florets' sizes, a
// twentieth of a lobe at most: the fold, and the outline the same lobes cut,
// come out bumpy. Read in the lobes' own drifting frame (wq), so the bumps
// travel with them rather than the lobes sliding through a fixed ripple
vec2 lobeWobble(vec2 wq) {
  return (vec2(vnoise(wq * 7.0 + 3.1), vnoise(wq * 7.0 + 41.7)) - 0.5) * 0.06
       + (vec2(vnoise(wq * 15.0 + 9.3), vnoise(wq * 15.0 + 27.1)) - 0.5) * 0.03;
}

// The shadows the lobes cast on one another. The pack's normals say which
// way each lobe faces, but a cauliflower in the sun is modelled as much by
// what each floret throws on the one under it: a high sun leaves a pool of
// shade under every bulge, a raking one a crescent in its lee. So a ray is
// sent from the point toward the sun \u2014 from the height the front lobe stands
// to there (h0, from lobePack; nothing in a gap) \u2014 and tried against the
// lobes round it as the spheres they nearly are (their middles and radii as
// lobeCell lays them, without the swellings, which a shadow does not need).
// A lobe the ray starts inside or on is the one it stands on, whose own
// turn the normal has already taken; one it passes through, ahead of it,
// hides the sun. How deep the ray goes into a lobe softens the shadow's
// edge, over about a twelfth of the lobe's radius \u2014 a crisp edge, but never
// one a pixel can fall between on the lobes this is read for.
//   L  the sun in p's axes: across the face (xy) and out of it (z)
float lobeShadow(vec2 p, float radius, float h0, vec3 L) {
  vec2 ip = floor(p), fp = fract(p);
  float sh = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 c = ip + g;
      vec3 h = vec3(hash12(c), hash12(c + 31.7), hash12(c + 7.3));
      float r = min(radius * (0.60 + 0.70 * h.z), 0.795);
      vec3 oc = vec3(fp - g - h.xy, h0);
      float b = dot(oc, L);
      float cc = dot(oc, oc) - r * r;
      float ir2 = 1.0 / (r * r);
      if (b < 0.0 && cc > 0.05 * r * r) {
        sh = max(sh, smoothstep(0.0, 0.45, (b * b - cc) * ir2) * smoothstep(0.05, 0.40, cc * ir2));
      }
    }
  }
  return sh;
}

// Value noise with the blend done here rather than by the texture unit.
//
// vnoise lets the sampler's bilinear filter interpolate the lattice, and the
// filter's weights are not continuous: GPUs carry the position between two
// texels in a handful of bits (eight is common), so across one lattice cell
// the noise climbs in ~256 flat steps. Invisible in a cloud's texture \u2014 but
// the cumulonimbus raises its thrust, a function of azimuth alone, through a
// steep power, and each step became a jump in where the silhouette's edge
// sits: every column of the flank shifted on its own, and the edge broke up
// into vertical hairline streaks. Reading the four corners at their texel
// centers (vnoise of an integer point is exactly one texel) and mixing them
// in full float precision gives the same field without the staircase. The
// four corners come in one fetch, from a copy of the lattice with each
// texel's square of four in its channels (u_noiseQ, see noiseQuads) \u2014 the
// same 8-bit values the four reads of vnoise found.
//
// The staircase is in time as well. The storm's clock slides its reads
// along the lattice by a few thousandths of a cell a frame, so a filtered
// read sits still for several frames and then jumps a step \u2014 and the reads
// that ride the clock are the ones nothing else moves across a stretch of
// sky: a turret reads its thrust once, at its center, and the whole head
// jumped together, the crown rattling up in steps as it grew; the anvil's
// plate, fed by the same read, spread and shrank in steps a turret at a
// time; and the thrust per azimuth, its fine octaves crossing their steps
// fastest, flickered column by column down the flanks. So everything that
// rides the clock reads all four octaves here: across a frame the fine
// octaves' staircase hides under a pixel, but moving it is a jolt
float vnoiseHQ(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec4 q = NOISEQ_FETCH((i + 0.5) * ${(1/G).toFixed(10)});
  return mix(mix(q.x, q.y, f.x), mix(q.z, q.w, f.x), f.y);
}
float fbm4HQ(vec2 p) {
  vec2 p1 = p * 2.03 + vec2(17.3, 9.1);
  vec2 p2 = p1 * 2.03 + vec2(17.3, 9.1);
  vec2 p3 = p2 * 2.03 + vec2(17.3, 9.1);
  return 0.5 * vnoiseHQ(p) + 0.25 * vnoiseHQ(p1)
       + 0.125 * vnoiseHQ(p2) + 0.0625 * vnoiseHQ(p3);
}

#endif

// How much of the sky a cumulonimbus takes up, from how far off it stands
// (0 close, 1 far on the horizon): the factor its elevations and azimuths
// are read at, so the same towers stand larger or smaller. 1 at the middle
// distance, 0.65, the rest of the storm was drawn at \u2014 exactly, so the
// default sky is untouched \u2014 a half close by and 3.5 far off, through a
// curve that takes the near half slowly and the far half fast (angular
// size goes as one over the distance)
float cbScale(float d) {
  return exp(0.8515 * (exp(2.585 * (d - 0.65)) - 1.0));
}

// The storm's clock: how far its thrust's noise has drifted. A tower is
// born where the drift raises the mass over the cut, grows as it climbs,
// spreads its anvil while it stands at the tropopause, and decays as the
// drift carries the mass down again \u2014 so this is the clock every tower
// lives by, each at its own stage of the same drift. It runs at the speed
// the storm always drifted at, so every clock lays the sky out where it
// always stood: run at half that, with an offset that kept only the
// opening sky in place, every other clock moved, and a tower that stood
// square in front of a setting sun was gone from it, a low bank in its
// place. CB_LAG is how far back a tower's past is read: what it was doing
// a little while ago says whether it is growing or dying, how long its
// anvil has been spreading, and whether an anvil it fed has been cut loose
float cbClock() { return u_evo * 0.12; }
const float CB_LAG = 0.25;

// How much of the storm stands, from the amount of cumulonimbus: 1 for any
// real amount, falling to nothing as the amount runs out. The towers' size
// barely depended on the amount \u2014 the thrust is the noise's, the amount
// only its gain \u2014 so as a scene with a storm eased into one without, the
// towers stood nearly whole until the amount fell past the gate below which
// none is drawn, and went in a frame: whatever was left of them, and the
// skirt round their feet a little before. So the towers sink into their
// base as this falls (and rise out of it as it climbs), and the last of them
// thins away: nothing is left to see by an amount of 0.03, long before the
// gate. Read straight off the amount, from a third, where a storm is a
// storm: an eased amount leaves 0 fast and arrives at 0 slowly, so read
// off its logarithm the storm took the seconds a falling amount spends
// near nothing to go, and a frame or two to come
float cbLive() {
  return smoothstep(0.0, 0.30, u_low.w);
}

#ifdef FEAT_CB
// How high a cumulonimbus's thrust carries it: the height y solving
// rise \u2212 (y + 0.6y\xB2) \u2212 1 = 0, the thrust's own reach before anything shapes it
float cbReach(float rise) {
  return (sqrt(1.0 + 2.4 * max(rise - 1.0, 0.0)) - 1.0) / 1.2;
}
// ...and how high it stands on screen. The reach rises with the thrust as a
// parabola does with its axis, so read straight off it a tower's skyline
// across azimuth was a cone: every azimuth stood a little lower than the
// one inside it, and the cloud tapered to a spire half again as tall as it
// was wide \u2014 where a real cumulonimbus, seen from a few tens of kilometres,
// is a mountain at least as wide as it is tall, its flanks standing steep
// and bulging nearly to the top before they round over into a broad crown.
// So the reach is bent through a curve that climbs twice as fast at the
// foot and flattens as it nears the tropopause: low towers keep their
// height, a big one's flanks steepen, and everything near the top is
// gathered into one broad crown just under the ceiling (which still caps
// it \u2014 see the tropopause in main). The towers stand lower for it, their
// heads a quarter to a third of the way up the sky. What gets past the
// bend climbs on slowly, so a strong tower still reaches the ceiling
float cbShape(float y, float ceil) {
  float hs = ceil * 1.1;
  float x = y * 0.70;
  float u = 1.0 - min(x / hs, 1.0);
  return hs * (1.0 - u * u) + 0.25 * max(x - hs, 0.0);
}
// the inverse, for what still reasons in the bare reach (the tower's turn,
// in the shading)
float cbUnshape(float h, float ceil) {
  float hs = ceil * 1.1;
  float x = h < hs ? hs * (1.0 - sqrt(max(1.0 - h / hs, 0.0))) : hs + (h - hs) * 4.0;
  return x / 0.70;
}

// The cells of a row of n round the sky (rowCell: laid out on the CPU, see
// rowCenter in storm.ts, and read back by rowTurret below). Each holds a
// turret at a jittered place in it; n need not be whole: the cells are a
// whole cell wide but the last, which takes what is left over, and its
// turret fades out as that runs to nothing \u2014 and back in, where it reaches
// a whole cell, at the center and size a whole cell's would have

// The skyline of a row of turrets standing side by side round the horizon,
// the way a cumulonimbus's head is a cluster of them: how high the cloud
// reaches at azimuth a. Each turret is a column with a domed head, sized on
// screen so it stays a head however tall the column is, never a spire; its
// flanks steepen as they fall but never go vertical \u2014 a vertical flank no
// lobe can move sideways rules a straight line up the sky. The row is the
// tallest of them at each azimuth, and where two meet the notch is rounded
// over: a hard max leaves a V there that the lobes cut on down into a slot.
//
// How high a turret may go is the thrust's business, and it must be read at
// the turret's own center: read per pixel, the height changes from one
// column of pixels to the next and the cap is no longer round. One read per
// turret is a constant across it, so it is read once a frame for every
// turret, on the CPU, and looked up here (rowTurret; see storm.ts \u2014 read
// through the texture filter here, it stepped in time with the storm's
// clock, the whole head at once). The tower's row (row 1) raises the thrust
// into a tower top as the thrust itself does, by the storm's gain, under the
// tropopause cbShape gathers the crown under, a quarter higher (see the
// turrets in main); the congestus skirt's (row 2) only needs the thrust's
// two coarse octaves to say whether a tower is near, times the skirt's
// height. Each grows and slumps on a clock of its own \u2014 by a quarter, not
// more: a turret that drops to half its neighbors' height leaves the tallest
// standing alone over the crown as a spire. All of that is the same for every
// pixel of the turret, and comes worked out in the table.
//   n0     turrets round the whole sky at the middle distance
//   cosEl  how much screen a radian of azimuth spans at this elevation
//   sc     the storm's scale (cbScale): n0\xB7sc turrets round the sky
//
// n0\xB7sc is rarely a whole number, so the row closes on itself through one
// narrower cell (rowCell), its turret sized down with it \u2014 the count can
// then change smoothly, as the storm draws nearer, without the row
// jumping. Beside that cell one more turret is read, the one past it,
// since it may hold next to nothing (turretStep is one turret)

// Turret id's thrust as the CPU read it this frame (u_turrets, see
// storm.ts, row 0), two bytes to a number: x its thrust, the full fbm4 at
// its center; y the thrust as it stood CB_LAG ago (the coarse pair then,
// the fine pair now)
vec2 turretThrust(float id) {
  vec4 t = TURRET_FETCH(vec2((id + 0.5) * ${(1/Y).toFixed(10)}, ${(.5/J).toFixed(4)}));
  return vec2(t.x + t.y * (1.0 / 255.0), t.z + t.w * (1.0 / 255.0));
}
// Turret k of a row of n round the sky (k a whole number, counted on from
// cell 0 any number of times round \u2014 rowCell's count), as the CPU laid it
// out this frame: x its id, y its center in the row's own count (on k's side
// of the seam, so distances to it can be taken straight), z how high it
// stands, w how broad (its hash, 0..1); and aux its two hashes, for its
// breadth and the depth it stands at. row 1 is the tower's, 2 the skirt's.
// (The row is m cells to a turn, the narrow one included; k's turn is read
// half a cell on, where a whole k can never round to the wrong side of it)
vec4 rowTurret(float k, float n, float row, out vec2 aux) {
  float m = ceil(n);
  float wrap = floor((k + 0.5) / m);
  float id = k - wrap * m;
  float u = (id + 0.5) * ${(1/Y).toFixed(10)};
  vec4 t = TURRET_FETCH(vec2(u, (row + 0.5) * ${(1/J).toFixed(4)}));
  vec4 h = TURRET_FETCH(vec2(u, ${((J-.5)/J).toFixed(4)}));
  aux = row < 1.5 ? h.xy : h.zw;
  return vec4(id, wrap * n + id + t.z + t.w * (1.0 / 255.0), (t.x + t.y * (1.0 / 255.0)) * 2.0, aux.x);
}

// one turret of the row (cell kk, read from c along it), laid onto the
// skyline so far
float turretStep(float sky, float kk, float c, float n, float row, float cell) {
  float k = 0.6 * cell;
  vec2 aux;
  vec4 tr = rowTurret(kk, n, row, aux);
  float R = (0.80 + 0.25 * tr.w) * cell;
  float yk = tr.z;
  float d = abs(c - tr.y) * cell;
  // the head is a broad dome, nearly level across its middle, and the
  // flanks steepen as they fall, down to half the turret's height at R \u2014
  // where the body they share takes over \u2014 and past that steeply: a
  // turret still standing where the three read move on would leave a
  // straight slot
  float u = d / R;
  float t = u < 1.0 ? yk * (1.0 - 0.5 * u * u * u) : yk * 0.5 - (d - R) * 6.0;
  float hm = clamp(0.5 + 0.5 * (t - sky) / k, 0.0, 1.0);
  return mix(sky, t, hm) + k * hm * (1.0 - hm) * 0.5;
}
float turretRow(float a, float n0, float row, float cosEl, float sc) {
  float n = n0 * sc;
  float c = mod(a, 6.2831853) * n / 6.2831853;
  float ic = floor(c);
  float cell = 6.2831853 / n0 * cosEl;
  float sky = 0.0;
  for (int j = -1; j <= 1; j++) {
    sky = turretStep(sky, ic + float(j), c, n, row, cell);
  }
  // and beside a narrow cell the one past it: in cell 0 the one two back,
  // in the two cells before the seam the one two on. (Only while there
  // is a narrow cell at all: at the middle distance there is none, and
  // the row reads its three as it always did)
  if (fract(n) > 0.0 && (c < 1.0 || c >= floor(n) - 1.0)) {
    sky = turretStep(sky, c < 1.0 ? ic - 2.0 : ic + 2.0, c, n, row, cell);
  }
  return sky;
}

// One scale of lobes laid on a cumulonimbus's surface f (positive inside,
// zero on the silhouette): n is the lobes' noise about its mean. The dents
// may carve at full strength, but only so deep \u2014 a valley deep enough to
// cut through leaves sky showing through the tower, or its head floating
// over it. The swellings are kept weaker, and only close over the surface
// they ride on, within band: a bump is the surface swelling, so it has the
// surface under it, while a lobe the noise raised well clear of it has open
// sky beneath wherever the noise dips between \u2014 the small grey turret
// hanging detached over the tower. Laid scale by scale, a floret can only
// sit on a lobe and a lobe only on the mass. lift scales the swellings
// alone: where it is 0 the lobes only dent the surface
float lobeLayer(float f, float n, float band, float dent, float lift) {
  return f + max(min(n, 0.0), -dent) * (1.0 - smoothstep(0.0, 2.0 * dent, f))
           + max(n, 0.0) * 0.60 * lift * smoothstep(-band, -0.02, f);
}

#ifdef FEAT_CBVOL
// \u2500\u2500 The volumetric thunderhead (RendererOptions.cumulonimbus) \u2500\u2500
//
// The same towers the 2D field draws, standing where it puts them, but as a
// body of cloud with depth: turrets that stand in front of and behind one
// another, and lobes that are lumps in three dimensions shadowing one
// another \u2014 found and lit by marching a ray into it, rather than painted
// onto a silhouette.
//
// It is laid out in the storm's own sky (the one cbScale stretches the real
// one into), in storm units \u2014 a radian of that sky: across the tower (x,
// along the azimuth, from this pixel's column), up it (y, the sine of the
// elevation, ty) and through it (z, away from the eye, from the ring the
// towers stand on). The ray is marched through that depth at its own x and
// y: a tower some tens of kilometres off is a few deep, and the outline it
// shows is the one the 2D field gives it, so the anvil, the veil and the
// shafts still meet it where they always did.
//
// The body is the 2D field's own turrets (turretRow's cells, thrusts and
// clocks, read the same way), each now a round column standing at a depth
// of its own with a head a little flatter than a ball, the neighbours
// melted together as the 2D skyline's are, on the broad body the 2D tower
// stands its turrets on, and the congestus skirt's turrets crowding its foot
// a little nearer the eye. A distance to that surface, not a field in some
// measure of its own: a lobe laid on it swells a steep flank as far as a
// gentle head, and the march can step by it.

// Value noise in three dimensions, two fetches of the lattice's squares of
// four (u_noiseQ, see vnoiseHQ) a slice apart, blended here in full
// precision: a surface found where a field crosses zero shows every step a
// texture filter leaves in its blend, as contour lines round every lobe.
// Slice z of the lattice is the 2D lattice shifted by z\xB7(113, 71), which
// only comes back on itself 133 cells away
float vnoise3(vec3 p) {
  vec3 i = floor(p), f = p - i;
  f = f * f * (3.0 - 2.0 * f);
  vec2 uv = (i.xy + vec2(113.0, 71.0) * i.z + 0.5) * ${(1/G).toFixed(10)};
  vec4 q = mix(NOISEQ_FETCH(uv), NOISEQ_FETCH(uv + vec2(113.0, 71.0) * ${(1/G).toFixed(10)}), f.z);
  return mix(mix(q.x, q.y, f.x), mix(q.z, q.w, f.x), f.y);
}
// ...and the same field through the texture filter: two fetches of the
// filtered lattice (as vnoise reads it) a slice apart. The filter blends in
// steps of a 256th of a cell, so where the surface's own place or light is
// read off it the steps show (see above); but a march only asking how far
// off the surface still is, or a tap read through a smoothstep many times
// wider than a step, cannot tell the two apart \u2014 at a fraction of the cost
float vnoise3f(vec3 p) {
  vec3 i = floor(p), f = p - i;
  f = f * f * (3.0 - 2.0 * f);
  vec2 uv = (i.xy + f.xy + vec2(113.0, 71.0) * i.z + 0.5) * ${(1/G).toFixed(10)};
  return mix(NOISE_FETCH(uv).r, NOISE_FETCH(uv + vec2(113.0, 71.0) * ${(1/G).toFixed(10)}).r, f.z);
}
// ...and which way it climbs (yzw, per unit of p), from the same two
// fetches and the slopes of the blend between them
vec4 vnoise3d(vec3 p) {
  vec3 i = floor(p), f = p - i;
  vec3 u = f * f * (3.0 - 2.0 * f), du = 6.0 * f * (1.0 - f);
  vec2 uv = (i.xy + vec2(113.0, 71.0) * i.z + 0.5) * ${(1/G).toFixed(10)};
  vec4 a = NOISEQ_FETCH(uv), b = NOISEQ_FETCH(uv + vec2(113.0, 71.0) * ${(1/G).toFixed(10)});
  vec4 q = mix(a, b, u.z), dq = b - a;
  float x0 = mix(q.x, q.y, u.x), x1 = mix(q.z, q.w, u.x);
  return vec4(mix(x0, x1, u.y),
              vec3(mix(q.y - q.x, q.w - q.z, u.y), x1 - x0,
                   mix(mix(dq.x, dq.y, u.x), mix(dq.z, dq.w, u.x), u.y)) * du);
}

// the coarsest lobes' size, in storm units: two or three to a turret's head
const float CBV_L0 = 0.090;
// how far each scale of lobes swells the surface, as a share of its size
const float CBV_AMP = 0.80;
// how far apart the turrets may stand in depth, and the skirt's in front
const float CBV_ZT = 0.26;
const float CBV_ZS = 0.10;
// how much flatter than a ball a turret's head is, at the flattest
const float CBV_HEAD = 1.30;
// how fast the broad body the turrets stand on rounds off through its
// depth (its height falls by this times the depth squared): a ridge a
// turret or so deep. Twice as deep, its smooth front stood out before the
// turrets' feet all along the lower tower, a grey band ruled across it
const float CBV_BODYZ = 20.0;
// the extinction the march's light sees: toward the sun, from the sky
// overhead, and back along the eye's own ray
const float CBV_SIGL = 110.0;
const float CBV_SIGA = 9.0;
const float CBV_SIGV = 220.0;

// The cauliflower: lobes on lobes, each scale half the size of the one
// before. Each scale is billowed value noise, |2n \u2212 1|: rounded where the
// noise is high or low and creased sharp where it crosses the middle \u2014 a
// dome between two folds, which a sum of smooth noise is not (it swells and
// sags as softly as it rises, and a face of it reads as putty). Centred on
// its mean (0.30), so the surface swells and creases about the body rather
// than inflating past it, and each scale swells only within its own reach
// of the surface the coarser ones left: a floret sits on a lobe and a lobe
// on the body, and none stands clear of it with sky beneath (lobeLayer's
// rule, in three dimensions). Where no lobe may rise (lift: the anvil's
// flat) they only crease.
//
// Only the two coarse scales are the surface itself. The field climbs as
// steeply through every scale of lobes as through the first \u2014 each swells
// by four fifths of its own size \u2014 so the finer scales' rims were cliffs a
// march could not find to within a pixel without stepping a pixel at a
// time, and taken as surface they sparkled along every rim and crawled
// along the outline as they drifted, three scales of them five times over
// what two did. The florets past them are the 2D tower's own (budPack),
// laid on the light alone where the ray met the body (see the light).
//
// Each scale is laid on only where the screen can hold it, from two pixels
// to five (fp: storm units to a pixel), so a scale never shimmers at the
// size of a pixel. And the lobes evolve: each scale drifts slowly up the
// tower, as a growing tower's lobes rise and roll over, and boils in place
// \u2014 the noise slid through the depth, so lobes swell out of the face and
// sink back into it \u2014 the finer the faster.
//
// What a scale swells by and where it has got to in its evolution are the
// same for every read of the body a pixel makes, so they are set once per
// pixel (cbLobeSetup): g_cbA the swell of each (the lobes' weight, the fade
// and the size folded in), and g_cbE0..1 each one's drift. The second is
// the first taken twice as fine with its axes turned (yzx), so up, which
// is y in the first, is x in the second, and through, z, is y
vec2 g_cbA;
vec3 g_cbE0, g_cbE1;
// Each scale is read where the point it lies over on the surface below it
// is, not at the point itself: shifted back along the surface's outward
// turn by how far off the surface the point is (g_cbU, in the lobes' noise,
// a storm unit of shift for a storm unit of field: see the turrets in main).
// Read where it stood, a lobe was a lump of the noise in three dimensions,
// and the band it may swell in a lump's own size: where the noise ran high
// some way out from a narrow crown but crossed its middle nearer in, the
// lump stood clear of the crown with sky under it, and where it ran high in
// a narrow streak it stood up off the crown as a finger. Read along the
// surface's turn, each scale is a swelling of the surface itself, as high as
// its noise says where it stands: a dome on the face under it, never apart
// from it. (Only across and up the sky: through the depth, along the eye's
// ray, a lump in front of a face only ever shows as a bump on it)
vec3 g_cbU;
void cbLobeSetup(float fp, float lobe) {
  vec2 lam = CBV_L0 * vec2(1.0, 0.5);
  g_cbA = CBV_AMP * lam * smoothstep(2.0, 5.0, lam / fp) * lobe;
  // (rising a hundredth of a storm unit for every unit of evolution,
  // whatever the scale; boiling faster the finer it is)
  vec2 r = u_evo * 0.010 / lam;
  g_cbE0 = vec3(0.0, -r.x, u_evo * 0.20);
  g_cbE1 = vec3(-r.y, u_evo * 0.30, 0.0);
}
// the most the lobes can move the surface by, all told (the second scale
// alone, for a march that has read the first)
float cbLobeRest(float from) {
  return 0.70 * (from < 0.5 ? g_cbA.x + g_cbA.y : g_cbA.y);
}
// one scale laid on the surface f: q is where in its noise, a its swell
float cbLobe(float f, vec3 q, float a, float lift) {
  float b = abs(2.0 * vnoise3(q) - 1.0) - 0.30;
  return f + a * (b < 0.0 ? b : b * lift * smoothstep(-a, 0.0, f));
}
// (through the filter: for the march and the taps, see vnoise3f)
float cbLobeF(float f, vec3 q, float a, float lift) {
  float b = abs(2.0 * vnoise3f(q) - 1.0) - 0.30;
  return f + a * (b < 0.0 ? b : b * lift * smoothstep(-a, 0.0, f));
}
//   f     the surface so far (storm units, > 0 inside)
//   N     where in the lobes' noise (storm units)
//   oct   how many scales to read (taps a long way off need one)
//   win   how near the surface the caller can still tell one value from
//         another: a tap reads its value through a smoothstep that far
//         either side. Once the surface so far stands further than that
//         from zero and the scales left can no longer bring it back, they
//         would not change what the caller sees, and are not read \u2014
//         exactly: a tap deep in the cloud or well out in the air reads
//         only the coarse scale, or none
float cbLobes3(float f, vec3 N, float lift, float oct, float win) {
  if (oct < 0.5 || abs(f) > win + 0.70 * (g_cbA.x + g_cbA.y)) return f;
  vec3 p = N * (1.0 / CBV_L0);
  vec3 u = g_cbU * (1.0 / CBV_L0);
  f = cbLobeF(f, p + u * clamp(f, -g_cbA.x, g_cbA.x) + g_cbE0, g_cbA.x, lift);
  if (oct > 1.5 && g_cbA.y > 0.0 && abs(f) < win + 0.70 * g_cbA.y) {
    p = (p + u * clamp(f, -g_cbA.y, g_cbA.y)).yzx * 2.03 + vec3(17.3, 9.1, 5.7);
    f = cbLobeF(f, p + g_cbE1, g_cbA.y, lift);
  }
  return f;
}

// One turret of a row, read as turretStep reads it (the same cell, height
// and size, out of the table): x its center across from the pixel's place c
// in the row (storm units), y its top, z its radius, w the hash it stands in
// depth by
vec4 cbTurret(float kk, float c, float n, float row, float cell) {
  vec2 aux;
  vec4 tr = rowTurret(kk, n, row, aux);
  return vec4((tr.y - c) * cell, tr.z, (0.80 + 0.25 * tr.w) * cell, aux.y);
}

// a smooth max: two fields melted together over k, as two turrets' heads
// are where they meet (a hard max leaves a crease the lobes cut into a slot)
float smaxK(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return max(a, b) + h * h * k * 0.25;
}

// What a pixel's march reads the body from, set once per pixel in main:
// the turrets near its column (the tower's row, T, and the skirt's, S), and
//   g_cbP  the broad body the turrets stand on (x), the ceiling over them
//          (y), how far it caps them (z: only under a spreading anvil) and
//          how many of the tower's cells to a storm unit here (w)
//   g_cbQ  the base (x), a pixel in storm units (y), the lobes' weight (z),
//          the pixel's own height (w)
//   g_cbN  where the pixel's column is in the lobes' noise, and the
//          directions across it and through it there
vec4 g_cbT0, g_cbT1, g_cbT2, g_cbT3;
vec4 g_cbS0, g_cbS1, g_cbS2, g_cbS3;
// (the height the skirt's turrets reach no higher than, with room to spare:
// over it they are not read at all \u2014 see where they are looked up, in main)
float g_cbSkY;
vec4 g_cbP;
vec4 g_cbQ;
vec3 g_cbN, g_cbTg, g_cbRad;

// One turret as a body: a round column of radius T.w under a head centered
// at height T.y and depth T.z, its field the distance inside its surface
// (> 0 inside). p is the point across, up and through.
//
// Only the heads stand at depths of their own. Down the tower the columns
// lean back in to the middle of it, to stand on the base together: kept at
// their heads' depths all the way down, every pair of neighbours left a
// slot between them, one in front of the other, ruled from the head to the
// base, and in the shadow each threw on the next the tower came out a
// bundle of organ pipes. And each widens a little toward its foot
// (CBV_FLARE a storm unit down): plumb, its walls stood square to a high
// sun and every lobe on them threw its shadow straight down the wall.
//
// The lean runs over twice the height of the head's center over the base \u2014
// about the turret's whole height \u2014 eased in and out (where it stopped short
// the face turned over in a line ruled across the turret, and the line
// climbed it as the turret grew), and only the tower's own turrets lean:
// run over the head's center alone, now the head is a tall dome, a column
// leaning toward the eye overhung its foot as steeply as a roof, and the
// skirt's short ones (ref > 0, see cbHead) were all overhang \u2014 a band of
// faces turned to the ground along the whole foot of the tower, the sun's
// light gone from them. The skirt stands in front at its own depths, plumb
const float CBV_FLARE = 0.6;
// (the flare starts under the head's middle, eased in over a twentieth of
// a storm unit: begun at a stroke, the wall turned over there in a line)
float cbFlare(float h) {
  return h > 0.05 ? h - 0.025 : max(h, 0.0) * max(h, 0.0) * 10.0;
}
float cbLeanH(vec4 T) {
  return 1.0 / max(2.0 * (T.y - g_cbQ.x), 0.10);
}
float cbLean(float y, vec4 T, float ref) {
  float l = clamp((y - g_cbQ.x) * cbLeanH(T), 0.0, 1.0);
  return ref > 0.0 ? T.z : T.z * l * l * (3.0 - 2.0 * l);
}
// The head is as tall as the turret stands over the body it rises from (ref
// under its center: the horizon for the tower's row, as the 2D skyline
// measures it, the base for the skirt's) \u2014 a dome two fifths of the turret's
// height deep, near enough turretStep's, which falls to half at its radius:
// taller than it is wide on a big turret. (Half, the tallest stood as
// fingers, the lobes on their narrow crowns piled up like grapes.) Heads a little flatter than a ball on columns run
// down to the base stood as a row of drums, their tops level with one
// another: a mesa, and from the side a ledge ruled along it
const float CBV_DOME = 0.40;
float cbHead(vec4 T, float ref) {
  return T.w / max((T.y - ref) * (CBV_DOME / (1.0 - CBV_DOME)), T.w / CBV_HEAD);
}
float cbColumn(vec3 p, vec4 T, float ref) {
  float r = T.w * (1.0 + CBV_FLARE * cbFlare(T.y - p.y));
  return r - length(vec3(p.x - T.x, max(p.y - T.y, 0.0) * cbHead(T, ref), p.z - cbLean(p.y, T, ref)));
}
// How far the columns sway at a height (across, through): a turret does not
// climb plumb, and two plumb columns melted together meet in a crease ruled
// straight up the tower. All of them sway together, by a few hundredths
// and a little differently from one place across the tower to the next
vec2 cbSway(float y, float x) {
  return 0.035 * vec2(sin(y * 14.0 + x * 9.0 + 1.7), sin(y * 11.0 - x * 7.0 + 4.2));
}


// The body at p \u2014 across from the pixel's column, the height (ty) and the
// depth \u2014 as a distance inside its surface, the lobes laid on at oct scales
float cbFinish(float f, vec3 p, float oct, float win) {
  // capped under the ceiling where an anvil spreads, met in a rounded
  // shoulder; and there the lobes only crease the flat, never swell it
  float ceilD = g_cbP.y - p.y;
  f = mix(f, -smaxK(-f, -ceilD, 0.04), g_cbP.z);
  float lift = mix(1.0, smoothstep(0.02, 0.10, ceilD), g_cbP.z);
  vec3 N = g_cbN + g_cbTg * p.x + vec3(0.0, p.y, 0.0) + g_cbRad * p.z;
  f = cbLobes3(f, N, lift, oct, win);
  // and nothing under the base: a flat underside, ruled across the tower
  return min(f, p.y - g_cbQ.x);
}
// How far a turret is drawn down, for cbBare, standing c of its row's
// cells across from the pixel. The pixel looks up the four turrets nearest
// it in a row, and as it passes from one cell to the next the farthest of
// them, two cells off, gives way to the next one along on the other side.
// That is nothing to the surface \u2014 no turret two cells off reaches the
// ray \u2014 but the tower-wide tap toward the sun reads the body up to two
// cells across, where the turret that came or went stands: the light it
// found stepped there, a line ruled straight down the tower at every cell,
// bright on one side and grey on the other. So the bare body read whole
// takes no turret further off than a cell and four fifths (a cell's center
// stands up to a fifth of a cell off its middle), drawn out of it over the
// half cell before: looked up or not, it is already gone. (Only the two at
// the ends of the four can stand that far off; the middle two are within a
// cell and a fifth)
float cbFar(float c) {
  return 0.3 * smoothstep(1.3, 1.8, abs(c));
}
float cbBare(vec3 p) {
  // the broad body, rounded off through its depth (and taken as a distance:
  // divided by how steeply it climbs there)
  float f = (g_cbP.x - p.y - CBV_BODYZ * p.z * p.z) / sqrt(1.0 + 4.0 * CBV_BODYZ * CBV_BODYZ * p.z * p.z);
  vec3 q = p;
  q.xz += cbSway(p.y, p.x);
  // (written out turret by turret: kept in an array and read in a loop, the
  // eight of them went through memory at every read of the body, and the
  // march reads it some forty times a pixel)
  f = smaxK(f, cbColumn(q, g_cbT0, 0.0) - cbFar(g_cbT0.x * g_cbP.w), 0.05);
  f = smaxK(f, cbColumn(q, g_cbT1, 0.0), 0.05);
  f = smaxK(f, cbColumn(q, g_cbT2, 0.0), 0.05);
  f = smaxK(f, cbColumn(q, g_cbT3, 0.0) - cbFar(g_cbT3.x * g_cbP.w), 0.05);
  if (p.y < g_cbSkY) {
    // (the skirt's cells are narrower than the tower's)
    float iS = g_cbP.w * ${(Z/X).toFixed(4)};
    f = smaxK(f, cbColumn(q, g_cbS0, g_cbQ.x) - cbFar(g_cbS0.x * iS), 0.03);
    f = smaxK(f, cbColumn(q, g_cbS1, g_cbQ.x), 0.03);
    f = smaxK(f, cbColumn(q, g_cbS2, g_cbQ.x), 0.03);
    f = smaxK(f, cbColumn(q, g_cbS3, g_cbQ.x) - cbFar(g_cbS3.x * iS), 0.03);
  }
  return f;
}

// The bare body at p before cbFinish \u2014 the broad body and the turrets
// melted together, no cap, no lobes \u2014 and which way it climbs there (x the
// value, yzw the gradient), worked out alongside rather than by reading it
// again either side. The light's short taps all lie within a twentieth of
// a storm unit of where the ray met the surface, where the bare body is as
// good as a plane (a turret is a dozen hundredths across): each takes the
// body from that plane and lays the cap and the lobes on it as cbBody does,
// so the eight turrets are read once for all of them rather than once each
// (two smooth maxima's gradient: each side weighted by how much of the
// blend it holds)
vec2 smaxW(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  float wa = 0.5 + 0.5 * sign(a - b) * (1.0 - h);
  return vec2(max(a, b) + h * h * k * 0.25, wa);
}
vec4 cbColumnG(vec3 q, vec4 T, float ref) {
  float hy = q.y - T.y, hd = cbHead(T, ref);
  float inv = ref > 0.0 ? 0.0 : cbLeanH(T);
  float l = (q.y - g_cbQ.x) * inv;
  float lc = ref > 0.0 ? 1.0 : clamp(l, 0.0, 1.0);
  vec3 v = vec3(q.x - T.x, max(hy, 0.0) * hd, q.z - T.z * lc * lc * (3.0 - 2.0 * lc));
  float len = max(length(v), 1e-5);
  float r = T.w * (1.0 + CBV_FLARE * cbFlare(-hy));
  // d(lean)/dy, inside the stretch the lean runs over
  float dl = 6.0 * T.z * lc * (1.0 - lc) * inv;
  float dy = -T.w * CBV_FLARE * clamp(-hy * 20.0, 0.0, 1.0) - (v.y * (hy > 0.0 ? hd : 0.0) - v.z * dl) / len;
  return vec4(r - len, -v.x / len, dy, -v.z / len);
}
vec4 cbBodyG(vec3 p) {
  float s = sqrt(1.0 + 4.0 * CBV_BODYZ * CBV_BODYZ * p.z * p.z);
  float nb = g_cbP.x - p.y - CBV_BODYZ * p.z * p.z;
  vec3 gb = vec3(0.0, -1.0 / s, (-2.0 * CBV_BODYZ * p.z - nb * 4.0 * CBV_BODYZ * CBV_BODYZ * p.z / (s * s)) / s);
  // the sway moves the point the turrets are read at: its Jacobian
  float a1 = p.y * 14.0 + p.x * 9.0 + 1.7, a2 = p.y * 11.0 - p.x * 7.0 + 4.2;
  vec2 sw = 0.035 * vec2(sin(a1), sin(a2));
  vec2 cs = 0.035 * vec2(cos(a1), cos(a2));
  vec3 q = p + vec3(sw.x, 0.0, sw.y);
  // the value, how much of it is still the broad body's, and the turrets'
  // share of its gradient (taken against q)
  float f = nb / s, wB = 1.0;
  vec3 gq = vec3(0.0);
  vec4 c; vec2 m;
  c = cbColumnG(q, g_cbT0, 0.0); m = smaxW(f, c.x, 0.05); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
  c = cbColumnG(q, g_cbT1, 0.0); m = smaxW(f, c.x, 0.05); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
  c = cbColumnG(q, g_cbT2, 0.0); m = smaxW(f, c.x, 0.05); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
  c = cbColumnG(q, g_cbT3, 0.0); m = smaxW(f, c.x, 0.05); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
  if (p.y < g_cbSkY) {
    c = cbColumnG(q, g_cbS0, g_cbQ.x); m = smaxW(f, c.x, 0.03); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
    c = cbColumnG(q, g_cbS1, g_cbQ.x); m = smaxW(f, c.x, 0.03); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
    c = cbColumnG(q, g_cbS2, g_cbQ.x); m = smaxW(f, c.x, 0.03); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
    c = cbColumnG(q, g_cbS3, g_cbQ.x); m = smaxW(f, c.x, 0.03); f = m.x; wB *= m.y; gq = gq * m.y + c.yzw * (1.0 - m.y);
  }
  // q.x = p.x + 0.035 sin(a1), q.z = p.z + 0.035 sin(a2)
  vec3 gp = vec3(gq.x * (1.0 + 9.0 * cs.x) - 7.0 * gq.z * cs.y,
                 gq.y + 14.0 * gq.x * cs.x + 11.0 * gq.z * cs.y,
                 gq.z);
  return vec4(f, gp + wB * gb);
}

// ...and the same along the pixel's own ray, where only the depth z
// changes. Everything about a turret there but its depth is fixed for the
// pixel, so it is read once (g_cbR the tower's turrets, g_cbK the skirt's):
// x the square of how far the ray passes from its axis across and up, y its
// radius at this height (the flare), z the depth its axis stands at here
// (the lean, less the sway through the depth). A turret is then a distance in
// depth alone. So are the cap under the ceiling, the base and where the
// lobes' noise is read: the march reads the body a dozen or two times a
// pixel, and each read is the bare body and the lobes over it and nothing
// else. (The taps that leave the ray, above, read it whole)
vec3 g_cbR0, g_cbR1, g_cbR2, g_cbR3, g_cbK0, g_cbK1, g_cbK2, g_cbK3;
float g_cbBody;
// g_cbY: the ray's own (cap under the ceiling, lift, base), g_cbM where in
// the lobes' noise the ray is at depth 0
vec3 g_cbY, g_cbM;
float cbRayCol(float z, vec3 R) {
  float dz = z - R.z;
  return R.y - sqrt(R.x + dz * dz);
}
// the bare body along the ray, capped as cbFinish caps it
float cbRayBare(float z) {
  float f = (g_cbBody - CBV_BODYZ * z * z) / sqrt(1.0 + 4.0 * CBV_BODYZ * CBV_BODYZ * z * z);
  f = smaxK(f, cbRayCol(z, g_cbR0), 0.05);
  f = smaxK(f, cbRayCol(z, g_cbR1), 0.05);
  f = smaxK(f, cbRayCol(z, g_cbR2), 0.05);
  f = smaxK(f, cbRayCol(z, g_cbR3), 0.05);
  if (g_cbQ.w < g_cbSkY) {
    f = smaxK(f, cbRayCol(z, g_cbK0), 0.03);
    f = smaxK(f, cbRayCol(z, g_cbK1), 0.03);
    f = smaxK(f, cbRayCol(z, g_cbK2), 0.03);
    f = smaxK(f, cbRayCol(z, g_cbK3), 0.03);
  }
  return mix(f, -smaxK(-f, -g_cbY.x, 0.04), g_cbP.z);
}
// the lobes on it, through the filter: what the march reads
float cbRayLobes(float f, float z) {
  vec3 p = (g_cbM + g_cbRad * z) * (1.0 / CBV_L0);
  vec3 u = g_cbU * (1.0 / CBV_L0);
  f = cbLobeF(f, p + u * clamp(f, -g_cbA.x, g_cbA.x) + g_cbE0, g_cbA.x, g_cbY.y);
  p = (p + u * clamp(f, -g_cbA.y, g_cbA.y)).yzx * 2.03 + vec3(17.3, 9.1, 5.7);
  if (g_cbA.y > 0.0) f = cbLobeF(f, p + g_cbE1, g_cbA.y, g_cbY.y);
  return f;
}
// the whole of it at depth z \u2014 and read exactly, not through the filter:
// this is where the surface is put, and where the march's nearest pass is
// taken from for the fade at the outline
float cbRay(float z) {
  float f = cbRayBare(z);
  vec3 p = (g_cbM + g_cbRad * z) * (1.0 / CBV_L0);
  vec3 u = g_cbU * (1.0 / CBV_L0);
  f = cbLobe(f, p + u * clamp(f, -g_cbA.x, g_cbA.x) + g_cbE0, g_cbA.x, g_cbY.y);
  if (g_cbA.y > 0.0) {
    p = (p + u * clamp(f, -g_cbA.y, g_cbA.y)).yzx * 2.03 + vec3(17.3, 9.1, 5.7);
    f = cbLobe(f, p + g_cbE1, g_cbA.y, g_cbY.y);
  }
  return f;
}

// The whole body where the ray met it, at depth z, and which way it climbs
// there (yzw), from the bare body's own (B, cbBodyG): capped, every scale of
// lobes laid on and the base, as cbRay, with the slopes carried through.
// The light's nearest taps \u2014 a hundredth or two of a storm unit off \u2014 read
// the body from the plane this gives instead of reading it again each
// (one scale of lobes: its swell, and the swell's slope)
//
// The crease where a scale's noise crosses its middle turns the surface over
// in a line no wider than the noise is fine: under a pixel, the light read
// off this plane flipped from one side of it to the other there, and as the
// lobes drifted the line crawled. So the slope turns over across three
// pixels instead (lam: the scale's size, in storm units \u2014 its noise climbs
// some three times its range across one of them)
vec4 cbLobeG(vec4 F, vec4 n, vec3 g, float a, float lam) {
  float s = 2.0 * n.x - 1.0;
  float b = abs(s) - 0.30;
  // (and on a soft cloud, features.softness, across a quarter of the
  // noise's range however large the scale: a fold between two lobes is a
  // rounded valley, not a crease)
  float e = max(9.0 * g_cbQ.y / lam, 0.25 * u_cbFeat.w);
  // (and a scale under ten pixels across turns the light with less of its
  // slope, none under four: a floret a few pixels wide turned its pixels
  // lit and unlit one by one as it drifted, a sparkle over the face. Its
  // swell stays \u2014 the outline and the taps further off still see it)
  vec3 gb = s * inversesqrt(s * s + e * e) * 2.0 * g * smoothstep(4.0, 10.0, lam / g_cbQ.y);
  if (b < 0.0) return F + a * vec4(b, gb);
  float t = clamp(F.x / a + 1.0, 0.0, 1.0);
  float S = t * t * (3.0 - 2.0 * t), dS = 6.0 * t * (1.0 - t) / a;
  float l = a * g_cbY.y;
  return vec4(F.x + l * b * S, F.yzw + l * (S * gb + b * dS * F.yzw));
}
vec4 cbFieldG(float z, vec4 B) {
  // the cap (a smooth minimum with the ceiling, which falls as y climbs)
  vec2 c = smaxW(-B.x, -g_cbY.x, 0.04);
  vec4 F = mix(B, vec4(-c.x, B.yzw * c.y - vec3(0.0, 1.0 - c.y, 0.0)), g_cbP.z);
  // each scale's noise is read at p, the one before taken twice as fine
  // with its axes turned (yzx), so its slope comes back to the noise's own
  // axes turned the other way (zxy) for every scale it has passed through;
  // and to the body's (across, up, through) as the noise is laid on it
  // (each read along the surface's turn, g_cbU: the noise's slope taken
  // on through the shift, which climbs with the field's own)
  vec3 p = (g_cbM + g_cbRad * z) * (1.0 / CBV_L0);
  vec3 u = g_cbU * (1.0 / CBV_L0);
  vec3 uB = vec3(dot(g_cbU, g_cbTg), g_cbU.y, 0.0);
  float sh = clamp(F.x, -g_cbA.x, g_cbA.x);
  vec4 n = vnoise3d(p + u * sh + g_cbE0);
  vec3 gN = n.yzw * (1.0 / CBV_L0);
  vec3 gB = vec3(dot(gN, g_cbTg), gN.y, dot(gN, g_cbRad));
  gB += dot(gB, uB) * F.yzw * step(abs(F.x), g_cbA.x);
  F = cbLobeG(F, n, gB, g_cbA.x, CBV_L0);
  if (g_cbA.y > 0.0) {
    sh = clamp(F.x, -g_cbA.y, g_cbA.y);
    p = (p + u * sh).yzx * 2.03 + vec3(17.3, 9.1, 5.7);
    n = vnoise3d(p + g_cbE1);
    gN = n.wyz * (2.03 / CBV_L0);
    gB = vec3(dot(gN, g_cbTg), gN.y, dot(gN, g_cbRad));
    gB += dot(gB, uB) * F.yzw * step(abs(F.x), g_cbA.y);
    F = cbLobeG(F, n, gB, g_cbA.y, CBV_L0 * 0.5);
  }
  // and the base: flat, climbing straight up
  return F.x < g_cbY.z ? F : vec4(g_cbY.z, 0.0, 1.0, 0.0);
}

// The light's near reading where the ray meets the body, at depth z along
// it (or comes nearest it): the whole body and its slope there (F), the
// bare body's (B), and how much cloud stands a floret, a lobe and a turret
// toward the sun (x, weighted as the light sums them), a lobe up (y) and
// back toward the eye (z), and behind the surface along the ray (w). See
// the light, in main, for what each is.
//
// fr: the point is instead the edge of a turret standing in front of
// another (cF in main), where the ray passes nearest it, just off its
// surface. There the bare body is the two turrets melted together across
// the seam, and stands deeper than the edge itself does: read as it is,
// the taps toward the sun and the sky found the turret behind standing
// over the edge, and lit it as a crease \u2014 a dark line down every seam. So
// for the edge the bare body is taken no deeper than the surface
vec4 cbNear(float z, vec3 Ls, float wEs, bool fr, out vec4 B, out vec4 F) {
  vec3 P = vec3(0.0, g_cbQ.w, z);
  B = cbBodyG(P);
  F = cbFieldG(z, B);
  // (a point the ray only came near \u2014 the outline, or the edge of a
  // turret in front of another \u2014 is lit as the surface it nearly touched:
  // the plane through it, at the slope the field has there)
  float sh = min(F.x, 0.0);
  F.x -= sh; B.x -= sh;
  // (a soft surface turns with the blurred density's gradient: less of
  // the lobes' own slope, more of the body's under them. The near taps,
  // the face's turn and the light through it all read the blend)
  F.yzw = mix(F.yzw, B.yzw, 0.5 * u_cbFeat.w);
  if (fr) B.x = min(B.x, F.x);
  float w2 = 0.012 + wEs;
  float t0 = smoothstep(-0.002 - wEs, 0.002 + wEs, F.x + 0.005 * dot(F.yzw, Ls));
  float t1 = smoothstep(-0.005 - wEs, 0.005 + wEs, F.x + 0.015 * dot(F.yzw, Ls));
  float t2 = smoothstep(-w2, w2, cbFinish(B.x + 0.045 * dot(B.yzw, Ls), P + Ls * 0.045, 1.0, w2));
  // (the sky's: up, a lobe off, and back toward the eye \u2014 a point in a
  // crease has lobe standing over it and in front of it on the way out,
  // where one on a bulge has open air)
  float u1 = smoothstep(-w2, w2, cbFinish(B.x + 0.045 * B.z, P + vec3(0.0, 0.045, 0.0), 1.0, w2));
  float u3 = smoothstep(-0.006 - wEs, 0.006 + wEs, F.x + 0.006 * F.z - 0.02 * F.w);
  // (and the eye's own ray: little cloud behind a grazing margin)
  float v1 = smoothstep(-0.003 - wEs, 0.003 + wEs, F.x + 0.010 * F.w);
  return vec4(0.005 * t0 + 0.010 * t1 + 0.030 * t2, u1, u3, v1);
}
#endif

// The anvil's plate, where the view ray crosses a level plane at the
// tropopause (X; the plane at height 1 and the eye under its middle).
//
// The towers are read as standing round a ring of radius D on that plane \u2014
// the distance at which a top at height 1 sits at the elevation the
// cylinder puts it at \u2014 one per turret (turretRow's own cells, read the
// same way, so a plate only ever spreads from a turret that is there to
// feed it). Every turret that reached the ceiling spreads a plate: out
// round its head a little, and downwind of it for two or three times the
// tower's width, widening as it goes. Which turrets can reach X is a
// question of where the upwind line through X crosses the ring, so only
// the few turrets either side of the crossing are read.
//
// The plate is laid out in the plane, so it takes the plane's perspective:
// side-on a band drooping a little as its far end recedes, a sheet
// reaching up over the eye from a tower upwind, its underside in view. In
// one respect it is not: its depth along the line of sight is counted
// four times over. Taken at its true depth a plate twice a tower's width,
// seen from under thirty degrees, is a ceiling a quarter of the sky deep,
// where what the eye knows from photographs (taken from much further off)
// is a thin flat band; the cylinder the towers stand on keeps them at
// their angular size the same way.
//
// What it covers and how dense it is are kept apart. Read as one, the
// plate's far end thinned by narrowing \u2014 the cross-section's edge closing
// in on its middle as the density fell \u2014 and every plume ended in a point:
// a grey cigar laid across the sky, the tower that fed it often out of the
// frame. A plume does not narrow as it runs out; it fans out and thins, a
// veil of ice the sky shows through, so the cover keeps its width to the
// end and only the density falls.
//   x  how much of the plate's cross-section the ray is inside, 0..1
//   y  how far downwind of its turret X is
//   z  how dense the plate is there, as a share of its thickness over its
//      tower: thinning downwind, and to nothing past its reach
//   w  where across the band the ray is: < 0 its near edge, toward the
//      top, > 0 its underside, below
// fib is the fibres (anvilFibre), read once by the caller
float anvilFibre(vec2 X) {
  // the upper wind: the way the cirrus drift, toward \u2212x
  vec2 up = vec2(0.9889, 0.1483);
  float b = dot(X, up);
  float l = dot(X, vec2(-up.y, up.x));
  // Fibrous: the ice is drawn out into strands along the wind, so the
  // noise runs long along it and fine across it, and it carries the
  // leading edge out in fingers rather than a clean front
  return vnoise(vec2(l * 11.0, b * 0.8 - u_evo * 0.04) + 5.0) * 0.62
       + vnoise(vec2(l * 27.0, b * 1.9 - u_evo * 0.07) + 9.0) * 0.38;
}
vec4 anvilPlate(vec2 X, float tE, float D, float gain, float L, float th0, float fib, float sc,
                out float orphan) {
  vec2 up = vec2(0.9889, 0.1483);
  float b = dot(X, up);
  float l = dot(X, vec2(-up.y, up.x));
  // and the plate's margins billow where they meet the sky, rather than
  // running ruled along the wind
  float bil = vnoise(X * 4.3 + vec2(11.0, u_evo * 0.05)) - 0.5;
  vec4 best = vec4(0.0);
  float orph = 0.0;
  vec2 rh = X / max(length(X), 1e-3);
  vec2 tg = vec2(rh.y, -rh.x);
  // where the upwind line crosses the ring; past the ring's edge, the
  // nearest point of it
  float sq = sqrt(max(D * D - l * l, 0.0));
  float N = ${X.toFixed(1)} * sc;
  for (int k = 0; k < 2; k++) {
    float s0 = -b + (k == 0 ? -sq : sq);
    if (s0 > -0.6 && s0 < L * 1.5) {
      vec2 Q = X + s0 * up;
      float cQ = mod(atan(Q.x, Q.y) + u_windOff * 0.15, 6.2831853) * N / 6.2831853;
      float ic = floor(cQ);
      for (int j = -2; j <= 2; j++) {
        // the turret: the same cell, center and thrust turretRow reads
        vec2 aux;
        vec4 tr = rowTurret(ic + float(j), N, 1.0, aux);
        float id = tr.x;
        float h2 = aux.x;
        float cc = tr.y;
        // (how much of a turret its cell holds: the narrow one's is less)
        float rcz = id > floor(N) - 0.5 ? smoothstep(0.0, 0.6, fract(N)) : 1.0;
        float ak = cc * 6.2831853 / N;
        // (faded out toward the ends of the window read, or where the
        // window moves on a turret would drop out of it at a stroke and
        // cut a seam through its plate)
        float winC = 1.0 - smoothstep(1.4, 2.4, abs(cc - cQ));
        // Where its plume lies, before anything says whether it feeds one:
        // most of the turrets read lie nowhere near X, and their thrust
        // need not be looked up at all
        float aw = ak - u_windOff * 0.15;
        vec2 T = vec2(sin(aw), cos(aw)) * D;
        vec2 rel = X - T;
        // downwind of the turret, and to the side of its plume: across
        // the line of sight, and along it (counted four times, above)
        float s = -dot(rel, up);
        vec2 lat = rel + s * up;
        float la = dot(lat, tg);
        float lr = dot(lat, rh);
        float sp = max(s, 0.0);
        // as wide as the turret's head where it leaves it, and fanning
        // out downwind
        float wA = (0.26 + 0.08 * h2) + 0.50 * sp;
        // thickest over the turret, and thinning from the moment it
        // spreads: the ice that fans out is the same ice over more sky.
        // Kept a sheet the sky does not show through most of the way
        // out, a plate overhead was a flat grey ceiling across the frame
        float thf = 1.0 - 0.82 * smoothstep(0.0, 0.85 * L, s);
        // (along the line of sight it fans out less: seen side-on the
        // fan is a band that lengthens as it goes, and if it deepened as
        // fast it came out a grey wedge across the top of the frame)
        float wR = (wA - 0.25 * sp) * 0.30 + 0.6 * th0 * thf / tE;
        // the margins billow near the root and are drawn out into
        // strands further on: never a ruled edge along the wind
        float q = length(vec2(la / wA, lr / wR)) - bil * 0.55 * smoothstep(0.0, 0.5, sp)
                - (fib - 0.5) * 0.50 * smoothstep(0.1 * L, 0.6 * L, sp);
        // The plume's cover below is nothing upwind of its root, past its
        // reach or out past its margins, however the turret lives: the
        // root drifts only downwind when it is cut loose, the reach is
        // longest for a plate that is not young, and a loose plate's
        // margins move by at most |fib \u2212 0.5| \xB7 0.6
        float reachM = L * (0.85 + 0.30 * fib) * (0.85 + 0.30 * h2);
        if (winC * rcz > 0.0 && s > -0.10 - wA && s < reachM * 1.12
            && q - abs(fib - 0.5) * 0.6 < 1.05) {
          // (the turret's own thrust, as the CPU read it: see turretThrust)
          vec2 thr = turretThrust(id);
          float riseC = pow(max(thr.x - 0.42, 0.0) * 4.6, 1.5) * gain;
          // \u2500\u2500 The anvil's life \u2500\u2500
          // and where it stood a while ago (CB_LAG). A turret that reaches
          // the tropopause feeds a plate; one that has only just got there
          // has spread it a little way, one that has stood there a while
          // the whole way. Once the turret sinks the plate is cut loose \u2014
          // an orphan anvil \u2014 and drifts on downwind of where it stood, a
          // thin fibrous sheet, until the last of it is gone with the
          // reading from the past
          float riseP = pow(max(thr.y - 0.42, 0.0) * 4.6, 1.5) * gain;
          float fN = smoothstep(1.7, 2.3, riseC), fP = smoothstep(1.7, 2.3, riseP);
          float cut = fP * (1.0 - fN);
          float young = fN * (1.0 - fP);
          float feedC = sqrt(max(fN, fP)) * winC * rcz;
          if (feedC > 0.01) {
            float reach = L * (0.85 + 0.30 * fib) * (0.85 + 0.30 * h2) * (1.0 - 0.55 * young);
            // (cut loose, its root has drifted off downwind of the turret)
            float cov = feedC * smoothstep(-0.10 - wA, -0.02, s - cut * 0.35 * L) * (1.0 - smoothstep(0.35, 1.05, q + cut * (fib - 0.5) * 0.6))
                      * (1.0 - smoothstep(reach * 0.95, reach * 1.12, s));
            float dn = thf * (1.0 - smoothstep(0.55 * reach, reach * 1.1, s)) * (1.0 - 0.6 * cut);
            // neighbors' plates are one plate: summed, not the thickest of
            // them, or each turret's shows as a pleat of its own
            best += vec4(cov, cov * s, cov * dn, cov * lr / wR);
            orph += cov * cut;
          }
        }
      }
    }
  }
  float sum = max(best.x, 1e-4);
  orphan = orph / sum;
  return vec4(min(best.x, 1.0), best.y / sum, best.z / sum, best.w / sum);
}
#endif

// \u2500\u2500 Forms of the ten cloud genera \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// The ten genera reduce to "4 forms (filament/stratiform/granular/convective)
// \xD7 3 altitudes". Altitude is handled by the cloud plane's projection scale;
// per-genus differences are the parameters passed to the functions below.
// Convective forms (cumulus/cumulonimbus) aren't a plane, so each is built
// inline in the body instead.

// intersection of the view ray with a cloud plane at altitude alt. Higher clouds make same-size lumps look smaller
vec2 planeUV(vec3 rd, float rdY, float alt, float wind) {
  return rd.xz / rdY * alt + vec2(wind, wind * 0.15);
}

// Stratiform (cirrostratus / altostratus / nimbostratus / stratus) \u2014 sheet-like clouds.
//
// Higher clouds look flatter, but a thick low-hanging layer (nimbostratus)
// shows a belly of "boundary-less mass sagging and undulating". turb is
// that strength. Raising breakup opens up gaps. Return value: x=coverage,
// y=thickness (0=thin, 1=thick)
vec2 stratiform(vec2 uv, float breakup, float turb) {
  vec2 q = uv + vec2(u_evo * 0.15, 0.0);
  float d;
  if (turb > 0.001) {
    // domain-warp to let the mass sag, and add detail at another scale for a smoke-like skin
    q += turb * 1.15 * vec2(fbm4(uv * 0.60 + u_evo * 0.35),
                            fbm4(uv * 0.60 + 9.0 - u_evo * 0.28));
    float n = fbm(q);
    d = mix(n, n * 0.66 + fbm(q * 2.7 + 11.0) * 0.34, turb);
  } else {
    d = fbm4(q);
  }
  // fbm's values cluster toward the middle, so the thickness threshold needs
  // to be narrow or the shading goes dull
  return vec2(mix(1.0, smoothstep(0.34, 0.70, d), breakup),
              smoothstep(0.34, 0.68, d));
}

// Granular (cirrocumulus / altocumulus / stratocumulus) \u2014 mackerel sky, sheep clouds, roll clouds.
//
// What defines these three's look is "grains of a consistent size, placed
// irregularly". Arranging grains on a grid is too regular and reads as
// wallpaper; using fbm mixes large and small grains into cumulus instead.
// **Thresholding a single noise octave** is the sweet spot: one consistent
// feature size, with placement that's irregular the way noise is.
//
// Raising pack makes grains bigger and denser, merging into a mottled
// pattern. roll < 1 stretches them into rolls. Return value: x=coverage, y=lit-ness (-1..1)
vec2 granular(vec2 uv, float pack, float roll, float patch, vec2 ldir) {
  // slowly reshuffle the arrangement of grains
  vec2 q = uv * vec2(1.0, roll)
         + 0.7 * vec2(vnoise(uv * 0.22 + u_evo * 0.20),
                      vnoise(uv * 0.22 + 17.0 - u_evo * 0.16));
  float n  = vnoise(q) * 0.72 + vnoise(q * 2.1 + 5.0) * 0.28;
  // fraying at the edge. Thresholding a single noise octave alone gives a
  // smooth curved boundary, reading as spilled milk rather than cloud.
  // Add high frequency at small amplitude to break it up.
  float fineN = fbm4(q * 5.0);
  n += (fineN - 0.47) * 0.17;

  // keep the threshold band narrow. Too wide and the edge bleeds endlessly
  // into a formless smudge
  float e0 = 0.62 - pack * 0.24;
  float cell = smoothstep(e0, e0 + 0.11, n);
  // between the grains there is nothing to shade: every caller draws with
  // g.x as its alpha, so the lit-ness there is never seen
  if (cell <= 0.0) return vec2(0.0);
  // grains gather sparsely into "flocks". Filling uniformly gives the whole
  // sky the same face everywhere. Raising patch merges the flocks into one
  // mottled sheet covering the sky (stratocumulus)
  float f = fbm4(uv * 0.16 + 21.0);
  cell *= smoothstep(mix(0.34, 0.02, patch), mix(0.68, 0.38, patch), f);
  if (cell <= 0.0) return vec2(0.0);

  // lit-ness: the difference against density resampled shifted toward the sun (per-grain shading)
  vec2 ql = q + ldir * 0.35;
  float nl = vnoise(ql) * 0.72 + vnoise(ql * 2.1 + 5.0) * 0.28;
  float lit = (n - nl) * 4.0;
  // fine surface grain, taken from the same field that frays the edge
  lit += (fineN - fbm4((q + ldir * 0.12) * 5.0)) * 2.4;
  return vec2(cell, clamp(lit, -1.0, 1.0));
}

// Filament (cirrus) \u2014 a stroke swept by a brush.
// Stretch strongly along the wind direction (uv's x-axis), and bend it with
// low frequency across the perpendicular direction for a flowing look
float filament(vec2 uv) {
  float bend = fbm4(uv * vec2(0.30, 0.85)) - 0.5;
  vec2 q = uv + vec2(0.0, bend * 1.5);
  float f = smoothstep(0.46, 0.76, fbm(q * vec2(0.30, 3.2)));
  float sparse = smoothstep(0.32, 0.62, fbm4(uv * 0.20 + 13.0));   // sparseness of the strands
  // Mare's tails: a cirrus is not strands all of one weight but tufts \u2014 a
  // dense head where the ice forms, with a fibrous tail streaming away from
  // it downwind as the crystals fall into slower air. The heads are knots
  // of a coarser noise; the tails are the strands, kept only where the
  // same noise, read a little upwind, says a head is there to stream from
  float head = smoothstep(0.56, 0.74, fbm4(uv * 0.42 + 7.0));
  float tail = smoothstep(0.42, 0.64, fbm4((uv + vec2(1.1, 0.0)) * 0.42 + 7.0));
  float strands = f * sparse * (0.30 + 0.70 * max(head, tail * 0.8));
  // the heads themselves: denser knots, with a little of the strand texture through them
  return min(strands + head * sparse * (0.45 + 0.35 * f), 1.0);
}

// A cluster of round lobes (the cauliflower texture of cumulus/cumulonimbus).
//
// As long as noise is cut with a threshold, the boundary is fractal at every
// scale. Dropping octaves smooths it, but never makes it round (it just
// becomes a formless, meandering shape). Cutting a sum of jittered spheres
// on a grid, on the other hand, always gives a boundary made of overlapping
// circular arcs. Real cumulus silhouettes look like "arcs joined together"
// precisely because they *are* a cluster of risen bubbles \u2014 this construction
// mirrors that origin directly.
#ifdef FEAT_CB
float blobs(vec2 p, float radius) {
  vec2 ip = floor(p), fp = fract(p);
  float sum = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(hash12(ip + g), hash12(ip + g + 31.7));
      float r = radius * (0.60 + 0.70 * hash12(ip + g + 7.3));
      vec2 d = g + o - fp;
      float q = max(1.0 - dot(d, d) / (r * r), 0.0);
      sum += q * q;   // squaring smooths the falloff at the edge
    }
  }
  return sum;
}
#endif

// lens-flare ghost (a soft disc)
float ghost(vec2 p, vec2 pos, float r, float aspect) {
  float d = length((p - pos) * vec2(aspect, 1.0));
  return smoothstep(r, r * 0.4, d);
}

// \u2500\u2500 The light the clouds are lit by \u2500\u2500
// Every cloud \u2014 the plane layers through cloudColor, and the cumulonimbus with
// its own lobe shading \u2014 takes its palette from these, so an hour, an overcast
// or a storm reaches them all through one door and two clouds side by side
// can never disagree about the color of the light. (The tower used to carry a
// hand-authored palette of its own, and read as a cream or a blue-grey mass
// against the cotton beside it.) Display-encoded, like the palette they feed.
//   ambient  the sky's own light on every face \u2014 all there is at night
//   glow     the afterglow on top of it: the pink of magic hour
//   sun      direct sunlight on top of both, already scaled by how much there is
//   shade    what reaches a face thick enough that only sky light gets in
//   moon     the faint silver on a night cloud
//   leaden   where severe weather drags everything
//   diffuse  0..1 how much of the sun the overcast has taken away
void cloudLight(float dayF, float nightF, float sunsetF, vec3 cloudSun, float alt,
                out vec3 ambient, out vec3 glow, out vec3 sun, out vec3 shade,
                out vec3 moon, out vec3 leaden, out float diffuse) {
  // under full overcast there's no direct sunlight, only diffuse light
  diffuse = smoothstep(0.55, 0.95, u_cover);
  // Whether the sun still reaches this layer: a cloud at 10 km is lit until
  // the sun is three degrees under, one at 1 km loses it as the sun touches
  // the horizon. That order \u2014 the low deck going grey while the high clouds
  // still burn \u2014 is most of what a sunset's clouds look like
  float sunEl = sin(u_sun.x);
  float sunUp = smoothstep(-0.035 - 0.07 * alt, 0.015 - 0.015 * alt, sunEl);
  ambient = mix(vec3(0.035, 0.045, 0.07), vec3(0.68, 0.73, 0.82), dayF);
  // the afterglow: a pink on the clouds once their direct sun has gone
  glow = vec3(0.30, 0.17, 0.13) * sunsetF * (1.0 - dayF) * (1.0 - sunUp * 0.7);
  // direct sun on the lit face, strongest and reddest at the horizon
  sun = cloudSun * max(dayF, sunsetF * 0.9) * sunUp;
  // not a flat grey: a blue-tinted shadow color (ambient light from the sky)
  shade = (ambient + glow) * vec3(0.50, 0.54, 0.64) + vec3(0.02, 0.03, 0.05);
  moon = vec3(0.10, 0.12, 0.18) * nightF;
  leaden = vec3(0.09, 0.10, 0.12) + vec3(0.10) * dayF;
}

// The moon's light carried on forward through a thin cloud in front of it,
// and the corona that light is colored with: set per pixel in main, before
// the cloud layers, from how far this ray is from the moon
#ifdef FEAT_MOONLIT
float g_moonFwd = 0.0;
vec3 g_corona = vec3(1.0);
#endif
// and the sun's: how much of its light a thin water cloud this far from it
// sends on forward, the corona round it, and how far out from its limb this
// ray is, for the iridescence the cloud's own edges pick out
#ifdef FEAT_IRIDESCENCE
float g_sunFwd = 0.0;
vec3 g_sunCorona = vec3(1.0);
float g_sunLimb = 1.0;
#endif

// The corona: light diffracted round the moon by a water cloud's droplets \u2014
// a bluish-white aureole, a red-brown ring a couple of degrees out, then
// fainter blue-green and red again, fading as it goes. Its size goes with
// the droplets; this is a middling one. Ice clouds give a halo instead
vec3 corona(float a) {
  float d = a * 57.2958;
  vec3 c = vec3(0.86, 0.92, 1.0);
  c = mix(c, vec3(1.10, 0.55, 0.32), smoothstep(1.3, 2.2, d) * (1.0 - smoothstep(2.6, 3.4, d)));
  c = mix(c, vec3(0.50, 0.95, 0.95), smoothstep(2.8, 3.5, d) * (1.0 - smoothstep(3.8, 4.4, d)));
  c = mix(c, vec3(1.05, 0.50, 0.60), smoothstep(4.0, 4.6, d) * (1.0 - smoothstep(5.0, 5.8, d)));
  return mix(vec3(1.0), c, exp(-d / 6.0));
}

// A small cloud drawn over the cumulonimbus (mask, tower and back are the
// tower's cbMask, cbCol and cbBack). Lit as if the tower were not there, a
// fragment over a tower dark against the sun came out a light chip pasted on
// it. But a cloud in front of a backlit tower is in the tower's shadow, and
// lit from behind like it: nearly the tower's own tone, a glow only at its
// thinnest margin. In front of a lit tower it is lit by the same sun, under
// less air, and differs from the mass behind it far less than from the sky
//   thin  how thin the cloud is here, 1 at its margin
//   glow  the lining's color
#ifdef FEAT_CB
vec3 overTower(vec3 c, float thin, float mask, vec3 tower, float back, vec3 glow) {
  vec3 b = mix(tower * 0.92, glow, thin * thin * 0.40);
  c = mix(c, b, mask * back);
  return mix(c, tower, mask * (1.0 - back) * 0.35);
}
#endif

// cloud color (lighting shared by every plane layer)
vec3 cloudColor(float den, float lit, float thick, float dayF, float nightF, float sunsetF,
                float flash, float gloom, float darkMul, vec3 cloudSun, float alt) {
  vec3 ambient, glow, sun, shade, moon, leaden;
  float diffuse;
  cloudLight(dayF, nightF, sunsetF, cloudSun, alt, ambient, glow, sun, shade, moon, leaden, diffuse);
  // under overcast, weaken the lit/shadow contrast, the base shadow, and the
  // silver lining together
  float litE = lit * (1.0 - diffuse * 0.75);
  // the lit face
  vec3 c = ambient + glow + sun * (0.42 + 0.45 * litE);
  // shadow from thickness: sink smoothly into the shade as thickness increases
  float sh = thick * (0.62 - diffuse * 0.28) * darkMul;
  sh *= 0.75 + 0.25 * (1.0 - litE);   // the sun-facing side has a shallower shadow
  c = mix(c, shade, clamp(sh, 0.0, 0.85));
  // night: a faint glow from moonlight
  c += moon * (0.3 + 0.4 * litE);
  // and near the moon, a thin cloud lit through from behind: the moon turns
  // the cloud in front of it into a lamp, bright at its thin edges while
  // the thick cores stand dark against it \u2014 colored by the corona on a
  // water cloud, plain on an ice one (alt 1)
  // (each compiled only into the variants with a light there to carry \u2014
  // see FEATURE.MOONLIT and FEATURE.IRIDESCENCE)
#if defined(FEAT_MOONLIT) || defined(FEAT_IRIDESCENCE)
  float through = (1.0 - clamp(thick, 0.0, 1.0) * 0.85) * (1.0 - den * 0.45);
#endif
#ifdef FEAT_MOONLIT
  c += vec3(0.80, 0.84, 0.92) * mix(g_corona, vec3(1.0), alt) * g_moonFwd * through;
#endif
  // and near the sun, iridescence: the same diffraction by the droplets,
  // but where the moon's corona is rings round the moon, the sun's shows as
  // pastel pinks and greens laid along a thin cloud's edges. The droplets at
  // a cloud's margin are small and freshly made, and smaller droplets throw
  // the colors wider, so the band a patch shows follows how thin it is more
  // than how far it is from the sun. Strongest on a mid-level water cloud,
  // weaker on a low one, none on ice (alt 1), which gives a halo instead.
  // Kept modest: what makes it vivid in a photograph is the sun hidden
  // behind a roof, and here the sun is in the frame
#ifdef FEAT_IRIDESCENCE
  float iriW = clamp(min(0.6 + 0.8 * alt, 2.0 - 2.0 * alt), 0.0, 1.0);
  float sunFwd = g_sunFwd * iriW * (1.0 - gloom);
  if (sunFwd > 0.0) {
    // a fringe: neither the clear sky nor the cloud's thick core
    float fringe = smoothstep(0.04, 0.30, den) * (1.0 - smoothstep(0.55, 0.95, den))
                 * (1.0 - clamp(thick, 0.0, 1.0) * 0.6);
    // the lookup angle swings with the density, back and forth through the
    // corona's colored rings rather than wrapping, so no band ends in a seam
    float phase = g_sunLimb * 1.5 + (1.0 - den) * 3.4 + thick * 0.8;
    float dEff = 1.5 + 4.2 * abs(fract(phase) * 2.0 - 1.0);
    vec3 iri = corona(dEff / 57.2958);
    // right by the sun, the corona's own rings round it
    iri = mix(g_sunCorona, iri, smoothstep(0.015, 0.05, g_sunLimb));
    // and the cloud there is lit through from behind, as bright as the
    // display goes: so the color goes in as a mix toward a bright pastel,
    // not as light added on top, which only clips back to white. The
    // corona's colors are already faded at these angles; the departure from
    // white is drawn out again, normalized to keep the brightness
    vec3 tint = iri / max(dot(iri, vec3(0.30, 0.59, 0.11)), 0.1);
    tint = max(mix(vec3(1.0), tint, 2.2), 0.0);
    float amt = clamp(sunFwd * fringe * through * 1.7, 0.0, 0.85);
    c = mix(c, cloudSun * 0.94 * tint, amt);
  }
#endif
  // silver lining (the edge glows on the sun side \u2014 only with direct light)
  float rim = den * (1.0 - den) * 4.0 * max(litE, 0.0) * (1.0 - diffuse);
  c += cloudSun * rim * 0.35 * max(dayF, sunsetF * 0.5);
  // severe-weather clouds: a torn, leaden grey
  c = mix(c, leaden, gloom * 0.85);
  // lightning flickers inside the cloud
  c += flash * vec3(0.75, 0.8, 1.0) * (0.35 + den * 0.65);
  return c;
}

// \u2500\u2500 The sky's own color, by direction \u2500\u2500
// The gradient, the magic hour and the anti-twilight: what the sky is before
// the polarizer, the overcast and the gloom act on it, and before any light is
// added to it. A function of direction rather than a stretch of main() so the
// sea can ask what it mirrors. Display-encoded (see the note at disp in
// main); wide collects the gamut claim the way main's does.
vec3 skyBase(vec3 rd, float el, float h, vec3 sunDir, float sunEl,
             float dayF, float sunsetF, inout float wide) {
  // \u2500\u2500 Base sky gradient \u2500\u2500
  // These four and the two ramps below stay display-encoded: the gradient was
  // hand-tuned as a straight line in that space, and a straight line in linear
  // light is a different curve (measurably ~+28/255 brighter at the midpoint).
  // Interpolate where it was authored, then decode once into the scene.
  vec3 dayZen  = vec3(0.10, 0.34, 0.74);      // deep summer blue
  vec3 dayHor  = vec3(0.66, 0.83, 0.96);
  vec3 nightZen = vec3(0.010, 0.018, 0.048);
  vec3 nightHor = vec3(0.045, 0.065, 0.115);
  vec3 zen = mix(nightZen, dayZen, dayF);
  vec3 hor = mix(nightHor, dayHor, dayF);
  // the approach to zenith color should look like scattering: saturate it
  // exponentially against elevation
  // (the top of the screen isn't the zenith, so holding this in screen
  // coordinates would make the blue shallower depending on framing)
  vec3 disp = mix(hor, zen, 1.0 - exp(-max(el, 0.0) * 2.6));

  // \u2500\u2500 Magic hour \u2500\u2500
  // Toward the sun the horizon goes red, then orange, then yellow up into
  // the blue: the sunlight's own color after its long path through the air,
  // scattered back by the air near the horizon. The band climbs as the sun
  // sinks and shrinks to a rim once the sun is well under; away from the
  // sun the horizon stays cool \u2014 the Earth's shadow and the Belt of Venus
  // are what is there, below. The zenith keeps its blue all along: a sunset
  // sky is blue overhead, not mauve. (This used to be one orange laid over
  // the whole lower sky, the far side included, with a mauve over the rest;
  // every sunset came out the same salmon.)
  float towardSun = clamp(dot(normalize(vec3(rd.x, 0.0, rd.z) + 1e-5),
                              normalize(vec3(sunDir.x, 0.0, sunDir.z) + 1e-5)), -1.0, 1.0);
  // not zero on the far side: at magic hour the whole lower air is lit by
  // the reddened sun and takes a cast of its own, fainter and pinker than
  // the band \u2014 the glow the hour is named for, which a far side left cold
  // lost
  float side = 0.22 * u_sunset.y + (1.0 - 0.22 * u_sunset.y) * smoothstep(-0.55, 0.85, towardSun);
  // how much of the sun's warmth there is: golden hour in from 14\xB0 up, full
  // from the horizon to 3\xB0 under, gone by 9\xB0 under
  float warmth = smoothstep(0.25, 0.03, sunEl) * smoothstep(-0.16, -0.05, sunEl);
  if (warmth > 0.001) {
    // the band's height in h: climbs as the sun goes down, then collapses
    float bandTop = 0.22 + 0.30 * smoothstep(0.10, -0.03, sunEl) - 0.34 * smoothstep(-0.05, -0.15, sunEl);
    // a harder sunset climbs higher and goes redder
    bandTop *= 0.75 + 0.25 * u_sunset.x;
    float y = h / max(bandTop, 0.05);
    vec3 red = vec3(1.0, 0.36, 0.14), orange = vec3(1.0, 0.58, 0.22), yellow = vec3(1.0, 0.86, 0.50);
    vec3 warmCol = y < 0.35 ? mix(red, orange, y / 0.35) : mix(orange, yellow, min((y - 0.35) / 0.65, 1.0));
    // redder the lower the sun: the light has farther to come
    warmCol = mix(warmCol, warmCol * vec3(1.0, 0.72, 0.55), smoothstep(0.03, -0.08, sunEl) * 0.6);
    warmCol = mix(warmCol, warmCol * vec3(1.0, 0.70, 0.55), clamp(u_sunset.x - 1.0, 0.0, 1.0) * 0.6);
    // the far side's share is pinker: it is lit light, not the sun's own
    warmCol = mix(mix(warmCol, vec3(0.95, 0.62, 0.62), 0.5), warmCol, smoothstep(-0.3, 0.6, towardSun));
    float wedge = (1.0 - smoothstep(0.45, 1.0, y)) * side * warmth;
    disp = mix(disp, warmCol, min(wedge * 0.85 * u_sunset.x, 1.0));
    // a lavender wash where the band meets the blue: faint all round, more
    // on the sun's side
    vec3 mauve = vec3(0.60, 0.42, 0.62);
    float band = smoothstep(0.6, 1.05, y) * (1.0 - smoothstep(1.3, 2.0, y)) * warmth;
    disp = mix(disp, mauve, min(band * (0.12 * u_sunset.y + 0.18 * side), 1.0));
    wide = max(wide, wedge * 0.5);
  }

  // \u2500\u2500 Anti-twilight: the Earth's shadow and the Belt of Venus \u2500\u2500
  // Opposite a sun just under the horizon, the Earth's own shadow climbs the
  // sky as a band of blue-grey, and above it the air still in sunlight sends
  // back reddened light as a band of rose \u2014 the anti-twilight arch. The
  // shadow's edge stands about as high as the sun is deep, arching down away
  // from the antisolar point; the belt rides a few degrees above it. In by
  // sundown, gone by civil dusk, and the same again before sunrise. Without
  // it the far horizon at magic hour was only the amber's leftover, a beige
  // where the real sky goes cool.
  float twi = smoothstep(0.04, -0.01, sunEl) * smoothstep(-0.14, -0.06, sunEl);
  float away = smoothstep(0.45, -0.55, towardSun);
  float amt = twi * away;
  if (amt > 0.001) {
    float edge = max(-sunEl, 0.0) * max(-towardSun, 0.0);
    // the shadow: cooler and darker than the lit air above it, and it
    // takes back the amber the far horizon was given above
    float shadow = smoothstep(edge + 0.035, edge - 0.025, rd.y);
    disp *= mix(vec3(1.0), vec3(0.72, 0.78, 0.94), shadow * amt * 0.8);
    // the belt: a soft band of rose, brightest right above the shadow's
    // edge and fading away upward into the blue \u2014 a sharp foot, a long head
    float c = edge + 0.04;
    float d = (rd.y - c) / (rd.y > c ? 0.085 : 0.035);
    float belt = exp(-d * d) * smoothstep(-0.02, 0.01, rd.y);
    // dimmer the deeper the sun: the sky it sits in is dimming too
    vec3 rose = mix(vec3(0.60, 0.34, 0.42), vec3(0.98, 0.62, 0.64), smoothstep(-0.08, 0.0, sunEl));
    disp = mix(disp, rose, belt * amt * 0.36);
    wide = max(wide, belt * amt * 0.36 * 0.5);
  }
  return disp;
}

// what the weather does to the sky's color, wherever it is looked at
vec3 skyWeather(vec3 disp, float dayF, float gloom) {
  // overcast: the sky's blue drains toward a bright grey (including the sky peeking through gaps)
  float overcastSky = smoothstep(0.5, 0.95, u_cover);
  disp = mix(disp, mix(vec3(0.050, 0.055, 0.070), vec3(0.70, 0.73, 0.76), dayF), overcastSky * 0.85);
  // severe weather: darken the whole sky to a leaden grey
  disp = mix(disp, vec3(0.16, 0.18, 0.21) * (0.25 + 0.75 * dayF), gloom * 0.75);
  return disp;
}

#ifdef FEAT_SEA
// \u2500\u2500 Waves \u2500\u2500
// The slope of one travelling sine across the water, height a\xB7sin(k\xB7p \u2212 \u03C9t):
// its gradient, a\xB7k\xB7cos(k\xB7p \u2212 \u03C9t). Slopes are all the mirror needs \u2014 they
// tilt it \u2014 so for the swell the height itself is never summed
vec2 waveSlope(vec2 p, vec2 k, float a, float w, float t) {
  return a * k * cos(dot(k, p) - w * t);
}
// The same wave with its height as well, in z: the chop's, which is where
// the whitecaps break \u2014 on the crests, so they need to know where those are
vec3 waveSlopeHeight(vec2 p, vec2 k, float a, float w, float t) {
  float ph = dot(k, p) - w * t;
  return vec3(a * k * cos(ph), a * sin(ph));
}
#endif

// One layer of the cloud stack: a display-space wash, disp = mix(disp, col, a).
//
// The split variant (CLOUD_SPLIT, compiled only when cloudScale is asked for)
// uses that a run of such washes composes to a single affine map
// disp -> disp * cT + cC \u2014 cT what the stack lets through, cC what it adds \u2014
// and accumulates the map instead, which is what lets the stack be drawn on
// its own at a lower resolution and laid over the sky afterwards
// (u_cloudMode). Mathematically identical to washing disp layer by layer.
//
// Without it, every macro below reduces to the one-pass shader as it always
// was. That matters for more than tidiness: carrying the split's unused
// branches and sampler cost the one pass 6-16% even with no clouds at all
// (an M2 Max, paired GPU timer queries), a whole-program effect of their mere
// presence.
#ifdef CLOUD_SPLIT
#define OVER(col, a) { float a_ = (a); cC = mix(cC, (col), a_); cT *= 1.0 - a_; }
#define CLOUD_STACK (u_cloudMode < 1.5)
#define SKY_LIGHT (u_cloudMode < 0.5 || u_cloudMode > 1.5)
#else
#define OVER(col, a) disp = mix(disp, (col), (a))
#define CLOUD_STACK true
#define SKY_LIGHT true
#endif

void main() {
  // Normally the viewport is the whole canvas and these reduce to the obvious.
  // The light probe draws the same frame into a far smaller viewport \u2014 and
  // cube faces beside it \u2014 so the picture's shape has to come from u_aspect,
  // not from how many pixels happen to be drawing it.
  vec2 p = (gl_FragCoord.xy - u_frame.xy) / u_frame.zw;   // 0..1 (y is up)
  float aspect = u_aspect;

  // \u2500\u2500 Lens droplets (rain only. Refract the UV before deciding the view direction, distorting the image itself) \u2500\u2500
  // u_lensDrops at 0 skips the whole block \u2014 and the rim darkening at the end, which keys off dropMask
  float dropAmt = smoothstep(0.05, 0.5, u_rain) * u_lensDrops;
  float dropMask = 0.0;
  if (dropAmt > 0.001) {
    vec2 dg = p * vec2(aspect, 1.0) * 4.0;
    vec2 cell = floor(dg);
    float rc = hash12(cell);
    // attaches occasionally over a long cycle, lingers a while, then dries
    float cyc = u_time * 0.05 + rc * 9.0;
    float phase = fract(cyc);
    float active = step(0.6, hash12(cell + floor(cyc) * 0.618));
    float life = smoothstep(0.0, 0.04, phase) * smoothstep(0.55, 0.30, phase);
    vec2 dpos = vec2(0.25) + 0.5 * vec2(hash12(cell + 11.1), hash12(cell + 23.3));
    vec2 dv = fract(dg) - dpos;
    float r = 0.05 + hash12(cell + 31.7) * 0.08;
    float inside = smoothstep(r, r * 0.6, length(dv));
    float str = inside * life * active * dropAmt;
    p += dv * str * 2.2;
    dropMask = max(dropMask, str);
  }

  // \u2500\u2500 View ray \u2500\u2500
  vec3 rd = viewRay(p * 2.0 - 1.0, u_cam.x, u_cam.y, u_cam.z, aspect);
  float el = asin(clamp(rd.y, -1.0, 1.0));
  float h = clamp(el / (PI * 0.5), 0.0, 1.0);   // horizon=0, zenith=1

  // \u2500\u2500 Sun and day/night \u2500\u2500
  vec3 sunDir = dirFromAngles(u_sun.x, u_sun.y);
  float sunEl = sunDir.y;                      // sine of elevation, -1..1
  // Daylight falls away slowly through twilight: at sunset it is still
  // three fifths of noon, a fifth at civil dusk, gone by nautical. It used
  // to be a quarter by sunset \u2014 a sunset sky that was already dim, under a
  // wash of one warm color. Photographs expose for the sky, and that is
  // the look this draws
  float dayF = smoothstep(-0.17, 0.14, sunEl);
  float nightF = 1.0 - dayF;
  // the deep night the stars and the rest of the night sky's light keep to:
  // in after civil dusk, full by nautical \u2014 not the twilight nightF still
  // carries, which would put stars on a sunset
  float starF = 1.0 - smoothstep(-0.22, -0.08, sunEl);
  float sunsetF = smoothstep(0.35, 0.02, abs(sunEl));

  // \u2500\u2500 Severity of the weather (rebuilt from rain/snow/wind instead of the old "storm") \u2500\u2500
  float gloom = clamp(max(u_rain, max(u_snow * 0.5, u_wind * 0.7)), 0.0, 1.0);
  float churn = clamp(u_wind * 0.9 + u_rain * 0.3, 0.0, 1.0);

  // How much this pixel should reach past sRGB, accumulated by the sections
  // below (magic hour, stars, moon, sun, lightning) and spent at the very end.
  // Only saturated light sources claim it \u2014 the clouds deliberately don't, since
  // their sunlit edges are small and high-frequency and widening them would
  // harden the outline.
  //
  // Invariant: a claim is the *fraction of the pixel that source contributes* \u2014
  // the same weight it composites with, bleed factors included. Claim more and
  // you widen whatever lies underneath: exp(-sunAng * 4.0) alone still reads 0.1
  // a third of a radian out, which drags a whole quadrant of plain blue sky with
  // the sun.
  float wide = 0.0;

  // \u2500\u2500 The sky's color in this direction: gradient, magic hour, anti-twilight \u2500\u2500
  // Held display-encoded as disp rather than decoded straight away: every
  // overlay() below would only re-encode it. See the note on disp at the clouds.
  vec3 disp = skyBase(rd, el, h, sunDir, sunEl, dayF, sunsetF, wide);
#ifdef FEAT_CB
  // kept as it is here, before the polarizer: the air in front of a tower
  // is this sky's own color (see the cumulonimbus's aerial perspective)
  vec3 airSky = disp;
#endif

  // \u2500\u2500 Circular polarizer \u2500\u2500
  // Applied here on purpose: this is the scattered skylight, and it is the only
  // thing a CPL acts on. Everything composited after this point \u2014 clouds (Mie
  // scattering, essentially unpolarized), the sun, the moon, the stars \u2014 is
  // direct or depolarized light and passes through untouched. That ordering is
  // what makes the clouds "pop": the sky behind them drops and they do not.
  float dop = skyPolarization(rd, sunDir);
  // Where the ring is turned to, and how much of this pixel's sky it took.
  // Both are read again below: the aim by the sea, the cut by the haze
  float polAim = 0.0;
  float polCut = 0.0;
#ifdef FEAT_POLARIZER
  if (u_pol.x > 0.001) {
    vec3 sky = L(disp);
    // The e-vector is perpendicular to the scattering plane, so it already lies
    // across the view ray; measure its angle in the frame's own basis, or the
    // filter would not track the camera as it swings.
    vec3 fwd = dirFromAngles(u_cam.y, u_cam.x);
    vec3 camRight = normalize(cross(vec3(0.0, 1.0, 0.0), fwd) + vec3(1e-6, 0.0, 0.0));
    vec3 camUp = cross(fwd, camRight);
    // The ring is aimed, the way a photographer aims it: turned so that the
    // middle of the frame is darkened most, and the given angle is a turn
    // from there. Held fixed in the frame instead, the filter sat at 45\xB0 to
    // the sky's polarization in whole ranges of framings \u2014 the sun mid-high
    // and off to one side is the common case \u2014 where a filter at 45\xB0 passes
    // exactly as much as none, and the "strong" preset did nothing visible.
    // (The e-vector's angle turns across the frame, so the aim is only right
    // at the middle; that falloff toward the edges is the real filter's.)
    // Looking straight at the sun or away from it the aim is undefined, and
    // so is the effect, so any aim will do: horizontal
    vec3 e0 = cross(fwd, sunDir);
    float e0len = length(e0);
    e0 = e0len > 1e-3 ? e0 / e0len : camRight;
    polAim = atan(dot(e0, camUp), dot(e0, camRight));
    vec3 e = normalize(cross(rd, sunDir) + vec3(1e-6));
    float ePhi = atan(dot(e, camUp), dot(e, camRight));

    float tr = polarizerTransmission(dop, ePhi, polAim);
    // the rejection alone, without the flat stop loss \u2014 negative where the
    // ring is turned to pass the polarized light and the band brightens
    polCut = 1.0 - tr / mix(1.0, 0.40, u_pol.w);
    sky *= tr;

    // the veil a polarizer removes is multiply-scattered white light, so what
    // survives reads more saturated than the darkening alone would explain.
    // dot() against the Rec.709 coefficients is a real luminance here \u2014 in the
    // old gamma-encoded pipeline it never was. Keyed to what was actually
    // rejected: a ring turned to brighten the band takes no veil away
    if (u_pol.z > 0.001) {
      float lum = dot(sky, vec3(0.2126, 0.7152, 0.0722));
      sky = max(mix(vec3(lum), sky, 1.0 + u_pol.z * max(polCut, 0.0)), 0.0);
    }
    disp = encodeSrgb(sky);
  }
#endif

  // overcast and severe weather
  disp = skyWeather(disp, dayF, gloom);

  // into linear light for the part of the sky that is added light
  vec3 sky = L(disp);

  // the cloud-stack pass (mode 1) writes only the clouds, so the night sky's
  // light below \u2014 the dearest of it, the star grids \u2014 is not drawn there
  bool skyLight = SKY_LIGHT;

  // \u2500\u2500 Stars (night, low cloud. Determined by direction, so they stay pinned to the celestial sphere as the view swings) \u2500\u2500
  // Every term in here is scaled by this product \u2014 the star field, all three
  // grids and the Milky Way \u2014 so where it is zero (all day, and under heavy
  // cloud or gloom at night) the block adds exactly nothing and is skipped.
  // It is uniform across the frame, so the branch never diverges.
  if (starF * clamp(1.0 - u_cover * 1.4, 0.0, 1.0) * (1.0 - gloom) > 0.0 && skyLight) {
    // fold the view direction onto a cubemap-like 2D grid.
    // pulling from a 3D grid leaves most lattice points off the sphere the
    // view ray actually passes through, so almost no stars show up
    vec2 sg = starGrid(rd) * 62.0;
    vec2 cell = floor(sg);
    float sr = hash12(cell);
    // Nearly the full cell. At the old +/-0.25 every star sat in the middle of its
    // own cell, which reads as a lattice the moment enough of them are visible \u2014
    // and the magnitude model made a lot more of them visible.
    vec2 off = (vec2(hash12(cell + 7.7), hash12(cell + 3.3)) - 0.5) * 0.84;
    float d = length(fract(sg) - 0.5 - off);

    float darkness = (9.0 - u_sky.x) / 8.0;
    // The Milky Way is a star cloud, not luminous fog: it reaches deeper into the
    // field where the band runs, and most of its brightness arrives as resolved
    // stars. The diffuse term below is only the unresolved remainder.
    // how far below the suburban default this site sits: gates every
    // dark-sky-only term, so Bortle 6 and up stay exactly the sky this has
    // always drawn
    float deep = clamp((6.0 - u_sky.x) / 5.0, 0.0, 1.0);
    float mwBulge; float mwRift; float mwGlow; float mwBase;
#ifdef FEAT_DARKSKY
    float mwHere = milkyWayBand(rd, u_sky.y, mwBulge, mwRift, mwGlow, mwBase);
#else
    float mwHere = 0.0;
    mwBulge = 0.0; mwRift = 0.0; mwGlow = 0.0; mwBase = 0.0;
#endif

    // Intrinsic brightness, power-law distributed: a handful of bright stars, a
    // great many faint ones. This is what carries the variation \u2014 deriving
    // brightness from distance above the visibility limit instead (as this did at
    // first) puts most of the visible population against the clamp at maximum
    // size, and every star ends up the same.
    float mag0 = pow(sr, 8.0);

    // The limit decides *whether* a star shows, not how bright it is. It falls as
    // the sky darkens, so dragging light pollution reveals fainter stars rather
    // than switching populations on and off.
    float cutoff = mix(0.002, 0.93, clamp((u_sky.x - 1.0) / 8.0, 0.0, 1.0));
    // The band is a star cloud first and a glow second, so it has to reach much
    // deeper into the field than it did \u2014 at 0.55 the density inside the band was
    // barely distinguishable from the sky beside it and the whole thing read as a
    // smooth smear. Squared so the dense core pulls far harder than the wings.
    // (floored: the bulge can push the band past 1, and a negative cutoff would
    // invert the renormalisation below)
    cutoff *= max(1.0 - 0.93 * mwHere * (0.45 + 0.55 * mwHere), 0.02);
    // dust extinction raises the limiting magnitude: inside the Rift the faint
    // stars vanish outright, not just dim \u2014 that is what makes it read as a
    // thing standing in front of the field
    cutoff = min(cutoff * (1.0 + 2.5 * mwRift), 0.93);
    float shows = smoothstep(cutoff * 0.75, cutoff * 1.9 + 0.004, mag0);

    // renormalised across the surviving population so the full range of sizes is
    // present at every Bortle. cutoff tops out at 0.93, so this cannot blow up
    float m = clamp((mag0 - cutoff) / max(1.0 - cutoff, 0.07), 0.0, 1.0);
    float radius = mix(0.030, 0.20, m * m);
    float amp = mix(0.05, 1.0, m * m * m);          // cubed: the bright ones carry
    float star = smoothstep(radius, 0.0, d) * amp * shows * (0.55 + 0.45 * darkness);
    // The band's extra depth cannot come through the cutoff at a dark site \u2014
    // it is already saturated by Bortle 1 \u2014 so it arrives as amplitude, and
    // the Rift takes it back away: the dust is in front of these stars.
    star *= (1.0 + 1.0 * mwBase) * (1.0 - 0.70 * mwRift);
    float twinkle = 0.8 + 0.2 * sin(u_time * (1.0 + fract(sr * 13.0) * 2.0) + sr * 40.0);
    vec3 tint = L(mix(vec3(0.8, 0.88, 1.0), vec3(1.0, 0.93, 0.85), fract(sr * 71.0)));
    // at a dark site the top of the population splits into its two real color
    // classes \u2014 hot blue-white and cool amber \u2014 instead of a uniform grey
    tint = mix(tint, L(mix(vec3(0.60, 0.76, 1.00), vec3(1.00, 0.78, 0.55),
                           step(0.5, fract(sr * 71.0)))),
               deep * smoothstep(0.70, 0.92, m) * 0.85);
    // atmospheric extinction: near the skyline stars redden and dim rather
    // than switching off (the suburban horizon keeps its old hard fade)
    tint *= mix(vec3(1.0), vec3(0.95, 0.72, 0.52), deep * smoothstep(0.30, 0.02, h));
    // stars reach the skyline at a dark site; under light pollution the
    // horizon dome still swallows the lowest ones (0.16 is the old suburban
    // behavior, kept exactly)
    // the lower edge dips below the horizon at a dark site, so the grain meets
    // the skyline instead of stopping on a visible line just above it
    float horizonGate = smoothstep(mix(0.02, -0.02, deep), mix(0.16, 0.05, deep), h);
    float vis = star * twinkle * starF
              * horizonGate
              * clamp(1.0 - u_cover * 1.4, 0.0, 1.0) * (1.0 - gloom);
    sky += tint * vis * STAR_LUM;
    // a star's blue or amber is genuinely outside sRGB \u2014 the strongest claim here
    wide = max(wide, vis * 0.9);

    // the Milky Way shares the star field's occlusion exactly \u2014 same night, same
    // cloud, same gloom \u2014 so it is gated here rather than duplicating all of it
    float mwGate = starF * horizonGate
                 * clamp(1.0 - u_cover * 1.4, 0.0, 1.0) * (1.0 - gloom);
    float mw = mwHere * mwGate;

    // \u2500\u2500 Second, finer star layer: the unresolved-into-resolved crowd \u2500\u2500
    // One star per cell tops out the density the main grid can reach, and a real
    // dark-sky band is grain, not a ceiling. A denser grid of small faint stars
    // fills in underneath: thickest inside the band, spreading over the whole
    // sky as the site darkens. Scaled by deep so it is *exactly* zero at Bortle
    // 6 and up \u2014 the default sky never pays for it or shows it \u2014 and fades in
    // continuously below.
#ifdef FEAT_DARKSKY
    if (deep > 0.0) {
      vec2 sg2 = starGrid(rd) * 158.0;
      vec2 cell2 = floor(sg2);
      float sr2 = hash12(cell2 + 19.19);
      vec2 off2 = (vec2(hash12(cell2 + 5.1), hash12(cell2 + 9.7)) - 0.5) * 0.88;
      float d2 = length(fract(sg2) - 0.5 - off2);
      float mag2 = pow(sr2, 6.0);
      // how far down the population this site+direction reaches: the band shows
      // most of it, the dark sky beside it a decent fraction
      // in-band reach tops out near half the cells: any denser and the grains
      // sit inside each other's contrast radius and fuse into a plateau
      // the band term starts a little above the profile's skirt, so the deep
      // wings do not smear the band's density gain over the whole sky
      float reach = deep * (0.16 + 0.46 * clamp(mwBase * 1.2 - 0.10, 0.0, 1.0))
                  * (1.0 - 0.60 * mwRift);
      float c2 = pow(1.0 - 0.88 * reach, 6.0);
      float shows2 = smoothstep(c2 * 0.6, c2 * 1.9 + 0.003, mag2);
      float m2 = clamp((mag2 - c2) / max(1.0 - c2, 0.2), 0.0, 1.0);
      // small and dim on purpose: these read as texture between the resolved
      // stars, not as a second population of discs
      // radius floor: cells are ~6px, so anything under ~0.12 cell radius
      // starts skipping pixel centers and the population thins out unseen
      float radius2 = mix(0.15, 0.26, m2);
      // brightened inside the band \u2014 the cutoff has no depth left to give at a
      // dark site, so the density contrast is carried by amplitude \u2014 and cut
      // by the Rift, which stands in front of these stars too. The boost is
      // moderate on purpose: pushed harder, the grains merge into a texture
      // and stop reading as stars at all
      float amp2 = mix(0.06, 0.42, m2 * m2) * deep
                 * (1.0 + 1.6 * clamp(mwBase - 0.08, 0.0, 1.2)) * (1.0 - 0.75 * mwRift);
      float star2 = smoothstep(radius2, 0.0, d2) * amp2 * shows2;
      vec3 tint2 = L(mix(vec3(0.84, 0.89, 1.0), vec3(1.0, 0.93, 0.87), fract(sr2 * 53.0)));
      sky += tint2 * star2 * mwGate * STAR_LUM;
      wide = max(wide, star2 * mwGate * 0.5);

      // Third grid, band-only: the near-continuous sand of the star clouds.
      // One dim, half-resolved star per finer cell; the sky outside the band
      // never evaluates it, and the default sky never reaches here at all
      float band3 = deep * clamp(mwBase * 1.1 - 0.12, 0.0, 1.0) * (1.0 - 0.85 * mwRift);
      if (band3 > 0.0) {
        vec2 sg3 = starGrid(rd) * 258.0;
        vec2 cell3 = floor(sg3);
        float sr3 = hash12(cell3 + 41.7);
        vec2 off3 = (vec2(hash12(cell3 + 13.1), hash12(cell3 + 27.9)) - 0.5) * 0.86;
        float d3 = length(fract(sg3) - 0.5 - off3);
        float mag3 = pow(sr3, 4.0);
        // visible fraction is 0.30*band3 exactly (the pow4 cancels against the
        // mag3 distribution): a third of the cells lit keeps the grains
        // separable \u2014 at 90% they fuse into a plateau and stop reading as stars
        float c3 = pow(1.0 - 0.40 * min(band3, 1.0), 4.0);
        float shows3 = smoothstep(c3 * 0.6, c3 * 1.9 + 0.003, mag3);
        float m3 = clamp((mag3 - c3) / max(1.0 - c3, 0.25), 0.0, 1.0);
        // radius floor matters: these cells are ~3.6px, so a disc under ~0.2
        // cell radius falls between pixel centers and never draws at all
        // deliberately just under the eye's "one star" threshold: this layer is
        // the sand between the countable stars, not a third countable class
        float star3 = smoothstep(mix(0.22, 0.36, m3), 0.0, d3)
                    * mix(0.10, 0.25, m3 * m3) * band3 * shows3
                    * (1.0 - 0.78 * mwRift);
        vec3 tint3 = L(mix(vec3(0.86, 0.90, 1.0), vec3(1.0, 0.94, 0.88), fract(sr3 * 37.0)));
        sky += tint3 * star3 * mwGate * STAR_LUM;
        wide = max(wide, star3 * mwGate * 0.4);
      }
    }
#endif

#ifdef FEAT_DARKSKY
    if (mw > 0.0001) {
      // Colour follows the band's own structure: lavender through the body of
      // the band, pink-magenta where the bulge swells (reddened by its own
      // dust), blue out along the thin reaches \u2014 the hue map of a long-exposure
      // photograph, carried well below photographic saturation. Light pollution
      // then does what it does to everything \u2014 washes the colour out and pulls
      // it toward the sky glow \u2014 so the same slider that thins the stars also
      // drains the band.
      vec3 core = vec3(1.00, 0.62, 0.80);        // the bulge, reddened by its own dust
      vec3 body = vec3(0.63, 0.54, 0.94);        // the band's lavender midriff
      vec3 edge = vec3(0.38, 0.52, 1.00);        // hot young stars out along the arms
      float dens = clamp(mwHere / max(u_sky.y, 1e-4), 0.0, 1.0);
      vec3 mwCol = mix(edge, body, smoothstep(0.03, 0.40, dens));
      mwCol = mix(mwCol, core, mwBulge * smoothstep(0.20, 0.75, dens));
      float wash = clamp((u_sky.x - 2.0) / 5.0, 0.0, 1.0);
      mwCol = mix(mwCol, vec3(0.74, 0.75, 0.70), wash * 0.8);
      // Only the unresolved remainder \u2014 the stars carry the rest. Kept low, and
      // weighted toward the dense parts, so it does not flatten into fog.
      sky += L(mwCol) * mw * (0.30 + 0.70 * dens) * 0.050;
      // the bulge carried as luminance too, so the swelling reads as light and
      // not only as width (rift-cut inside milkyWayBand)
      sky += L(mix(core, vec3(0.74, 0.75, 0.70), wash * 0.8)) * mwGlow * mwGate * 0.047;
      wide = max(wide, mw * 0.22);
    }
#endif

#ifdef FEAT_AURORA
    // \u2500\u2500 Aurora \u2500\u2500
    // Light in the upper air, so it shares the stars' night and cloud \u2014 and
    // is drawn after them: the curtains hang in front of the star field
    if (u_aurora > 0.001) {
      vec3 au = aurora(rd, u_aurora) * mwGate * AURORA_LUM;
      sky += au;
      // its green and its red are both well outside sRGB
      wide = max(wide, min(max(max(au.r, au.g), au.b), 1.0) * 0.8);
    }
#endif
  }

  // \u2500\u2500 Moon \u2500\u2500
  // Where the ephemeris puts it, lit by the sun from where the sun actually
  // is: the disc is drawn as a sphere, so the terminator's curve and which
  // limb is bright follow from the two positions \u2014 a thin crescent with its
  // horns away from the sun, a gibbous moon, a full one. Up by day as well,
  // where the lit face still shows against the blue and the dark face does
  // not. Every contribution below carries vis, so a zero vis is an exact no-op
  vec3 moonDir = dirFromAngles(u_moon.x, u_moon.y);
  float moonUp = smoothstep(-0.03, 0.03, moonDir.y);
  float moonVis = moonUp * clamp(1.0 - u_cover * 0.9 - gloom, 0.0, 1.0);
  // how much moonlight there is for the clouds and the night: a full moon
  // high up gives all of it, a crescent a sliver, a set moon none \u2014 with a
  // floor for the starlight and airglow a night keeps regardless. u_moon.z
  // already carries an eclipse (see bind), so a moon in the Earth's shadow
  // leaves the night nearly as dark as a new one
  float nightM = nightF * mix(0.3, 1.0, moonUp * u_moon.z);
  float moonAng = acos(clamp(dot(rd, moonDir), -1.0, 1.0));
  // for the clouds: how much of the moon's light a thin cloud this far from
  // it carries on forward \u2014 not cut by the cover, since the cloud is the
  // thing in front \u2014 and the corona it is colored with
  // Measured from the limb, not the centre: the disc is drawn some ten times
  // its real size, and a glow peaking at its centre put a hot spot inside a
  // moon behind a cloud, with the corona's rings inside the disc
#ifdef FEAT_MOONLIT
  float moonLimb = max(moonAng - 0.046, 0.0);
  g_moonFwd = moonUp * u_moon.z * nightF
            * (exp(-moonLimb / 0.03) * 1.6 + exp(-moonLimb / 0.13) * 0.65 + exp(-moonLimb / 0.40) * 0.12);
  g_corona = corona(moonLimb);
#endif
  // the sun's, likewise from its limb (the drawn disc's flat core reaches
  // about 0.035 rad out) and not cut by the cover. Within ten degrees or so;
  // past fifteen there is nothing a thin cloud makes of it
#ifdef FEAT_IRIDESCENCE
  float sunLimb = max(acos(clamp(dot(rd, sunDir), -1.0, 1.0)) - 0.035, 0.0);
  g_sunLimb = sunLimb;
  g_sunFwd = dayF * smoothstep(-0.02, 0.08, sunEl)
           * (exp(-sunLimb / 0.10) + exp(-sunLimb / 0.20) * 0.40)
           * smoothstep(0.30, 0.18, sunLimb);
  g_sunCorona = corona(sunLimb);
#endif
  if (moonVis > 0.0 && skyLight) {
    float ang = moonAng;
    float moon = smoothstep(0.048, 0.043, ang);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), moonDir) + vec3(1e-6, 0.0, 0.0));
    vec3 up = cross(moonDir, right);
    float vis = moonVis;

    // Moon-fixed frame: the ray projected onto the disc plane, in units of the
    // disc radius, x toward the right of the sky and y up. The face is drawn
    // in this frame, so it stays glued to the surface however the camera
    // swings (and turns with the moon's position the way the real face does
    // against the horizon).
    vec2 muv = vec2(dot(rd, right), dot(rd, up)) / 0.048;
    // the surface under this ray, the disc being the near face of a sphere:
    // its normal, the cosine of the sun's incidence on it and of our view of it
    float rr = min(dot(muv, muv), 1.0);
    float mu = sqrt(1.0 - rr);
    vec3 nrm = right * muv.x + up * muv.y - moonDir * mu;
    float mu0 = dot(nrm, sunDir);
    // Lunar regolith reflects by Lommel-Seeliger, not Lambert: 2\xB7\u03BC0/(\u03BC0+\u03BC),
    // which is flat across a full moon (no limb darkening \u2014 the full moon is a
    // flat disc, famously) and falls to nothing at the terminator with the
    // slow gradient a crescent shows. The surge near full is the opposition
    // effect, what makes a full moon so much brighter than two half moons
    // the shape is the phase's, not the light's: take the eclipse back out
    float phase = u_moon.z / (1.0 - 0.9 * u_moonEclipse);
    float ls = max(mu0, 0.0) * 2.0 / max(mu0 + mu, 1e-3);
    ls *= 1.0 + 0.5 * smoothstep(0.7, 1.0, phase);
    float lit = moon * ls;

    // \u2500\u2500 the Earth's shadow \u2500\u2500
    // In an eclipse the umbra crosses the face as a circle near three times
    // the moon's width, its centre the point opposite the sun \u2014 which, seen
    // on the disc, lies the way the sun's direction leans off it, so the
    // shadow bites in from the limb the moon is moving toward (its east) and
    // its curved edge is the Earth's own outline. How far it reaches is
    // set by the coverage the ephemeris gives, not by the shader's
    // geometry: the drawn disc is ten times its real size and the sun here
    // is a coarser sun. Inside it, sunlight bent through every sunset on
    // the Earth's rim: dim, copper, darker toward the shadow's middle. Just
    // outside, the penumbra takes a little off
    float umbra = 0.0, deep = 0.0, penDim = 0.0;
    if (u_moonEclipse > 0.0) {
      vec2 toShadow = normalize(-vec2(dot(sunDir, right), dot(sunDir, up)) + vec2(1e-7, 0.0));
      const float UMBRA_R = 2.7;          // in moon radii, about
      // where the edge crosses the line to the shadow's centre, +1 at the
      // first touch to \u22121 at the last: the inverse of the two circles'
      // overlap, fitted to within half a percent of the disc. Pushed on past
      // the far limb as totality comes, so the soft edge leaves no lit rim
      float t = pow(max(1.0 - u_moonEclipse, 1e-6), 0.6667) - pow(max(u_moonEclipse, 1e-6), 0.6667);
      float edge = -0.0633 + 0.9666 * t + 0.0601 * t * t - 0.35 * smoothstep(0.96, 1.0, u_moonEclipse);
      float dist = length(muv - toShadow * (UMBRA_R + edge));
      umbra = smoothstep(UMBRA_R + 0.2, UMBRA_R - 0.2, dist);
      deep = clamp((UMBRA_R - dist) / 1.8, 0.0, 1.0);
      penDim = smoothstep(UMBRA_R + 1.8, UMBRA_R, dist) * smoothstep(0.0, 0.05, u_moonEclipse);
    }

    // \u2500\u2500 the face \u2500\u2500
    // The near side's maria, where they are: the large dark basins as
    // ellipses with noise-torn edges, over a fine grain of highland. Read
    // only through the disc, so off it none of this runs
    float albedo = 1.0;
    if (moon > 0.0) {
      vec2 q = muv + (fbm4(muv * 2.6 + 3.0) - 0.5) * 0.18;   // torn edges
      float m = 0.0;
      #define MARE(cx, cy, rx, ry, k) { vec2 e = (q - vec2(cx, cy)) / vec2(rx, ry); m += k * smoothstep(1.25, 0.75, dot(e, e)); }
      MARE(-0.55,  0.12, 0.34, 0.44, 0.55)   // Oceanus Procellarum
      MARE(-0.24,  0.48, 0.30, 0.22, 0.62)   // Imbrium
      MARE( 0.22,  0.42, 0.18, 0.17, 0.62)   // Serenitatis
      MARE( 0.42,  0.12, 0.22, 0.20, 0.58)   // Tranquillitatis
      MARE( 0.62, -0.22, 0.14, 0.21, 0.52)   // Fecunditatis
      MARE( 0.45, -0.37, 0.11, 0.11, 0.50)   // Nectaris
      MARE(-0.30, -0.32, 0.21, 0.15, 0.52)   // Nubium
      MARE(-0.52, -0.44, 0.10, 0.10, 0.50)   // Humorum
      MARE( 0.76,  0.30, 0.10, 0.13, 0.62)   // Crisium
      MARE(-0.10,  0.78, 0.45, 0.07, 0.42)   // Frigoris
      #undef MARE
      m = min(m, 1.0);
      // the highlands: bright, cratered \u2014 a grain, and a few bright ray craters
      float grain = fbm4(muv * 9.0 + 17.0) - 0.5;
      float tycho = exp(-dot(muv - vec2(-0.16, -0.72), muv - vec2(-0.16, -0.72)) / 0.0025) * 0.35
                  + exp(-dot(muv - vec2(0.36, -0.08), muv - vec2(0.36, -0.08)) / 0.0012) * 0.2;
      albedo = mix(1.0, 0.52, m) * (1.0 + grain * 0.22) + tycho;
      // shadows lengthen toward the terminator and the relief comes out
      albedo *= 1.0 + (fbm(muv * 14.0 + 41.0) - 0.5) * 0.5 * smoothstep(0.5, 0.0, mu0);
    }

    // Earthshine. The shadowed disc is rock, not glass: it occludes the stars
    // behind it (a replace, not an add) and holds a faint blue-grey glow of
    // sunlight bounced off the Earth, far under the lit face, strongest when
    // the Earth is fullest from there \u2014 at a thin crescent. The occlusion
    // saturates early so a clear-night vis of 0.9 does not leak 10% of every
    // star through the rock, yet it still follows vis down under cloud so a
    // heavy overcast dims the disc away instead of punching a dark hole in
    // the cloud glow. By day the sky in front of it outshines it and the dark
    // face is not there at all.
    vec3 shine = L(vec3(0.62, 0.68, 0.78)) * albedo * 0.012 * (1.4 - phase) * MOON_LUM;
    // (none on the shadowed part: the Earth turns its night side to it)
    sky = mix(sky, shine * (1.0 - umbra), moon * smoothstep(0.0, 0.55, vis) * nightF);

    // The lit face. Held just over the tone curve's knee, not blown out: a
    // moon that saturates to paper white loses its seas and reads as a disc
    // of paper, which is exactly what it did. By day the daylit sky in front
    // takes the edge off it \u2014 a white about a cloud's
    float face = 0.42 * mix(0.55, 1.0, nightF);
    // the shadowed part in linear light, already dim: the outer umbra a
    // lighter orange, its middle a deep brick red. Lit from all round the
    // Earth's rim rather than from the sun's side, so not by ls. While part
    // of the face is still in sunlight the eye is held by it and the shadow
    // reads near black; only in totality does the copper come up
    vec3 copper = mix(vec3(0.70, 0.17, 0.04) * 1.3, vec3(0.50, 0.07, 0.02) * 0.6, deep)
                * 0.16 * mix(0.3, 1.0, smoothstep(0.9, 1.0, u_moonEclipse)) * moon;
    vec3 faceCol = L(vec3(1.0, 0.97, 0.90)) * lit * (1.0 - 0.4 * penDim);
    sky += mix(faceCol, copper, umbra) * albedo * vis * MOON_LUM * face;
    lit *= 1.0 - umbra * 0.9;

    // Bloom: a little scatter around the lit limb, warm like the light that
    // causes it, growing with the phase. Kept small \u2014 a wide halo is what a
    // camera sees, not an eye, and it swallowed the disc
    vec2 litDir = normalize(vec2(dot(sunDir, right), dot(sunDir, up)) + vec2(1e-5, 0.0));
    float sideW = 0.5 + 0.5 * dot(muv, litDir) / max(length(muv), 1e-3);
    sideW = 0.12 + 0.88 * sideW;
    float rim = exp(-max(ang - 0.045, 0.0) * 55.0) * (1.0 - moon) * (0.1 + 0.9 * u_moon.z)
              * (1.0 - 0.85 * u_moonEclipse);
    sky += L(vec3(1.0, 0.95, 0.87)) * rim * sideW * 0.10 * vis * nightF;
    // a whisper of scattered moonlight haze just past the limb, all around
    sky += L(vec3(0.45, 0.55, 0.75)) * exp(-max(ang - 0.045, 0.0) * 11.0)
         * (1.0 - moon) * 0.025 * vis * u_moon.z * nightF;
    wide = max(wide, max(lit * 0.5, rim * sideW * 0.10) * vis * 0.7);
  }

  // \u2500\u2500 Meteors \u2500\u2500
  float meteorVis = starF * clamp(1.0 - u_cover * 1.2, 0.0, 1.0) * (1.0 - gloom);
  if (meteorVis > 0.0 && skyLight) {
    vec3 m = meteorStreak(rd, u_time, u_sky.z, u_sky.w, u_radiant);
    float mi = max(max(m.r, m.g), m.b);
    if (mi > 0.0001) {
      float vis = meteorVis;
      // burns hot enough to claim gamut like the other light sources
      sky += L(m) * vis * STAR_LUM * 0.85;
      wide = max(wide, mi * vis * 0.85);
    }
  }

  // \u2500\u2500 Sun (an overexposed blowout. The core saturates flat, the edge falls off steeply) \u2500\u2500
  float sunVis = smoothstep(-0.06, 0.06, sunEl)
               * clamp(1.0 - u_cover * 0.75 - gloom * 0.95, 0.0, 1.0);
  float sunAng = acos(clamp(dot(rd, sunDir), -1.0, 1.0));
  if (sunVis > 0.0) {
    vec3 sunCol = L(mix(vec3(1.0, 0.98, 0.92), vec3(1.05, 0.6, 0.3), sunsetF));
    // gain the core and clamp \u2192 produces a flat, saturated white patch at the center
    float core = clamp(exp(-sunAng * sunAng * 900.0) * 2.2, 0.0, 1.0);
    // At the horizon the disc itself is dimmed and reddened by the air it
    // comes through \u2014 an orange you can look at, not a white you cannot.
    // The blowout is kept for a sun with any height
    float low = smoothstep(0.14, -0.02, sunEl);
    vec3 disc = mix(vec3(SUN_LUM), L(vec3(1.0, 0.42, 0.16)) * SUN_LUM * 0.12, low);
    sky = mix(sky, disc, core * sunVis);
    // keep the surrounding bleed subtle (a scattering halo)
    float halo = exp(-sunAng * 4.0);
    sky += sunCol * halo * 0.22 * sunVis * HALO_LUM;
    // no sunsetF gate: at midday sunCol is near-white and the widening is
    // self-cancelling, so this only bites once the halo has turned orange.
    // halo carries the same 0.22 as its bleed \u2014 see the invariant above
    wide = max(wide, max(core, halo * 0.22) * sunVis * 0.6);
  }

  // night city lights (a warm glow along the horizon \u2014 a Tokyo-like sky)
  // 0.4 at Bortle 6, which is what this has always drawn; nothing at Bortle 1
  sky += L(vec3(0.26, 0.16, 0.09)) * exp(-h * 8.0) * starF
       * (0.4 * (u_sky.x - 1.0) / 5.0) * (1.0 - gloom * 0.6);

  // airglow: at a truly dark site the horizon carries a faint green-grey rim of
  // atmospheric chemiluminescence instead of city light. A thin rim \u2014 a fat
  // scale height reads as haze and swallows the lowest stars. Shares the second
  // star layer's gate, so it is exactly absent at Bortle 6 and up.
  float agDeep = clamp((6.0 - u_sky.x) / 5.0, 0.0, 1.0);
#ifdef FEAT_DARKSKY
  if (agDeep * starF > 0.0 && skyLight) {
    // rippled around the compass \u2014 real airglow hangs in uneven waves, and a
    // uniform rim reads as a printed strip. Seeded off the horizontal ray
    // components, so it is seamless in azimuth and pinned as the view swings
    float agN = fbm2(vec2(rd.x, rd.z) * 2.5 + 31.0);
    sky += L(vec3(0.30, 0.52, 0.38)) * exp(-h * (9.0 + 7.0 * agN)) * starF
         * (0.07 * (0.55 + 0.90 * agN) * agDeep)
         * clamp(1.0 - u_cover * 1.2, 0.0, 1.0) * (1.0 - gloom);

    // \u2500\u2500 Zodiacal light \u2500\u2500
    // Sunlight off the dust that lies in the plane of the planets: at a dark
    // site, once twilight has gone, a faint cone leans up from where the sun
    // went down (and, before dawn, from where it will rise), along the
    // ecliptic. The ecliptic is taken as the sun's own path across the sky \u2014
    // its daily arc about the pole \u2014 which is what sets the cone's lean.
    // Gone again once the sun is far enough down that the dust near it has set
    float zl = smoothstep(-0.16, -0.28, sunEl) * smoothstep(-0.60, -0.40, sunEl);
    if (zl > 0.0) {
      const vec3 POLE = vec3(0.0, 0.695, 0.719);     // a mid-northern latitude's celestial pole
      vec3 along = normalize(cross(sunDir, POLE) + vec3(1e-6));
      if (along.y < 0.0) along = -along;              // the branch that rises
      vec3 off = normalize(cross(sunDir, along));
      float u = atan(dot(rd, along), dot(rd, sunDir));   // up the ecliptic from the sun
      float v = dot(rd, off);                            // off the plane
      float halfW = 0.40 * (1.0 - clamp(u, 0.0, 1.4) / 1.8);
      float cone = exp(-max(u, 0.0) * 1.4) * exp(-v * v / (halfW * halfW)) * smoothstep(0.0, 0.15, u);
      sky += L(vec3(0.72, 0.75, 0.86)) * cone * 0.075 * zl * agDeep * starF
           * smoothstep(0.0, 0.03, h) * clamp(1.0 - u_cover * 1.2, 0.0, 1.0) * (1.0 - gloom);
    }
  }
#endif

  // \u2500\u2500 Lightning (computed before the clouds so it lights them too) \u2500\u2500
  float flash = 0.0;
  // the slot and its phase are read again after the clouds, for the bolt
  float ltCell = floor(u_time * 0.55);
  float ltPh = fract(u_time * 0.55);
  {
    float p1 = hash11(ltCell);
    float thresh = mix(1.05, 0.55, u_thunder);   // never fires when thunder=0
    if (p1 > thresh) {
      flash = exp(-ltPh * 9.0) * (0.65 + 0.35 * sin(ltPh * 70.0 + p1 * 30.0));
    }
  }

  // \u2500\u2500 Clouds, precipitation: back to display space \u2500\u2500
  // From here to the snow, every step is an overlay() \u2014 a wash authored as a
  // display-space blend \u2014 save the one halo marked below. overlay() pays an
  // encode and a decode (six pow()s) per call, per pixel, and back to back the
  // decode of one only feeds the encode of the next. So this whole stretch
  // stays encoded as disp and pays the pair once. That is exact, not an
  // approximation: encodeSrgb(L(x)) is x for any x >= 0, and a mix() of
  // non-negative colors with a weight in 0..1 cannot leave that range \u2014 every
  // alpha below is within 0..1 and every color non-negative.
  disp = encodeSrgb(sky);

  // \u2500\u2500 Shared setup for the cloud layers (intersection of view ray \xD7 cloud plane) \u2500\u2500
  float rdY = max(rd.y, 0.03);
  float horizonFade = smoothstep(0.0, 0.24, rd.y);
  float az = atan(rd.x, rd.z);
  // the cloud plane's coordinate system is world xz; fold the sun direction onto the same plane
  vec2 ldir = normalize(sunDir.xz + vec2(1e-4, 1e-4));
  // display-encoded: this tints the cloud palette, which is authored there
  vec3 cloudSun = mix(vec3(1.05, 1.0, 0.95), vec3(1.15, 0.50, 0.22), sunsetF * min(u_sunset.x, 1.0));
  cloudSun = mix(cloudSun, cloudSun * vec3(1.0, 0.78, 0.62), sunsetF * clamp(u_sunset.x - 1.0, 0.0, 1.0) * 0.6);
  // and redder still once the sun is under: what still reaches the high clouds has come the long way
  cloudSun *= mix(vec3(1.0), vec3(1.0, 0.72, 0.58), smoothstep(0.02, -0.06, sunEl));

  // the cloud plane's projection scale (= altitude). Higher layers are larger, so the same lump looks smaller
  const float ALT_HIGH = 3.2;
  const float ALT_MID = 1.8;
  const float ALT_LOW = 0.95;
  // a cloud genus with amount 0 is skipped entirely \u2014 a clear sky costs almost nothing.
  // So is every plane layer below the horizon: each one's alpha carries
  // horizonFade, which is exactly zero there (half of every skybox bake)
  bool above = horizonFade > 0.0;
  float ramp = 0.08 + 0.14 * (1.0 - rdY);   // widen near the horizon to suppress aliasing

  // In the split variant the stack accumulates as one wash (see OVER). Mode 0
  // evaluates it here and applies it below; mode 1 evaluates it and stops
  // there, writing it out for a later composite; mode 2 skips it and reads
  // that composite instead \u2014 which is why every layer's gate carries stack.
#ifdef CLOUD_SPLIT
  vec3 cC = vec3(0.0);
  float cT = 1.0;
#endif
  bool stack = CLOUD_STACK;

  // \u2500\u2500 High layer, 5000\u201313000m \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Cirrus Ci (mare's tail) \u2014 the first to blush pink at magic hour
  if (u_high.x > 0.001 && above && stack) {
    // the extra x-crawl rides u_windOff too (see cloudField): 0.14 matches
    // the old u_time \xD7 0.004 at light wind, and speeds up when it blows
    float f = filament(planeUV(rd, rdY, ALT_HIGH, u_windOff * 0.3) + vec2(u_windOff * 0.14, 0.0));
    vec3 col = mix(vec3(1.0), vec3(1.05, 0.62, 0.55), sunsetF);
    col = mix(vec3(0.25, 0.30, 0.45), col, max(dayF, sunsetF));
    OVER(col, f * u_high.x * 0.72 * horizonFade * (1.0 - gloom * 0.8));
  }
#ifdef FEAT_CONTRAILS
  // \u2500\u2500 Contrails \u2500\u2500
  // A jet's trail: a line drawn across the high sky from a point, lengthening
  // at the plane's speed \u2014 thin and sharp just behind it, spreading into a
  // soft band and dissolving over the minutes after, uneven along its length
  // where the air was drier. One plane per slot of the clock, on a heading of
  // its own, as often as the amount asks
  if (u_contrails > 0.001 && above && stack) {
    const float SLOT = 240.0;
    const float SPEED = 0.06;                       // sky-plane units per second
    // no wind in the projection: the trail is a placed thing, not a texture,
    // and the wind's offset would carry its start off the sky
    vec2 uv = rd.xz / rdY * (ALT_HIGH * 1.1);
    vec3 col = mix(vec3(1.0), vec3(1.05, 0.62, 0.55), sunsetF);
    col = mix(vec3(0.25, 0.30, 0.45), col, max(dayF, sunsetF));
    // two planes on clocks half a slot apart, so at full there is always a
    // trail in some state across the sky, and the sky is never bare between
    for (int k = 0; k < 2; k++) {
      float tk = u_time + float(k) * SLOT * 0.5;
      float slot = floor(tk / SLOT) + float(k) * 977.0;
      if (hash11(slot * 3.7) >= u_contrails) continue;
      // the plane has been flying for a minute already when its slot opens,
      // with that much trail behind it, so a first frame is not an empty sky
      float age = fract(tk / SLOT) * SLOT + 60.0;
      float th = hash11(slot * 5.3) * 6.2831853;
      vec2 dir = vec2(cos(th), sin(th));
      vec2 rel = uv - (vec2(hash11(slot * 7.9), hash11(slot * 9.1)) - 0.5) * 5.0;
      float s = dot(rel, dir) + 2.5;                // along the trail, from where it began
      float n = dot(rel, vec2(-dir.y, dir.x));      // across it
      float head = age * SPEED;                     // where the plane is now
      if (s > 0.0 && s < head) {
        float since = (head - s) / SPEED;           // seconds since the plane was here
        float w = 0.012 + since * 0.0004;           // the ice drifts apart
        float body = exp(-n * n / (w * w)) * exp(-since / 150.0);
        body *= 0.55 + 0.45 * vnoise(vec2(s * 6.0, slot));
        OVER(col, body * 0.75 * horizonFade * (1.0 - gloom * 0.8));
      }
    }
  }
#endif
  // Cirrostratus Cs (veil cloud) \u2014 a thin veil across the whole sky. Haloes the sun
  if (u_high.y > 0.001 && stack) {
    // the halo below is sky-side and still shows under the horizon; the veil does not
    if (above) {
      vec2 s = stratiform(planeUV(rd, rdY, ALT_HIGH * 0.5, u_windOff * 0.3), 0.35, 0.0);
      vec3 col = mix(vec3(0.86, 0.89, 0.95), vec3(1.02, 0.80, 0.72), sunsetF);
      // At night the veil is lit by the moon: a little everywhere, and far
      // more toward it, where the crystals send its light on forward \u2014 the
      // grey-blue glow a moonlit veil hangs across the whole sky. A dark veil
      // under a moon only showed its halo as a ring round a hole
      float moonLit = moonVis * u_moon.z * nightF;
      vec3 nightCol = vec3(0.22, 0.26, 0.38) * (1.0 + moonLit * (0.9 + 2.4 * exp(-moonAng * 2.2)));
      col = mix(nightCol, col, max(dayF, sunsetF * 0.8));
      OVER(col, s.x * u_high.y * 0.45 * (1.0 + moonLit * 0.5) * horizonFade);
    }
    // the 22\xB0 halo (refraction through ice crystals). Added light, so it is the
    // one term in this stretch that has to leave display space \u2014 and only on
    // the ring itself, where there is something to add
#ifdef FEAT_HALOS
    vec3 halo = iceHalo(rd, el, sunDir, sunAng, sunVis, moonDir, moonAng, moonVis, nightF);
#else
    vec3 halo = vec3(0.0);
#endif
    float haloAmt = halo.r + halo.g + halo.b;
#ifdef CLOUD_SPLIT
    // Mode 0 only: it sits between layers, so the washes so far are applied
    // first and the stack starts over above it. Mode 1 cannot draw it (it has
    // no sky to add to); mode 2 lays it under the whole stack instead
    if (haloAmt > 0.0 && u_cloudMode < 0.5) {
      disp = disp * cT + cC;
      cC = vec3(0.0);
      cT = 1.0;
      disp = encodeSrgb(L(disp) + halo);
    }
#else
    if (haloAmt > 0.0) disp = encodeSrgb(L(disp) + halo);
#endif
  }
  // Cirrocumulus Cc (mackerel sky) \u2014 fine grains packed densely up high
  if (u_high.z > 0.001 && above && stack) {
    vec2 g = granular(planeUV(rd, rdY, ALT_HIGH * 5.5, u_windOff * 0.3), 0.55, 1.0, 0.25, ldir);
    vec3 col = cloudColor(g.x, g.y * 0.8, 0.16, dayF, nightM, sunsetF, flash, gloom, 0.5, cloudSun, 1.0);
    OVER(col, g.x * u_high.z * 0.85 * horizonFade);
  }

  // \u2500\u2500 Mid layer, 2000\u20137000m \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Altostratus As (grey veil) \u2014 a translucent sheet.
  // Not one uniform film but "torn membranes overlapping in patches", with
  // the sun showing through broadly, outline-less, as if through frosted
  // glass. These two things are altostratus's face.
  if (u_mid.x > 0.001 && above && stack) {
    vec2 uv = planeUV(rd, rdY, ALT_MID * 0.55, u_windOff * 0.6);
    vec2 s = stratiform(uv, 0.50, 0.35);
    // mottling from overlapping membranes. Stretched along the flow, it lines up into bands converging on the horizon
    float fleck = smoothstep(0.40, 0.74, fbm4(uv * vec2(2.4, 4.8) + 41.0));
    float thick = clamp(s.y * 0.62 + fleck * 0.38, 0.0, 1.0);

    vec3 shade  = mix(vec3(0.055, 0.062, 0.078), vec3(0.40, 0.43, 0.51), dayF);
    vec3 bright = mix(vec3(0.10, 0.11, 0.14), vec3(0.90, 0.91, 0.92), dayF);
    bright = mix(bright, bright * vec3(1.12, 0.92, 0.76), sunsetF * 0.8);
    vec3 col = mix(bright, shade, thick);

    // the sun through frosted glass: light wraps around more the closer to
    // the sun's direction and the thinner the membrane. The sun's disc is
    // hidden by the membrane, leaving only a broad, outline-less bloom
    float through = exp(-sunAng * 1.7) * max(dayF, sunsetF * 0.6);
    col += mix(vec3(1.0, 0.98, 0.92), vec3(1.05, 0.72, 0.45), sunsetF)
         * through * (1.0 - thick * 0.75) * 0.85;
    col += flash * vec3(0.75, 0.80, 1.0) * 0.5;

    OVER(col, s.x * u_mid.x * 0.95 * horizonFade);
  }
  // Altocumulus Ac (sheep cloud) \u2014 larger than cirrocumulus, with grains shaded individually
  if (u_mid.y > 0.001 && above && stack) {
    vec2 g = granular(planeUV(rd, rdY, ALT_MID * 2.2, u_windOff * 0.6), 0.80, 0.85, 0.35, ldir);
    vec3 col = cloudColor(g.x, g.y, 0.30, dayF, nightM, sunsetF, flash, gloom, 0.9, cloudSun, 0.5);
    OVER(col, g.x * u_mid.y * 0.95 * horizonFade);
  }
  // Nimbostratus Ns (rain cloud) \u2014 the rain-bearing cloud. Its undulating base's thickness variation becomes the light/dark directly
  if (u_mid.z > 0.001 && above && stack) {
    vec2 s = stratiform(planeUV(rd, rdY, ALT_MID * 0.30, u_windOff * 0.6), 0.10, 1.0);
    // no direct sunlight reaches it at all, so color can be one-dimensional: "thickness \u2192 shade".
    // cloudColor's shadow blending caps at 0.85 and never sinks to the photo's charcoal
    vec3 lit = mix(vec3(0.050, 0.055, 0.068), vec3(0.74, 0.75, 0.76), dayF);
    lit += vec3(0.12, 0.06, 0.03) * sunsetF;
    // real rain clouds sit between "charcoal and mid-grey", never pure black or white.
    // the thicker the cloud, the lower the dark end sinks
    vec3 col = lit * mix(0.74, mix(0.40, 0.20, u_mid.z), s.y);
    col += flash * vec3(0.75, 0.80, 1.0) * 0.6;
    OVER(col, s.x * u_mid.z * 0.99 * horizonFade);
  }

  // \u2500\u2500 Cumulonimbus Cb (thunderhead) \u2500\u2500
  //
  // "Pick one height per azimuth, fill below it" \u2014 a 1D height profile \u2014 can
  // only ever produce a triangular hill. It can't give cauliflower-shaped
  // round bulges, or lateral overhang. Solve it as a 2D field over azimuth
  // and elevation instead.
  //
  // To connect around the full azimuth loop, embed a cylindrical surface
  // ("radius = height") as a 2D noise field. Higher up, the circumference is
  // longer so the mass also spreads wider \u2014 which happens to match how a
  // real tower actually spreads.
  float cbAmt = u_low.w * (1.0 - gloom * 0.6);
  // how much of this pixel the tower covers \u2014 later layers use it to avoid
  // dragging their translucent fringes across the bright mass
  float cbMask = 0.0;
  // and what it shows there, and how far it stands against the sun (its
  // backT): a small cloud drawn in front of it takes its tone from these
  vec3 cbCol = vec3(0.0);
  float cbBack = 0.0;
  // (a sky with no tower in it is compiled without any of this \u2014 see
  // FEATURE.CB \u2014 and the layers below see an empty cbMask)
#ifdef FEAT_CB
  if (cbAmt > 0.001 && stack) {
    // how much of the storm stands (see cbLive, and the skyline below)
    float stand = cbLive();
    // and how big a storm it is. The towers' thrust grows with the amount,
    // but only over the amounts a storm is drawn at: below a third it is
    // held there, and what is left of the amount says how much of that
    // storm still stands (stand). Raised by the amount right down to
    // nothing, the thrust let each tower fall under its cut at an amount of
    // its own, a weak one at a tenth and a strong one not until the gate \u2014
    // and an eased amount crosses a tenth in a second or two: a tower that
    // collapsed while its neighbor stood whole, then went at a stroke
    cbAmt = max(u_low.w, 0.30) * (1.0 - gloom * 0.6);
    float azw = az + u_windOff * 0.15;
    vec2 dirc = vec2(sin(azw), cos(azw));
    // \u2500\u2500 How far off it stands \u2500\u2500
    // The storm's distance is how much of the sky it takes: nearer, the
    // same towers stand taller and wider; further, smaller, the base sunk
    // toward the horizon. Everything below reasons in the sky the storm
    // fills from the middle distance it was drawn at \u2014 elevations
    // stretched by cbS (ty is the view ray's height there), azimuths by
    // reading the noise round the horizon cbS times as finely \u2014 and only
    // what is seen through the air (the haze, the anvil's plane, the
    // lining against the sun) goes back to the real sky. At the middle
    // distance cbS is 1 and nothing moves
    float cbS = cbScale(u_cbFeat.z);
    float ty = sin(clamp(asin(clamp(rd.y, -1.0, 1.0)) * cbS, -1.5707, 1.5707));
    // "2\u20133 towers across the whole sky" is a fine distribution. A large
    // radius adds features along the circumference and produces a forest of
    // small towers, so pull this one at a deliberately low frequency only.
    // this also sets a tower's width-to-height proportion: at 1.4 the towers
    // come out as narrow totem-pole pillars \u2014 a real cumulonimbus is a
    // mountain about as wide as it is tall
    vec2 acir = dirc * (0.85 * cbS);
    // the noise must advance the same amount vertically as horizontally *on
    // screen*, or every stroke of texture stretches vertically. Per screen
    // radian, azimuth advances the noise by r/cos\u03B8 but elevation only by
    // r'\xB7cos\u03B8 (rd.y = sin\u03B8) \u2014 so isotropy needs r'/r = 1/cos\xB2\u03B8 = 1/(1\u2212rd.y\xB2),
    // whose solution is r = r0\xB7\u221A((1+y)/(1\u2212y)). Anything less (linear,
    // exponential) leaves a residual 1/cos\xB2\u03B8 vertical smear that reads as
    // the cloud being painted with a vertical brush
    // (in the real sky's elevation, scaled as a whole: the map from the
    // sphere stays conformal, so a lobe stays round however near the storm)
    vec2 cyl = dirc * (2.6 * cbS * sqrt((1.0 + rd.y) / max(1.0 - rd.y, 0.045)));

    // which azimuth a tower stands at. Keep the cutoff high for a "stands
    // here and there" distribution (too low connects into a band along the horizon).
    // growth/decay rides on the integrated offset u_evo, not u_time \u2014
    // that lets growth speed be set externally (via StateAnimator's evo
    // speed), and keeps the phase from jumping when the weather changes
    float mass = fbm4HQ(acir + vec2(0.0, cbClock()));
    // fbm maxima are sometimes knife-ridges crossing the azimuth circle at a
    // steep angle. Raised to a height they become tall needle towers \u2014 the
    // most common failure shape. Erode narrow peaks morphologically: clamp
    // to the taller of the two neighbors, which shaves any peak thinner
    // than ~2\xD70.08 rad and leaves broad mountains untouched
    //
    // Erosion only ever lowers massE, and nothing downstream can tell apart two
    // values at or under 0.42 \u2014 the thrust is zero for both, and the veil's
    // spread only starts at 0.50 \u2014 so a ring is only sampled while the mass is
    // still standing above that line.
    float massE = mass;
    if (massE > 0.42) {
      float e1 = 0.08 / cbS;
      float massL = fbm4HQ(vec2(sin(azw - e1), cos(azw - e1)) * (0.85 * cbS) + vec2(0.0, cbClock()));
      // (a neighbor standing as high on one side leaves the peak standing
      // whatever the other does, so that one is only read when it can tell)
      if (massL < massE) {
        float massR = fbm4HQ(vec2(sin(azw + e1), cos(azw + e1)) * (0.85 * cbS) + vec2(0.0, cbClock()));
        massE = min(massE, max(massL, massR));
      }
    }
    // a second, wider erosion ring: a knife-ridge longer than the first
    // ring slips through it and still stands as a needle. The small
    // allowance lets a broad dome rise a little above its shoulders
    if (massE > 0.42) {
      float e2 = 0.13 / cbS;
      float massL2 = fbm4HQ(vec2(sin(azw - e2), cos(azw - e2)) * (0.85 * cbS) + vec2(0.0, cbClock()));
      if (massL2 + 0.06 < massE) {
        float massR2 = fbm4HQ(vec2(sin(azw + e2), cos(azw + e2)) * (0.85 * cbS) + vec2(0.0, cbClock()));
        massE = min(massE, max(massL2, massR2) + 0.06);
      }
    }
    // the tower's thrust. Whether this is peaked or not decides how boxy it looks.
    // left as a gentle hill, a wide range of azimuths reach the same height
    // and the top becomes a flat slab.
    // peaking it makes height drop off sharply across azimuth, so it can
    // stay tall while still narrowing upward
    float env = pow(max(massE - 0.42, 0.0) * 4.6, 1.5);
    // the tropopause. Give it a slight undulation across azimuth (perfectly
    // flat reads as a slab cutting across the sky).
    // if a tower grows past this, its top gets sliced perfectly flat and
    // reads as a slab. Leave the roundness to the tower's own tapering, and
    // place the tropopause at the height "only the tallest tower's tip reaches"
    //
    // A quarter to a third of the way up the sky: a cumulonimbus is 12 km
    // tall and stands a few tens of kilometres off, and placed higher it
    // read as a column leaning over the eye rather than a mountain on the
    // horizon. ceilN is its height without the undulation, for what must
    // agree across azimuths (the crown's shape, the anvil's plane)
    float ceilN = 0.44 + 0.11 * cbAmt;
    // (the undulation is read only where a tower or its skirt can stand:
    // under a thinner mass nothing below asks where the tropopause is)
    float anvilTop = ceilN;
    if (mass > 0.20) anvilTop += (fbm4(acir * 1.6 + 11.0) - 0.5) * 0.07;

    // The silhouette is decided by one formula: "thrust \u2212 height".
    //
    // Multiplying a cut by azimuth (a vertical flank) with a cut by height
    // (a flat ceiling) produces a mesa no matter what noise rides on top. If
    // thrust is a gentle hill across azimuth, subtracting height alone
    // naturally narrows it upward, with the top becoming a parabola \u2014 a
    // round head. Making the height term quadratic accelerates the tapering
    // higher up, giving a cumulonimbus with a wide base and a round top.
    float rise = env * (1.05 + 1.35 * cbAmt);
    // how strongly this azimuth's tower feeds an anvil: the same test the
    // plate makes upwind (anvilPlate). Where it does, the ceiling is the
    // plate's top \u2014 one level, not the tropopause's undulation, or the
    // column's flat top stood proud of the plate in places and sank under
    // it in others
    float feed = smoothstep(1.7, 2.3, rise) * u_cbFeat.x;
    anvilTop = mix(anvilTop, ceilN, feed);
    // \u2500\u2500 The tower's life \u2500\u2500
    // Where the thrust stood a while ago (CB_LAG) against where it stands
    // now says what stage this tower is at. Climbing, it is young: the
    // hard, crisp cauliflower of a towering cumulus, and the anvil comes
    // only once it reaches the tropopause (feed). Sinking, it is dying \u2014
    // the updraft gone out of it \u2014 and its lobes slump and go soft as the
    // cloud glaciates and wastes away, while the anvil it fed is cut loose
    // (see anvilPlate). Read off the thrust before the erosion, as the
    // past is: a peak the erosion shaved would read as dying. And faded
    // out toward the thrust's cut, so it ends where the reading does
    // (read below, only where the tower is drawn)
    float decay = 0.0, growth = 0.0;
    // \u2500\u2500 The base \u2500\u2500
    // A tower's base is flat: it is the condensation level, one height across
    // the whole cloud, and from tens of kilometres off it sits a few degrees
    // over the horizon. The middle of a tower is nearer than its flanks, so
    // the line bows up a little across it, and a bigger (nearer) tower's
    // stands higher. The same line the rain shafts hang from (see there, and
    // read off the same raw thrust), so a curtain starts where the cloud ends
    float baseY = 0.12 + 0.06 * smoothstep(0.6, 2.0, rise);
    // how far this azimuth's tower reaches (cbShape). Used for shading and
    // the companion forms' attachment height
    float towerTop = cbShape(cbReach(rise), ceilN);
    // \u2500\u2500 Backlit \u2500\u2500
    // how far this tower stands between the eye and the sun. Squashed
    // vertically while the sun is low, so a tower over it is dark to the
    // top; a high sun lights the heads from above, and then only what
    // actually crowds the disc is
    // (a sky where no sun can light anything from behind is compiled
    // without any of it, the four below held at nothing \u2014 FEATURE.BACKLIT)
#ifdef FEAT_BACKLIT
    float apart = sunApart(rd, sunDir, mix(0.35, 1.0, smoothstep(0.15, 0.60, sunEl)));
    float gateB = backGate(sunDir);
    float back = (1.0 - smoothstep(0.26, 0.60, apart)) * gateB;
#else
    const float back = 0.0, backT = 0.0, backI = 0.0, side = 0.0;
#endif
    // \u2500\u2500 Side-lit \u2500\u2500
    // Under a low sun the backlight does not stop at a third of a radian.
    // A tower thirty or forty degrees round from a setting sun still shows
    // the eye mostly its shaded side \u2014 the sun is behind it more than
    // beside it \u2014 and photographs of one are all contrast: the flank
    // toward the sun lit gold, the body a blue-violet shade, the lining
    // only along the sunward edge. Ending the backlight where it ended for
    // a small cloud left that band to the front-lit shading, its face and
    // shade both half-lit, and then to the bright air: a flat pale
    // lavender, neither one thing nor the other. So the tower's own
    // backlight (backT) reaches on round to the sun's side while the
    // sun is low, and as it goes round (side) its lining narrows to the
    // sunward edge and the sunward flank takes the sun \u2014 all of the face
    // by the time the sun is square to one side, where the front-lit
    // shading takes over. A high sun lights the heads from above, and
    // keeps the narrow reach. The anvil's plate and the cap have no flank
    // to turn to the sun, only ice that is thick or thin, and theirs
    // (backI) ends where the tower's flank has taken most of it
#ifdef FEAT_BACKLIT
    float lowS = 1.0 - smoothstep(0.20, 0.55, sunEl);
    float backT = (1.0 - smoothstep(mix(0.26, 0.90, lowS), mix(0.60, 1.65, lowS), apart)) * gateB;
    float backI = (1.0 - smoothstep(mix(0.26, 0.42, lowS), mix(0.60, 1.10, lowS), apart)) * gateB;
    float side = smoothstep(0.24, 0.72, apart) * lowS;
#endif
    // the lining's color: the sun's own, run hot \u2014 at dusk past the orange
    // of the light itself toward gold, as anything blown out goes
    vec3 rimC = mix(cloudSun, vec3(1.0, 0.86, 0.58), 0.35 * sunsetF);

    // \u2500\u2500 Competing turrets \u2500\u2500
    // One thrust per azimuth makes one hill per tower, and a hill read as a
    // height is a cone \u2014 or, where its top is broad, a plateau. A real
    // cumulonimbus is a cluster: a few turrets shouldering each other at
    // different heights, the tallest leading, over a body they share. So the
    // thrust only sets how high a turret may go, and a row of them
    // (turretRow) stands on a body half the thrust's height: a few to a
    // tower's span, the tallest where the thrust is.
    //
    // The heights are the thrust's with a quarter added: the noise used to
    // ride on the envelope with a bias that carried every tower's head that
    // much past it, and the lobes are laid on evenly now (see lobeLayer) \u2014
    // without it a storm's smaller towers sank into their own skirts.
    //
    // \u2500\u2500 Congestus skirt \u2500\u2500
    // A cumulonimbus does not stand alone on the horizon: it rises out of a
    // field of towering cumulus, the cells that have not made it yet, which
    // crowd its foot on either side. A second row of turrets, smaller and
    // closer together, stands on the same base line wherever the thrust is
    // near a tower's \u2014 the same mass read with a lower cut, so it reaches
    // out past the tower's flanks.
    //
    // Both rows are only read where a tower or its skirt can stand, and
    // never under the base, where there is nothing to draw.
    float topV = cbShape(cbReach(rise + 0.25), ceilN);
    float skirt = smoothstep(0.35, 0.47, mass);
    float skGain = 0.20 * (0.6 + 0.4 * cbAmt) * smoothstep(0.02, 0.20, cbAmt);
    float headY = topV * 0.5;
    float skTop = baseY + skirt * skGain * 0.3;
    // a radian of azimuth spans cos\u03B8 on screen, so the caps would come out
    // squeezed sideways the higher they stand \u2014 but taken at this pixel's
    // elevation it makes a turret's skyline change from one row to the next,
    // and a cap whose skyline drops as the rows climb leaves a gap under its
    // head. Taken at the head's own height instead
    float cosEl = sqrt(1.0 - min(topV * topV * 0.5, 0.5));
    float azT = azw;
    // height, with a quadratic term that tapers the tower as it climbs:
    // too strong, it pinches the upper half into a needle \u2014 a real tower's
    // head is still about half the base's width
    float hgt = ty + ty * ty * 0.6;
    // the cap the turrets' skyline is eased under (see the lobe stack)
    float capV = anvilTop + 0.01 + 0.05 * smoothstep(anvilTop, anvilTop + 0.25, topV);
    // \u2500\u2500 Over the top \u2500\u2500
    // However the turrets fall, their skyline is eased under that cap (it
    // can overshoot it by no more than 0.005), and the skirt stands no higher
    // than its gain and the shoulders its turrets lean together with. What the
    // lobes lay on can lift the surface only where it is already near the
    // edge. So a ray well over both meets no cloud, and the turrets and the
    // whole lobe stack are skipped there \u2014 exactly: well over is where the
    // envelope has fallen far enough for nothing to show, nor the tower's
    // decay to be read, nor the glow round a backlit rim to reach (auraW:
    // the most of it there can be, at the envelope's own value \u2014 see aura)
#ifdef FEAT_BACKLIT
    float auraW = back * exp(-sunAng * 3.0) * stand;
#else
    const float auraW = 0.0;
#endif
    float hiY = capV + 0.005;
    float skMax = baseY + skGain + 0.03;
    float overF = max(hiY + 0.6 * hiY * hiY - hgt, (skMax - ty) * 2.5 - 0.03);
    bool over = overF <= -0.15 && ty >= skMax && auraW * smoothstep(-0.90, -0.11, overF) <= 0.001;
    if (mass > 0.20 && ty > baseY - 0.03 && !over) {
      // A flank read at one azimuth all the way up rules a straight line up
      // the sky, so the rows are read at an azimuth that wanders a little
      // with height \u2014 a flank leans out and tucks in as it climbs \u2014 by a 2D
      // noise, which cannot step (the lobes' own bulges come later)
      float wob = (vnoise(cyl * 1.3 + vec2(7.1, u_evo * 0.20)) - 0.5) * 0.50
                + (vnoise(cyl * 3.1 + vec2(3.3, 1.9 - u_evo * 0.3)) - 0.5) * 0.50;
      // (only down the flanks: up at the heads a cap's skyline drops fast
      // to either side, and read at a wandering azimuth it rises and falls
      // from row to row \u2014 scraps of the head left hanging over gaps, and
      // where a turret stood clear of its neighbors, its head on a thin
      // neck: a finger poking up out of the crown. So it dies out well
      // below the heads)
      azT = azw + wob * 0.08 / (cosEl * cbS) * smoothstep(0.70, 0.40, ty / max(topV, 0.05));
      headY = max(turretRow(azT, ${X.toFixed(1)}, 1.0, cosEl, cbS), headY);
      skTop = max(baseY + turretRow(azT, ${Z.toFixed(1)}, 2.0, cosEl, cbS), skTop);
    }
    // \u2500\u2500 Going, and coming \u2500\u2500
    // As the storm runs out (stand, see cbLive) its skyline sinks into the
    // base, the towers and their skirt alike, all of a piece: each turret
    // keeps its place and its shape, only lower, and the low remnant thins
    // away (the alpha, below) as the heads come down onto the base line \u2014
    // all of it before the amount reaches the gate, so nothing is left
    // there to vanish. Rising, they climb out of it the same way
    headY = min(headY, mix(baseY, headY, stand));
    float skStood = skTop - baseY;
    skTop = min(skTop, mix(baseY, skTop, stand));
    // (and the shading reasons in the tower as it stands, sunk or not)
    float topL = min(topV, mix(baseY, topV, stand));

    // \u2500\u2500 Anvil (incus) \u2500\u2500
    // A tower with nowhere left to go at the tropopause spreads out under it:
    // a thin, flat plate of ice, the tower's head blown downwind for two or
    // three times the tower's own width and only a little way upwind. Built
    // as a widening of the tower's own silhouette it came out a mushroom \u2014
    // as thick as the head and as lumpy, the same both ways. It is a plate
    // of its own instead, laid on a level plane at the tropopause
    // (anvilPlate): a few degrees thick over its tower and thinner as it
    // spreads, flat on top, its far reaches a translucent veil of ice
    // drawn out in strands.
    vec3 anvCol = vec3(0.0);
    float anvA = 0.0, anvNear = 1.0;
    if (u_cbFeat.x > 0.001 && rd.y > 0.0) {
      float hor = length(rd.xz);
      float tE = rd.y / max(hor, 1e-4);
      // The plate is measured in the towers' own size, so it stays theirs
      // however near the storm. From the middle distance their tops stand
      // on a ring of radius D0; from where it stands now, at the elevation
      // its scale puts them, which is a ring pS\xB7cbS\xB7D0 out \u2014 so in the
      // towers' measure the ring is cbS\xB7D0 away and the plane 1/pS up
      float D0 = sqrt(1.0 - ceilN * ceilN) / ceilN;
      float elC = asin(ceilN) / cbS;
      float pS = cos(elC) / (sin(elC) * cbS * D0);
      float D = D0 * cbS;
      float th0 = 0.16;
      // how far downwind it reaches: about the ring's radius when mature,
      // which carries a plate from a tower upwind out over the eye
      float L = D0 * (0.50 + 0.75 * u_cbFeat.x);
      // (nothing of it lies lower in the sky than its far end, read four
      // times as deep: see below)
      if (tE * pS * (D + 0.25 * (1.5 * L + 0.3 + 0.45 * D)) > 0.85) {
        vec2 hdir = rd.xz / max(hor, 1e-4);
        // the plane a little under the top, so the band's upper edge is
        // level with the tower's flattened crown; and not quite level. Its
        // edges seen side-on are the plume's near and far margins, and
        // there the plane's depth barely moves them on screen: whatever
        // the plate does in its own plane, a band seen that way came out
        // ruled. So the plane itself is ruffled, in the sky's own angles \u2014
        // a lumpy margin along the band, as the real one's ice billows
        float und = (vnoise(vec2(azw * 9.0 * cbS, ty * 14.0) + 3.0) - 0.5) * 0.6
                  + (vnoise(vec2(azw * 23.0 * cbS, ty * 36.0) + 8.0) - 0.5) * 0.4;
        float rX = (0.90 + 0.07 * und) / (tE * pS);
        // Past the ring the plate is beyond its towers, and there the plane
        // is read four times as deep. Taken at its true depth, a plate
        // spreading away from the eye sank toward the horizon as fast as it
        // spread \u2014 half the height by the time it had gone a tower's
        // distance further \u2014 and hid behind the towers that fed it; the
        // towers stand at their angular size the way a distant one would,
        // and the plate behind them now keeps to it too: a level shelf at
        // their tops, widening as it goes. Toward the eye it is left alone,
        // so a plate blown this way still comes out overhead
        // (eased in over the first stretch past the ring: a sudden change
        // of scale there put a jog in the band's edges)
        float xD = max(rX - D, 0.0), wD = 0.3 * D;
        float rP = rX + 3.0 * (xD < wD ? xD * xD / (2.0 * wD) : xD - 0.5 * wD);
        vec2 X = hdir * rP;
        float fib = anvilFibre(X);
        float orphan;
        vec4 pl = anvilPlate(X, tE, D, 1.05 + 1.35 * cbAmt, L, th0, fib, cbS, orphan);
        if (pl.x > 0.002) {
          float sP = pl.y;
          float spread = smoothstep(0.30, 0.95, sP / L);
          // Over its tower the plate is the tower's head spread flat, and
          // still billows like it; out along the wind it is ice drawn into
          // strands. Both as how much of it lies across the ray
          float billow = fbm4(X * 5.5 + vec2(u_evo * 0.06, 0.0));
          // How much of the plate hangs over the eye: on the eye's side of
          // its towers (inside the ring), or running toward the eye from a
          // tower upwind \u2014 its underside in view, the eye looking up into
          // the plume rather than across it. Seen from under it a plate is
          // a few kilometres of ice spread over tens, and most of what is
          // overhead is its spreading reach: a veil the sky shows through,
          // drawn into strands. Taken as thick as its root, the whole of it
          // came out a flat grey ceiling over the frame. Side-on from afar
          // the eye looks along the plume, through all of it, and there it
          // keeps most of the weight it has
          float upw = dot(hdir, vec2(0.9889, 0.1483));
          float ovh = max(smoothstep(0.95 * D, 0.40 * D, rX),
                          smoothstep(0.25, 0.85, upw) * smoothstep(1.20 * D, 0.85 * D, rX));
          float dens = mix(0.85 + 0.40 * billow, (0.55 + 0.80 * fib) * (0.70 + 0.60 * billow), max(max(spread, orphan), 0.7 * ovh));
          // ice, and thin: where little of it lies across the ray the sky
          // shows through. The path through it is its thickness over the
          // sine of the elevation. And it thins faster than it narrows \u2014
          // the ice that spreads is the same ice, over more sky \u2014 the more
          // so overhead
          float thick = pl.x * pl.z;
          float tau = 60.0 * th0 * thick * mix(1.0, thick, 0.6 + 0.4 * ovh) / max(rd.y, 0.15) * dens * mix(1.0, 0.30, ovh);
          // Side-on, the eye looks along the plume through all of it, and
          // read that way the whole band came out solid: one smooth grey
          // sash across the top of the frame. But a plate seen edge-on is
          // thick only through its middle; toward its upper and lower
          // margins the ray grazes it, and downwind the ice is drawn into
          // strands with sky between them. So, side-on, the depth the ray
          // crosses falls off toward the band's margins and comes and goes
          // with the fibres out along the plume. (Side-on is what the eye
          // gets low in the sky as well, whichever side of its towers the
          // plate lies: at forty degrees up a plate spreading this way is
          // still seen more across than from under)
          float sideA = max(1.0 - ovh, 1.0 - smoothstep(0.45, 0.95, rd.y));
          tau *= mix(1.0, (0.35 + 1.30 * fib) * (0.55 + 0.45 * billow), sideA * spread)
               * mix(1.0, smoothstep(0.0, 0.85, pl.x), sideA);
          // (and its margins fade out over the last of its thickness, or
          // the plate's sides come out cut from card)
          anvA = (1.0 - exp(-tau)) * smoothstep(0.0, mix(0.30, 0.55, sideA), pl.x) * smoothstep(0.0, 0.08, rd.y);
          // Past the ring the plate runs on away from the eye, beyond the
          // towers \u2014 tens of kilometres off, read four times as deep as it
          // is (above), and that depth is what it should look: thinner and
          // further into the air the further it runs. A plume spreading
          // away behind its tower is a faint shelf over it, not a grey bar
          float beyond = smoothstep(D, D + 1.5 * L, rP);
          anvA *= 1.0 - 0.55 * beyond;
          // which face: the underside \u2014 most of what is seen of a plate
          // overhead, and the lower part of the band seen side-on \u2014 or the
          // near edge, the band's top: only what lies nearer than the
          // plume's middle, where a ray comes in through the plate's side
          // (side-on the two meet at a crease along the band, not in a grey
          // gradient down it: a bright edge over a flat dark underside)
          float under = smoothstep(mix(-0.45, -0.20, sideA), mix(0.25, 0.10, sideA), pl.w);
          float thin = 1.0 - smoothstep(0.15, 0.70, thick);

          // \u2500\u2500 The anvil's light \u2500\u2500
          // The plate is at 10\u201312 km, the tower's crowns at a few: lit by
          // the same light (cloudLight), but at its own height, so it keeps
          // the sun for minutes after the tower has lost it \u2014 the orange or
          // pink plate over a grey tower of a summer sunset
          vec3 ambient, glow, sunL, shade, moon, leaden;
          float diffuse;
          cloudLight(dayF, nightM, sunsetF, cloudSun, 1.0, ambient, glow, sunL, shade, moon, leaden, diffuse);
          float gainA = mix(1.0, 0.82, dayF);
          float lz = -dot(sunDir.xz, hdir);
          // the near edge: a wall facing the eye, lit like a crown
          vec3 edgeC = (ambient + glow + sunL * (0.38 + 0.08 * smoothstep(-0.6, 0.6, lz)) + moon * 0.7) * gainA;
          // Side-on, the edge is the plate's billowing upper margin, turned
          // up toward the sun: the brightest of it is the ice the sun falls
          // on square, which a sun above the plate's level does. The
          // billows say which parts stand up into it
          edgeC += sunL * sideA * smoothstep(-0.05, 0.35, sunDir.y) * (0.10 + 0.30 * billow) * gainA;
          // the underside faces the ground, and sees only the sky's light
          // round the horizon and what comes up off the ground and the
          // clouds below: a grey under a white edge. Thin, the light
          // through it from above brightens it \u2014 the ice is translucent.
          // And a sun near or under the horizon (as the plate sees it,
          // from 10 km) shines up under it: the underside of a sunset anvil
          // (side-on, flat and in its own shadow: darker under a bright edge)
          vec3 underC = (mix(ambient + glow, shade, mix(0.55, 0.72, sideA)) + moon * 0.3) * gainA;
          // (thin as the ray finds it, fibre by fibre, so the underside is
          // streaked light and dark rather than one even grey)
          underC = mix(underC, edgeC * 0.92, max(thin, exp(-tau * 0.35)) * mix(0.60, 0.40, sideA));
          // and thin ice toward the sun carries its light on through it, so
          // the plate is brighter on the side the sun is on
          underC += sunL * exp(-tau * 0.5) * smoothstep(-0.1, 0.8, -lz) * 0.30 * gainA;
          float lowSun = smoothstep(0.16, -0.02, sunEl);
          underC += sunL * lowSun * 0.30;

          // \u2500\u2500 Mammatus \u2500\u2500
          // Under the downwind spread of a mature anvil the cold air sinking
          // out of it bulges the underside down into pouches, a field of
          // them hanging side by side. Round domes on the underside
          // (blobPack, read on the plate's plane), each lit from below and
          // beside: bright where it bulges lowest, dark up in the necks
          // between, and the flank toward a low sun glowing in its light \u2014
          // the orange pouches of a sunset storm.
          //
          // Each a dome hanging on its own: a sparse pack, so the pouches
          // stand apart in a net of the plate's own underside. Packed close
          // the gaps between them were what showed \u2014 isolated, and dark: a
          // field of spots, not of bulges
          // (a plate cut loose has no sinking air left under it to hang them)
          float mam = smoothstep(0.55, 0.85, u_cbFeat.x) * (1.0 - orphan)
                    * smoothstep(0.12, 0.35, sP / L) * (1.0 - smoothstep(0.75, 1.0, sP / L))
                    * smoothstep(0.15, 0.40, thick) * under;
          if (mam > 0.001) {
            // (how far each bulges is read off the pack's sum, which falls
            // away smoothly between its spheres: read off the top dome's
            // height the necks came out as a net of cracks, a tortoise shell)
            vec4 pk = blobPack(X * 8.0 + vec2(u_evo * 0.05, 31.0), 0.60);
            // how far down the pouch hangs here: for a lone sphere the sum
            // is the square of 1 \u2212 d\xB2/r\xB2, and the dome's height its root;
            // the pouch's bottom faces the eye and the ground's light, its
            // sides curve up into the plate's shade
            float bulge = sqrt(sqrt(clamp(pk.x, 0.0, 1.0)));
            vec3 nP = vec3(pk.y * 0.7, -sqrt(max(1.0 - 0.49 * dot(pk.yz, pk.yz), 0.0)), pk.z * 0.7);
            float sunP = (max(dot(nP, sunDir), 0.0) + 0.35 * lowSun) * bulge;
            vec3 pouch = underC * mix(0.74, 1.18, bulge * bulge) + sunL * sunP * 0.55;
            // (in fields, not evenly over the whole underside)
            underC = mix(underC, pouch, mam * smoothstep(0.30, 0.55, billow));
          }
          anvCol = mix(edgeC, underC, under);
          // the billows and the fibres, as grain
          // (not over the pouches, which hang below the strands)
          anvCol *= mix(0.86 + 0.28 * billow, mix(0.90 + 0.20 * fib, 0.80 + 0.40 * fib, sideA), spread * (1.0 - 0.8 * mam));
          // Against the sun the plate is what the tower's rim is: where it
          // is thick, over its tower, the light has kilometres of ice to
          // cross and it goes dark; where it is thin \u2014 and most of it is \u2014
          // it glows with the sun's light carried on forward through it.
          // Further round the sky than a small cloud's (backI), or round to
          // the side of a low sun the plate was a pale lit veil laid over a
          // tower gone dark
          float backA = backI;
          if (backA > 0.0) {
            float fwd = exp(-sunAng * 5.0);
            // (as dark as the tower's own heart where it is thick, over the
            // tower, so the two read as one silhouette)
            vec3 dark = (shade * mix(0.80, 0.55, smoothstep(0.30, 0.80, thick)) + moon * 0.3) * gainA;
            vec3 rimA = mix(cloudSun, vec3(1.0, 0.86, 0.58), 0.35 * sunsetF);
            // Thin as the eye sees it: how much ice the ray itself crosses,
            // not how thick the plate is there \u2014 a plate crossed near its
            // edge, or far out where it is a veil, lets the light through.
            // Thin ice in front of the sun glows, and goes on glowing well
            // into the depth at which it would hide a disc; only thick ice
            // goes dark. Read as a straight blend between the two (and
            // floored by the plate's own thinness), a plate of middling
            // depth over the tower's crown came out a half-lit grey-brown
            // band: neither the anvil's dark nor its lining
            float thinB = smoothstep(0.05, 0.55, exp(-tau * 0.35));
            // (round to the side the ice scatters less of the light on
            // toward the eye: the glow is fainter, and keeps to the thinnest
            // of it, or the plate laid a pale lit band across a tower gone
            // dark)
            thinB *= mix(1.0, thinB, side);
            vec3 bcol = mix(dark, rimA * (1.25 + 0.9 * fwd) * mix(1.0, 0.60, side), thinB * mix(0.65, 1.0, fwd));
            anvCol = mix(anvCol, bcol, backA);
            // and a dark veil is no veil: ice the light does not come through
            // stands as solid as the tower, and where it is too little to be
            // solid it is too little to darken the sky \u2014 a half-covering of
            // dark ice laid a grey film over the crown and its lining
            anvA *= mix(1.0, smoothstep(0.30, 0.80, anvA), (1.0 - thinB) * backA);
          }
          anvCol = mix(anvCol, leaden, gloom * 0.85);
          anvCol += flash * vec3(0.75, 0.80, 1.0) * 0.45;
          // the air in front of it, as for the tower \u2014 thin up there, so
          // the sky as it stands behind the plate will do for its color
          float airA = 1.0 - exp(-(0.35 + 0.40 * u_haze) * 0.12 * (1.0 + 2.0 * beyond) / max(rd.y, 0.02));
          anvCol = mix(anvCol, disp, airA);
          // What of it stands in front of the tower and what behind: the
          // plate past the ring is beyond the tower's head, and the head
          // covers it; this side of the ring it hangs over the head. And
          // right over the tower the head itself stands in front: the plate
          // comes out from behind its crown rather than lying on it like a lid
          anvNear = smoothstep(D + 0.03, D - 0.06, rX) * smoothstep(0.06, 0.40, abs(sP));
          // (and a plate needs a tower under it: as the towers sink it thins
          // away, gone before they are)
          anvA *= smoothstep(0.20, 0.80, stand);
#ifdef FEAT_CBVOL
          // The volumetric tower's crowns stand in front of all of it. The
          // near side is laid over the head for the 2D tower, which reaches
          // the plate's plane only where it feeds it, and there the plate
          // comes out from behind its crown (sP). The march's turrets are
          // eased under the same cap but round, wide, a dome on each and the
          // lobes on that, and they stand up into the band of the plate's
          // near edge all along the row, not only at the root: laid over
          // them, the plate's lower margin cut each one off flat half way up
          // its head under a translucent grey slab, ruled along the wind by
          // its fibres. A plate nearer the eye than the ring stands higher
          // in the sky than its towers' tops, at the plane's height, and
          // where it hangs overhead there is no tower in front of it \u2014 so
          // behind the turrets, all of it
          OVER(anvCol, anvA);
          anvA = 0.0;
#else
          OVER(anvCol, anvA * (1.0 - anvNear));
#endif
        }
      }
    }

#ifdef FEAT_CBVOL
    // \u2500\u2500 The volumetric tower \u2500\u2500
    // (RendererOptions.cumulonimbus; the body is laid out by vnoise3 and
    // on.) The same gate as the 2D tower's: nothing stands under the base,
    // where no turret rises over it, or well over the turrets and the skirt
    if (!over && (headY > baseY || skTop > baseY + 0.004) && ty > baseY - 0.03) {
      float near = smoothstep(0.02, 0.24, headY);
      float skP = smoothstep(0.025, 0.06, skStood);
      // the tower's life, read at its core as the 2D field reads it
      float envL = headY + 0.6 * headY * headY - hgt;
      if (mass > 0.40 && envL > -0.15) {
        float gain0 = 1.05 + 1.35 * cbAmt;
        float massP = fbm4HQ(acir + vec2(0.0, cbClock() - CB_LAG));
        float riseN = pow(max(mass - 0.42, 0.0) * 4.6, 1.5) * gain0;
        float riseP = pow(max(massP - 0.42, 0.0) * 4.6, 1.5) * gain0;
        float here = smoothstep(0.40, 0.46, mass) * smoothstep(-0.15, -0.10, envL);
        float rel = (riseN - riseP) / max(max(riseN, riseP), 0.8);
        decay = smoothstep(0.30, 0.65, -rel) * here;
        growth = smoothstep(0.08, 0.35, rel) * here;
      }
      // (a dying tower's lobes slump: shallower, all of them)
      float lobe = max(near, skP) * (1.0 - 0.45 * decay);
      float shoot = 0.06 * smoothstep(0.60, 0.70, mass) * smoothstep(0.0, 0.15, headY - anvilTop)
                  * smoothstep(0.3, 0.7, cbAmt);

      // \u2500\u2500 The turrets, in depth \u2500\u2500
      // The tower's row and the skirt's, the four turrets nearest this
      // pixel in each: each as the 2D skyline takes it \u2014 eased
      // into a dome over the tropopause, carried up into the anvil's root
      // where it feeds one, sunk with the storm as it runs out \u2014 standing at
      // a depth of its own, the skirt's a little nearer the eye. Where the
      // ray can meet any of them is known from these alone: no nearer than
      // the nearest one's front and the most the lobes can swell it (A),
      // nor further than the furthest one's back, and not at all if no
      // turret comes within that of this pixel (fUp, which is also what the
      // glow round a backlit rim reads, with no march).
      //
      // Four, not five: a turret is at most a cell and a third across at its
      // flared foot, and the lobes reach some two fifths of a cell past it,
      // so one whose cell is centred two cells off \u2014 the fifth nearest is
      // never nearer than that, less its jitter \u2014 cannot meet the ray. Five
      // to a row read the same picture and held a fifth more of the state
      // every read of the body works from, live the whole way through the
      // tower: the shader ran a tenth slower for it
      float fp = u_cam.z / u_frame.w * cbS;
      cbLobeSetup(fp, lobe);
      g_cbQ = vec4(baseY, fp, lobe, ty);
      float A = cbLobeRest(0.0);
      float nT = ${X.toFixed(1)} * cbS, nS = ${Z.toFixed(1)} * cbS;
      float aT = mod(azT, 6.2831853) / 6.2831853;
      // (cTw: in the split variant OVER composites into the cloud stack's
      // own cT, and a local of that name here took the tower's cover off what
      // the stack lets through \u2014 the sky came through the tower whole, and
      // the tower was laid over it as light, near white)
      float cTw = aT * nT, cS = aT * nS;
      float cellT = 6.2831853 / ${X.toFixed(1)} * cosEl;
      float cellS = 6.2831853 / ${Z.toFixed(1)} * cosEl;
      float hb = min(topV * 0.5, mix(baseY, topV * 0.5, stand));
      float hs = baseY + skirt * skGain * 0.3 * stand;
      float bodyD = hb - ty;
      vec2 sw = cbSway(ty, 0.0);
      // (where the ray can meet a turret, from its own round section: the
      // stretch of depth over which the ray passes within the turret's radius
      // and the most the lobes can swell it, rather than the turret's whole
      // depth \u2014 a ray grazing a turret's side crosses only a sliver of it, and
      // marched in from its whole front it stepped all the way along the
      // flank in the small steps a grazing ray takes)
      float reach = 0.6 * A + 0.0125;
      // (the broad body's front, and the lobes' reach on before it: the body is
      // read as a distance along its own slope, which through its depth is
      // steep, so the reach is laid on in depth, not in its height \u2014 taken
      // in height, a ray started inside the body all along the foot of the
      // tower, and lit there what it found, one flat grey band)
      float fUp = bodyD, zLo = bodyD > -reach ? -sqrt(max(bodyD, 0.0) / CBV_BODYZ) - reach : 0.0, zHi = -zLo;
      // (and which way the surface the ray meets turns, across and up: each
      // turret's front face turns as far from the eye as the ray passes off
      // its axis, over its radius \u2014 and the broad body's up, less down its
      // front \u2014 weighed by how near the ray comes to each, so the turn
      // passes smoothly from one to the next where they meet. What the
      // lobes are read along: see g_cbU)
      float wU = exp(min(bodyD, 0.30) * 66.7), wSum = wU;
      vec2 uS = vec2(0.0, inversesqrt(1.0 + 80.0 * max(bodyD, 0.0))) * wU;
      // (and the glow round a backlit rim its own reading of the same: see
      // aura, below)
      float fA = bodyD;
      float wT = fract(cTw - 0.5), wS = fract(cS - 0.5);
      for (int j = 0; j < 4; j++) {
        vec4 t = cbTurret(floor(cTw - 0.5) + float(j - 1), cTw, nT, 1.0, cellT);
        float yk = t.y;
        float hv = clamp(0.5 + 0.5 * (capV - yk) / 0.10, 0.0, 1.0);
        yk = mix(capV, yk, hv) - 0.05 * hv * (1.0 - hv);
        yk = mix(yk, max(yk, anvilTop), feed * smoothstep(anvilTop - 0.20, anvilTop - 0.08, yk));
        yk = min(yk, mix(baseY, yk, stand));
        vec4 T = vec4(t.x, yk - max(CBV_DOME * yk, t.z / CBV_HEAD), (t.w - 0.5) * CBV_ZT, t.z);
        float dx = sw.x - T.x, dy = max(ty - T.y, 0.0) * cbHead(T, 0.0), d2 = dx * dx + dy * dy;
        vec3 R = vec3(d2, T.w * (1.0 + CBV_FLARE * cbFlare(T.y - ty)), cbLean(ty, T, 0.0) - sw.y);
        if (j == 0) { g_cbT0 = T; g_cbR0 = R; } else if (j == 1) { g_cbT1 = T; g_cbR1 = R; }
        else if (j == 2) { g_cbT2 = T; g_cbR2 = R; } else { g_cbT3 = T; g_cbR3 = R; }
        fUp = max(fUp, R.y - sqrt(d2));
        fA = max(fA, R.y - sqrt(d2) - 0.30 * (j == 0 ? wT : j == 3 ? 1.0 - wT : 0.0));
        float re = R.y + reach;
        if (re * re > d2) { float h = sqrt(re * re - d2); zLo = min(zLo, R.z - h); zHi = max(zHi, R.z + h); }
        wU = exp(min(R.y - sqrt(d2), 0.30) * 66.7);
        vec2 uT = vec2(dx, dy) / R.y;
        uS += uT / max(length(uT), 1.0) * wU; wSum += wU;
      }
      // (the skirt's turrets only where they can reach: nothing of a turret
      // stands higher than its own top, skMax at most, and over it the field
      // falls away at least as fast as the height climbs \u2014 and the light's
      // taps all climb from here toward a sun over the horizon. Higher up the
      // tower they stand nowhere, and are not looked up \u2014 with room to spare:
      // the bare body under a lobe can sit a few hundredths inside the
      // surface, and a turret melted into it from just under that reach
      // still moved it, a line ruled across the tower where they dropped out)
      g_cbS0 = g_cbS1 = g_cbS2 = g_cbS3 = vec4(0.0, -10.0, 0.0, 0.001);
      g_cbK0 = g_cbK1 = g_cbK2 = g_cbK3 = vec3(1.0, -1.0, 0.0);
      g_cbSkY = ty < skMax + reach + 0.08 ? skMax + reach + 0.08 : -10.0;
      if (g_cbSkY > 0.0) for (int j = 0; j < 4; j++) {
        vec4 t = cbTurret(floor(cS - 0.5) + float(j - 1), cS, nS, 2.0, cellS);
        float yk = baseY + t.y * stand;
        vec4 T = vec4(t.x, yk - max(CBV_DOME * (yk - baseY), t.z / CBV_HEAD), -CBV_ZS + (t.w - 0.5) * CBV_ZT, t.z);
        float dx = sw.x - T.x, dy = max(ty - T.y, 0.0) * cbHead(T, baseY), d2 = dx * dx + dy * dy;
        vec3 R = vec3(d2, T.w * (1.0 + CBV_FLARE * cbFlare(T.y - ty)), cbLean(ty, T, baseY) - sw.y);
        if (j == 0) { g_cbS0 = T; g_cbK0 = R; } else if (j == 1) { g_cbS1 = T; g_cbK1 = R; }
        else if (j == 2) { g_cbS2 = T; g_cbK2 = R; } else { g_cbS3 = T; g_cbK3 = R; }
        fUp = max(fUp, R.y - sqrt(d2));
        fA = max(fA, R.y - sqrt(d2) - 0.30 * (j == 0 ? wS : j == 3 ? 1.0 - wS : 0.0)
                     - 0.30 * smoothstep(g_cbSkY - 0.06, g_cbSkY, ty));
        float re = R.y + reach;
        if (re * re > d2) { float h = sqrt(re * re - d2); zLo = min(zLo, R.z - h); zHi = max(zHi, R.z + h); }
        wU = exp(min(R.y - sqrt(d2), 0.30) * 66.7);
        vec2 uT = vec2(dx, dy) / R.y;
        uS += uT / max(length(uT), 1.0) * wU; wSum += wU;
      }
      // (melted together, the turrets stand a little past the tallest one.
      // And the lobes reach A only where every scale of them is at its
      // highest at once, which none is for long: three fifths of it bounds
      // all but the rarest floret, and over a band round the whole tower
      // the march is a good deal shorter for it)
      // (the bare body's own reach, before that: how far inside its outline
      // this pixel is, which the lining and the margins read)
      float bare = fUp;
      fUp = min(fUp + 0.6 * A + 0.0125, ty - baseY);
      g_cbP = vec4(hb, anvilTop + shoot, smoothstep(0.0, 0.5, feed), 1.0 / cellT);
      g_cbBody = hb - ty;
      g_cbN = vec3(dirc.x * cbS, 0.0, dirc.y * cbS);
      g_cbTg = vec3(dirc.y, 0.0, -dirc.x);
      g_cbRad = vec3(dirc.x, 0.0, dirc.y);
      uS /= wSum;
      g_cbU = g_cbTg * uS.x + vec3(0.0, uS.y, 0.0);
      float ceilR = g_cbP.y - ty;
      g_cbY = vec3(ceilR, mix(1.0, smoothstep(0.02, 0.10, ceilR), g_cbP.z), ty - baseY);
      g_cbM = g_cbN + vec3(0.0, ty, 0.0);

      // \u2500\u2500 A mixed edge \u2500\u2500
      // As the 2D tower's (see there): how soft the outline is here, sv, 0
      // crisp to 1 soft \u2014 crisp toward the crown and on a growing tower,
      // soft low down, on the skirt, under the ceiling and on a dying one,
      // and broken up along the outline by a slow noise. It widens the fade
      // at the silhouette (wE, a width in storm units: two or three pixels at
      // its crispest \u2014 any less, and a pixel on the outline flipped on and off
      // as the tower drifted) and lets the sky through the thin of a soft margin.
      // (The noise read through the texture filter: here it only says how
      // wide a fade a few pixels wide is, which its steps cannot move by a
      // fraction of a pixel, and read exactly it was eight fetches a pixel)
      float edgeN = vnoise(cyl * 2.0 + vec2(3.7, 1.3)) * 0.6 + vnoise(cyl * 4.4 + vec2(11.0, 5.0)) * 0.4;
      float upT = smoothstep(0.35, 0.90, (ty - baseY) / max(topV - baseY, 0.02));
      float underC = g_cbP.z * smoothstep(0.10, 0.0, anvilTop - ty);
      float skW = smoothstep(0.0, 0.03, hs - hb + 0.02) * (1.0 - near);
      float sv = clamp(0.30 + 0.35 * (1.0 - upT) + 0.20 * skW + 0.45 * decay - 0.25 * growth
                       + 0.30 * underC + (smoothstep(0.30, 0.70, edgeN) - 0.5) * 1.2, 0.0, 1.0);
      float wE = fp * (2.6 + 4.0 * sv);

      // \u2500\u2500 The florets \u2500\u2500
      // Past the surface's two scales the cauliflower goes on in the light
      // alone, as the 2D tower's does past its finest lobes: its buds
      // (budPack), octave after octave down to a few pixels across \u2014 the
      // same packed florets turning over at a fold a pixel or so wide, read in
      // the same sky (cyl), drifting up as the lobes do. Each tilts the
      // face (lean, along the azimuth and up) and its gaps are recesses
      // (rec), seeing less of the sky and of the light scattered round
      // inside the cloud.
      //
      // And on the outline they stand out against the sky, as the 2D
      // tower's finest lobes fray its silhouette: each bud is a dome as
      // high as half its cell, falling away to its rim as its own squared
      // fall-off (bump: the domes of every octave stacked, in storm units),
      // which the fade at the outline reads as that much more cloud. No
      // steeper than that: where a dome climbed faster than the outline
      // falls away, its top stood out past the outline on its own, a speck
      // of cloud in the sky. Taken from the two scales of surface alone the
      // outline was a smooth, rolling line a lobe or two across, where the
      // 2D tower's is cauliflower down to a few pixels; and taken as more
      // scales of surface, the march could not find their rims to within a
      // pixel, and they sparkled as they drifted. Read in the sky, as the
      // light reads them, they stand still on the screen but for their
      // drift, and the fade a few pixels wide takes them in smoothly. (Less
      // on a soft margin, which has its own thin, ragged edge. And only on
      // the outline against the sky: laid on the edge of a turret in front
      // of another too, it took the light from the face behind to the edge
      // in front over a ragged band where the march's nearest pass came and
      // went, and the seams sparkled)
      float fpc = u_cam.z / u_frame.w * length(cyl) / sqrt(max(1.0 - rd.y * rd.y, 1e-4));
      vec2 wfB = cyl - dirc * (u_evo * 0.026);
      // (and under a storm's gloom, which takes all but a sixth of the
      // tower's own light, not at all)
      vec2 lean = vec2(0.0);
      float rec = 0.0, bump = 0.0;
      float budW = lobe * (1.0 - smoothstep(0.5, 0.9, gloom));
      // (how far off the outline the march must look: the fade, and the
      // most the florets can stand out past it \u2014 the octaves' domes of a
      // cell at most fifty pixels high stacked, at their highest at once.
      // They are read only once the march says the ray came that near:
      // read for every ray the march takes, a band a lobe's reach wide
      // round the whole tower read them for nothing)
      float bumpS = 0.55 * fp * (1.0 - 0.6 * sv) * budW;
      float wF = wE + 51.0 * bumpS;

      // \u2500\u2500 Softness \u2500\u2500 (features.softness: 0 the cauliflower, 1 toward
      // cotton candy)
      // A cumulus's surface is not a skin but the last hundred metres or so
      // over which its droplets thin out into the air, and how sharply they
      // thin is the difference between a crisp, freshly risen head and the
      // soft, airy look of an older or more mixed one. Drawn as a surface
      // alone, every lobe was a hard-edged lump lit as a solid: the outline
      // a clean line, every fold a crease, every floret a bump. So the
      // surface is given a shell sW deep (storm units: a sixth of a coarse
      // lobe at the full softness, thinner where the edge is crisp, sv),
      // which the outline fades across \u2014 the sky showing through its thin
      // outer part \u2014 and the light reads it as the fuzzy medium it is: the
      // near taps see the surface through a wider window, so the shadows a
      // lobe casts on the next soften; the face turns with less of the lobes'
      // slope and more of the body's, as the gradient of a blurred density
      // does; the light wraps further round, and more of it reaches the folds
      // after scattering. Lobes stay lobes, only less modelled
      float soft = u_cbFeat.w;
      // (Not under a storm's gloom, though, which hides the shell as it
      // hides the florets: there the leaden mass is soft already, and the
      // shell's wider march cost a dark tower a tenth of its frame for
      // nothing to see)
      float sW = soft * 0.014 * (0.7 + 0.6 * sv) * (1.0 - smoothstep(0.5, 0.9, gloom));
      float wEs = wE + 0.4 * sW;
      // (and the march must look that much further out: the shell, and the
      // most its tufts push it out, below)
      wF += 1.4 * sW;
      //   fib   the shell's tufts (below), 0..1, mean a half
      //   thin  how far out in the shell the ray passes: 0 on the surface or
      //         inside it, 1 at its outer edge
      float fib = 0.5, thin = 0.0;

      float m = 0.0, zL = 0.0, zF = 0.0, cF = 0.0, crack = 0.0;
      if (fUp > -wF) {
        // \u2500\u2500 The march \u2500\u2500
        // In from the near side, a step at a time by about as far as the
        // surface can be (the field is a distance to it, the lobes' slopes
        // aside), the lobes read through the texture filter. The nearest the
        // ray comes to the surface is kept: a ray that grazes the outline
        // without meeting it is the fade at the silhouette
        //
        // ...and so is the nearest it came to a turret in front before it
        // met the one behind (gmax, at zg: the last step it was still
        // closing on the surface before it drew off again). That is the
        // front one's edge, inside the outline, and it wants the same fade
        // the outline has: taken pixel by pixel as met or missed, the edge
        // between a turret and the one behind it stepped a whole pixel at a
        // time as the tower drifted, the whole contrast between a lit face
        // and a shaded one changing at once. So the edge in front fades over
        // the face behind across the few pixels the outline fades over (cF,
        // how much of the edge shows: see the light).
        //
        // The base is no part of where the ray meets the body, only of how
        // much of it shows: flat, ruled across the tower, it is the same
        // height all along the ray, and cut into the field the march read
        // there a ray just under it came within a hair of the surface the
        // whole way through, and crawled the length of the tower in its
        // finest steps
        //
        // Where that nearest pass lies is read off the parabola through the
        // step before, the step itself and the one after, not off the step:
        // a floret's edge is a few steps deep, and the steps fall at depths
        // that slide as the tower does, so the nearest step to the edge came
        // nearer and drew off again from frame to frame and the fade along
        // the edge sparkled
        float z = zLo, zp = z, fpv = -1.0, fmax = -1.0, zmax = z;
        float gmax = -1.0, gdip = 0.0, zg = z, zpp = z - 0.003, fpp = -1.0;
        bool hit = false;
        for (int i = 0; i < 28; i++) {
          if (z > zHi) break;
          float f = cbRayLobes(cbRayBare(z), z);
          if (f > fmax) { fmax = f; zmax = z; }
          if (f > 0.0) { hit = true; break; }
          if (f < fpv && fpv > gmax) {
            gmax = fpv; gdip = f;
            float d1 = max(zp - zpp, 1e-5), d2 = max(z - zp, 1e-5);
            float s1 = (fpv - fpp) / d1, s2 = (f - fpv) / d2;
            float cv = (s2 - s1) / (d1 + d2), sl = (s1 * d2 + s2 * d1) / (d1 + d2);
            zg = clamp(zp - sl / min(2.0 * cv, -1e-5), zp - d1, zp + d2);
          }
          gdip = min(gdip, f);
          zpp = zp; fpp = fpv;
          zp = z; fpv = f;
          // (finely where the ray grazes the surface, so the nearest it comes
          // is read to within a little of a pixel: read coarsely, the fade at
          // the outline stepped as the tower grew, and its pixels popped)
          z += max(-f * 0.6, f > -4.0 * wE ? 0.003 : 0.006 + 0.0006 * float(i));
        }
        // A ray that runs out of steps still short of the far side, well
        // inside the outline, is one threading a fold between two turrets
        // a hair off both: the cloud is there, a little further in. Taken
        // as a miss, the sky showed through the tower in cracks
        if (!hit && z < zHi && bare > 0.02) { hit = true; zp = z; fpv = -0.001; fmax = 0.0; }
        zL = zmax;
        if (hit) {
          // just crossed the skin: find where, between this step and the
          // last, halving three times and reading the crossing off the line
          // between the two ends \u2014 left wherever a step happened to land, the
          // surface sat at a different depth from one pixel to the next and
          // the light on it came out in contour lines
          float za = zp, fa = fpv, zb = z, fb = fmax;
          for (int j = 0; j < 2; j++) {
            float zm = mix(za, zb, clamp(-fa / max(fb - fa, 1e-5), 0.1, 0.9));
            float fm = cbRay(zm);
            if (fm > 0.0) { zb = zm; fb = fm; } else { za = zm; fa = fm; }
          }
          zL = mix(za, zb, clamp(-fa / max(fb - fa, 1e-5), 0.0, 1.0));
          fmax = 0.0;
          // (the edge in front, read exactly as the outline is, and faded
          // over the outline's own few pixels \u2014 not its soft shell's as
          // well: a band that wide round every turret's edge was a band
          // whose own inner and outer edges came and went as the tower
          // drifted, and twinkled down every seam.
          //
          // And only as far as the ray drew off from the edge before it met
          // the face behind (gdip, the least it read between them): where
          // two turrets melt into one another, the ray passes the one in
          // front, dips a hair and climbs straight on into the other \u2014 that
          // is no edge, only a fold, and lit as an edge for as long as the
          // march could tell the dip, it was one up to a point and gone past
          // it, a seam that broke off short and flickered where it ended)
          if (gmax > -wE) {
            float dip = gmax - gdip;
            gmax = cbRay(zg);
            cF = smoothstep(-wE, 0.0, gmax) * smoothstep(0.0, 0.5 * wE, dip);
            zF = zg;
          }
        }
        // (two octaves of them, the coarser the first under 40 pixels a
        // cell \u2014 fading out from 27, as the finer fades in from 9 to 13,
        // where the next octave down takes over from it as it leaves \u2014 so a
        // near or narrow view gets finer florets, not bigger ones: two
        // octaves fixed at the coarse end left a close view of the tower
        // with nothing under twenty pixels. Three, from five pixels to
        // forty-six, cost a tenth of the tower's whole frame for florets
        // the eye takes for the two)
        if (hit || fmax > -wF) {
          float k0 = max(0.0, ceil(log(1.0 / (40.0 * 7.6 * fpc)) * 1.3478));
          for (int j = 0; j < 2; j++) {
            float k = k0 + float(j);
            float fq = 7.6 * pow(2.1, k);
            float cellPx = 1.0 / (fpc * fq);
            float wB = smoothstep(9.07, 13.0, cellPx) * (1.0 - smoothstep(27.0, 40.0, cellPx)) * budW;
            if (wB > 0.0) {
              vec3 bud = budPackQ(wfB * fq + vec2(k * 37.1 + 5.3, 11.3), max(fpc * fq * 1.6, 0.18 * soft), dirc);
              lean += bud.xy * ((0.75 - 0.12 * float(j)) * wB);
              rec += bud.z * (0.14 * wB);
              float q = max(1.0 - sqrt(bud.z), 0.0);
              bump += q * q * cellPx * (wB / max(budW, 1e-3));
            }
          }
          // The shell's tufts: two octaves of smooth noise read in the same
          // drifting sky as the florets, four to nineteen pixels a cell and
          // eased across from one octave to the next as the florets' are, so
          // a closer view gets finer tufts, never a pop. Smooth, not ridged:
          // ridged noise drew the fringe as hair, a caterpillar's fur round
          // the tower. Only ever a modulation of how much the shell holds and
          // of the face's brightness, never a surface the march must find \u2014
          // taken as surface, a scale this fine sparkled as it drifted
          float fw = 0.0, fs = 0.0;
          if (soft * budW > 0.0) for (int j = 0; j < 2; j++) {
            float fq = 7.6 * pow(2.1, k0 + 1.0 + float(j));
            float c = 1.0 / (fpc * fq);
            float w = smoothstep(4.3, 9.07, c) * (1.0 - smoothstep(9.07, 19.05, c));
            fs += vnoise(wfB * fq + vec2(23.7 * (k0 + float(j)), 3.1)) * w; fw += w;
          }
          fib = fw > 0.0 ? fs / fw : 0.5;
          // (and the florets turn the face less: their folds are blurred
          // across a tenth of a cell as well, budPackQ's kc, so they stay as
          // a soft dappling rather than a pavement of little domes)
          lean *= 1.0 - 0.6 * soft;
          rec = clamp(rec, 0.0, 1.0);
          bump *= bumpS;
        }
        if (!hit && fmax > -wE - bump - 1.4 * sW) {
          // (a ray that grazed the outline: how near it came, read exactly.
          // Through the filter the nearest pass moved in its steps as the
          // lobes drifted, and the fade at the outline with it)
          zL = gmax >= fmax ? zg : zmax;
          fmax = cbRay(zL);
        }
        // The fade at the outline, across the shell as well (fo: how near
        // the ray came, the florets' domes counted in). Its tufts move the
        // shell's edge in and out a little \u2014 only once the ray is clear of
        // the surface itself, so a ray that meets it is still the whole
        // cloud \u2014 and mostly thin it or thicken it in place: pushed out by
        // as much as the shell is deep, the tufts stood off the tower as
        // specks of cloud in the sky, where a density that only thins can
        // never leave anything past the shell's edge
        float fo = fmax + bump;
        fo += (fib - 0.5) * 0.8 * sW * smoothstep(0.0, -0.5 * sW, fo);
        thin = smoothstep(0.0, -wE - sW, fo);
        m = smoothstep(-wE - sW, 0.0, min(fo, g_cbY.z)) * clamp(1.0 + (fib - 0.5) * 3.0 * thin, 0.0, 1.0);
        // A ray that passes inside a turret's bare column and still misses
        // has only gone through a crease the lobes cut through the column's
        // edge, where nothing stood behind it: a crack of sky, a pixel or two
        // wide, down a seam of the tower. The lobes' creases are folds in the
        // surface, not slots through it, so it is cloud, lit as the surface
        // the ray came nearest (but not lined: see behind). Not where the
        // cap under a spreading anvil or the base cuts the columns: a ray
        // there misses them rightly. (And it is the cloud's body, not its
        // shell: taken by how far it passed off the surface for the shell's
        // thin outer edge, it was lit through, toward the sun and the sky,
        // and the crease came out a jagged streak of sky-blue and white down
        // the middle of the tower)
        if (!hit) {
          crack = smoothstep(0.003, 0.015, min(mix(bare, min(bare, g_cbY.x), g_cbP.z), g_cbY.z));
          m = max(m, crack);
          thin *= 1.0 - crack;
        }
      }
      // just outside a backlit rim the tower's last wisps, too thin to see,
      // scatter the sun forward into a glow hugging the silhouette \u2014 read off
      // how near the ray could come to it, and laid under the tower.
      //
      // Read three tenths out, which is further than the turrets this pixel
      // looks up are exact: the four nearest in a row are, out to a cell
      // and a half, and the march needs no more \u2014 but the glow reaches out
      // past that, and as the next turret along took the place of the one
      // two cells off, the nearest the ray came jumped by a tenth or two
      // where the glow was still half on. Against a high sun, round to the
      // side of a turret, it was a pale panel laid over the blue, ruled
      // off up the sky where the window moved on and across it where the
      // skirt's turrets stop being looked up. So the glow reads the turrets
      // from fA: the same distances, each of the two at the ends of the
      // window drawn off by the whole of the glow's reach as it nears
      // leaving (the skirt's too as the height they stop at comes up),
      // and it falls to nothing under the base and where no turret
      // stands, before the tower stops being read there at all
#ifdef FEAT_BACKLIT
      float aura = smoothstep(-0.30, 0.0, min(fA + 0.6 * A + 0.0125, 10.0 * (ty - baseY)))
                 * smoothstep(0.0, 0.02, max(headY - baseY, skTop - baseY - 0.004)) * (1.0 - m) * auraW;
      if (aura > 0.001) {
        OVER(rimC * 1.2, aura * 0.45);
      }
#endif
      if (m > 0.001) {
        vec3 P = vec3(0.0, ty, zL);
        // the sun in the column's frame: across it (along the azimuth), up,
        // and on through it away from the eye
        vec2 hz = normalize(rd.xz + vec2(1e-5, 0.0));
        vec3 Ls = vec3(dot(sunDir.xz, vec2(hz.y, -hz.x)), sunDir.y, dot(sunDir.xz, hz));

        // \u2500\u2500 The light's way in \u2500\u2500
        // Beer\u2013Lambert along the way to the sun, read at five distances \u2014 a
        // floret's, a lobe's, two a turret's and the tower's \u2014 each standing for
        // the stretch before it, each read softer the further off it is (a
        // cone rather than a line: the shadow of a lobe a long way toward the
        // sun is a soft one) and with only the scales that can still tell at
        // that distance. A point on a bulge's sunward side looks out into the
        // sky at every one of them and is lit; one in the fold behind it
        // looks through the bulge and is not. That is the cauliflower's
        // modelling \u2014 bright domes over blue folds \u2014 which no tilt of a
        // painted normal gave. (The long ones count for less than their
        // length: over a turret's width the light has scattered round
        // whatever lobe stood in its way.)
        //
        // The nearest of them lie within a hundredth or two of the surface,
        // where it is as good as the plane it touches: they read the body off
        // that plane (F, the whole body and its slope where the ray met it).
        // A lobe off, the bare body is still the plane it touches here (B),
        // with the coarse lobes laid on it; only a turret's width or more
        // toward the sun, where the other turrets are what stands in the way,
        // is the bare body read whole
        vec4 B, F;
        vec4 tn = cbNear(zL, Ls, wEs, false, B, F);
        // (The longer ones read fewer scales than they could: the finer
        // lobes swell the surface by no more than a fifth of the window the
        // turret-wide tap reads it through, and the coarse ones by a fifth of
        // the tower-wide one's \u2014 what they hold back is the same to within a
        // shade, at two scales of noise fewer a pixel. The lobe-wide one, and
        // the sky's a lobe up, read the coarse scale alone: the fine one is
        // half a lobe across and swells the surface by a third of their
        // window, and the light it gave them is the florets' business)
        float t3 = smoothstep(-0.050, 0.050, cbFinish(B.x + 0.120 * dot(B.yzw, Ls), P + Ls * 0.120, 1.0, 0.050));
        float t4 = smoothstep(-0.120, 0.120, cbFinish(cbBare(P + Ls * 0.300), P + Ls * 0.300, 0.0, 0.120));
        // ...and whether another turret stands behind this one, a few
        // hundredths further along the ray (the bare turrets). How near the
        // outline this is (bare) is how near the ray passes the turrets'
        // axes, which is small along the seam where a turret in front meets
        // one behind as well as at the true outline: there the margin let
        // the sky through, and the lining lit up, in thin lines down the
        // inside of the tower. (Read off the turrets as bodies, which the
        // light holds anyway: read along the ray, as the march reads them,
        // the march's own numbers had to be kept to here, and the whole
        // shader ran a sixth slower for the room they took.) Only near the
        // outline: everything that reads it is gone 0.07 inside
        float behind = bare < 0.07 ? smoothstep(-0.02, 0.04, cbBare(P + vec3(0.0, 0.0, 0.06))) : 1.0;
        behind = max(behind, crack);
        // Where the edge of a turret in front fades over the face of one
        // behind (cF), the light is read on both \u2014 the face behind, where
        // the ray met it, and the edge, where the ray passed nearest it \u2014
        // and the readings blended by how much of the edge shows: a soft
        // cloud's edge over another, lit as each is. The point the light
        // was read at used to slide from the one to the other through the
        // air between them, where neither surface is: in the crease the
        // taps found the edge overhanging it and the faces either side
        // turned away from the eye, and every seam was drawn in a thin dark
        // or light line, a pixel or two wide, that the softer tower's
        // softer turns round it left plain to see. Only the near reading is
        // taken twice (the turret-wide taps and the tower-wide one see the
        // same tower from either point, near enough), and the edge's only
        // across the few pixels it fades over
        if (cF > 0.0) {
          vec4 B1, F1;
          vec4 tf = cbNear(zF, Ls, wEs, true, B1, F1);
          tn = mix(tn, tf, cF);
          B.yzw = mix(B.yzw, B1.yzw, cF);
          F.yzw = mix(F.yzw, F1.yzw, cF);
        }
        // (out in a soft shell the light has little cloud to cross, toward
        // the sun or the sky: the fringe is lit through, not shaded)
        float tau = CBV_SIGL * (tn.x + 0.040 * t3 + 0.080 * t4) * (1.0 - 0.6 * thin);
        float ambVis = exp(-CBV_SIGA * (0.07 * tn.y + 0.04 * tn.z) * (1.0 - thin));
        float alphaV = 1.0 - exp(-CBV_SIGV * (0.003 + 0.020 * tn.w));

        // \u2500\u2500 Its light \u2500\u2500
        // The palette is the 2D tower's (cloudLight), at the same authored
        // level: a face lit square by the sun about its head's white, the
        // shade the sky's light, blue-grey, and less of it in the folds
        vec3 ambient, glow, sunL, shade, moon, leaden;
        float diffuse;
        cloudLight(dayF, nightM, sunsetF, cloudSun, 0.3, ambient, glow, sunL, shade, moon, leaden, diffuse);
        float gain = mix(1.0, 0.82, dayF);
        // (the sky a face turned from a low sun sees is the far side of it,
        // the dim one: against the sun the mass goes dark, in the shade's
        // color, as the 2D tower's does.) With the sun down the sky's light
        // is all there is, and the tower takes it as the 2D one does, half
        // way to the shade's, the moon's a light share of it: lit by the
        // whole sky and most of the moon, a tower at night came out as
        // light as the glow over the horizon behind it, and stood in it
        // as nothing at all
        vec3 sky3 = mix(mix(ambient + glow, shade, 0.6 * (1.0 - dayF)), shade * 0.75, backT);
        vec3 deep = shade * mix(0.80, 0.50, backT);
        vec3 tcol = mix(deep, sky3, ambVis) + moon * (0.1 + 0.2 * ambVis);
        // The face's own turn, off the plane F gives: which way it looks (n:
        // across, up, toward the eye negative). The sky's light comes from
        // above, so a face turned up sees more of it than one turned down \u2014
        // what still models a floret the sun does not reach, and the taps,
        // all of them a floret or more off, cannot tell from one pixel to
        // the next; and the sun's falls off across a dome as it turns away,
        // past the terminator the taps find (wrapped, as a cloud's light is,
        // through its outer hundred metres). So every lobe keeps a lit cap and
        // a dimmer flank even where nothing stands between it and the sun:
        // read off the taps alone, a face square to the sun was one flat white
        float gl = length(F.yzw);
        vec3 nrm = gl > 1e-4 ? -F.yzw / gl : vec3(0.0, 0.0, -1.0);
        nrm = normalize(nrm + vec3(dot(lean, vec2(dirc.y, -dirc.x)), dot(lean, dirc), 0.0));
        // (the sun's fall-off across a dome read off the face half turned
        // back toward the eye: a cloud's rim is its thin outer skin, lit
        // through rather than shaded as a ball's limb is, and taken edge-on
        // every turret's rim came out a dark line drawn round it)
        // (softer, it wraps further round: the outer hundred metres it is
        // lit through are deeper in a fuzzy cloud, and the turn modelled
        // less by the face's own nrm.y and its florets' recesses)
        float wrap = smoothstep(-0.55 - 0.25 * soft, 1.05 + 0.10 * soft, dot(normalize(nrm + vec3(0.0, 0.0, -1.0)), Ls));
        tcol *= (0.84 + (0.40 - 0.10 * soft) * nrm.y) * (1.0 - 0.5 * (1.0 - 0.5 * soft) * rec);
        // The sun's share: what comes straight through, and what comes after
        // scattering many times over, as a second and a third much fainter
        // extinction \u2014 what keeps a fold a luminous grey rather than a hole,
        // and lights the shade side a little. The phase is two Henyey\u2013
        // Greenstein lobes, forward (g 0.6) and back (\u22120.3), normalised to
        // a face lit from the side: the back lobe is the near-white of a face
        // lit from behind the eye. Only a share of it on the dense faces,
        // where the light has scattered too often to remember its way in
        float cosT = dot(rd, sunDir);
        float hgF = 0.64 / pow(1.36 - 1.2 * cosT, 1.5);
        float hgB = 0.91 / pow(1.09 + 0.6 * cosT, 1.5);
        float ph = mix(hgF, hgB, 0.35) / 0.537;
        float Tsun = exp(-tau);
        // (a softer cloud's light diffuses further into its folds: the
        // first of the many-times-scattered terms dies off more slowly)
        float ms = 0.55 * exp(-(0.12 - 0.04 * soft) * tau) + 0.20 * exp(-0.03 * tau);
        // the powder look: the thin outer skin scatters less of the light
        // back than the cloud under it, a slightly darker rim just inside a
        // sunlit edge \u2014 only where the light comes from the eye's side
        float powder = mix(1.0, 0.75 + 0.25 * alphaV, 1.0 - smoothstep(-0.2, 0.6, cosT));
        // (and in the shade the light scattered many times over is most of
        // what there is: the 2D tower's shaded faces carry a third of the
        // sun's light, the luminous blue-white of a sunlit tower's shadow
        // side. Read off the taps' extinction alone the lower body, under
        // the heads that shade it from a high sun, sank into a flat dark
        // grey band; so the shade takes more of the scattered light the
        // less of the direct it has. And not only the light the taps let
        // through after many scatterings: the 2D tower's shade carries a
        // third of the sun's light whatever stands over it, and read off
        // the taps alone the vol's body under its heads stood a good tenth
        // greyer than the 2D tower's from the foot to half way up. So the
        // shade has a floor of the scattered light, less where the sky is
        // shut out \u2014 a fold keeps its depth)
        tcol += sunL * (0.48 * Tsun * mix(0.15 + 0.10 * soft, 1.0, wrap) * mix(1.0, ph, 0.25) + ((0.13 + 0.55 * (1.0 - Tsun)) * ms + 0.28 * (1.0 - Tsun) * (0.4 + 0.6 * ambVis)) * (1.0 - 0.35 * rec))
              * powder * (1.0 - diffuse * 0.75);
        // and where the cloud is thin enough that the light comes on through
        // it toward the eye: the silver lining, hottest by the disc. Thin is
        // the outermost of the outline \u2014 the lobes standing out past the bare
        // turrets, and the skin over them \u2014 where the light scattered on
        // forward has little cloud left to cross; a few taps toward the sun
        // find the thin skin there but not the forward-scattered glow that
        // spreads a little way in from it, so that is laid on by how near
        // the outline is
        float rimW = (1.0 - smoothstep(-0.01, 0.05, bare)) * (1.0 - behind);
        // (and the soft shell is outermost of all: as thin as cloud gets)
        rimW = max(rimW * rimW, thin * (1.0 - behind));
        tcol += rimC * min(hgF / 0.40, 8.0) * (0.10 * Tsun * (1.0 - alphaV * 0.85) + 0.10 * rimW * exp(-0.12 * tau))
              * (1.0 - diffuse);
        // (a soft face is fleecy rather than bumpy: the tufts that fray its
        // shell dapple its light a little, a few pixels across)
        tcol *= gain * (1.0 + (fib - 0.5) * 0.18 * soft * (1.0 - thin));

        // Less light reaches lower down a column kilometres thick than any
        // few taps can find: it comes in at the top and the sun side and is
        // spent on the way down. So, as the 2D tower does, the color sinks
        // toward the sky-lit base \u2014 but only over the foot of the cloud, the
        // last few hundred metres over the base in the shadow of the rest.
        // Run over the lower half and more, as it was, the whole body sank
        // into one long smooth grey band under white heads
        float cloudH = max(max(topL, skTop) - baseY, 0.04);
        float depth = 1.0 - smoothstep(baseY, baseY + min(cloudH * 0.30, max((anvilTop - baseY) * 0.35, 0.10)), ty);
        depth = mix(depth, 1.0 - smoothstep(baseY, baseY + (skTop + 0.02 - baseY) * 0.6, ty), skW);
        vec3 base = (mix(ambient, shade, 0.5) + moon * 0.3) * gain;
        tcol = mix(tcol, base, depth * depth * 0.8);
        // and right over the base the underside itself, flat and turned away
        // from the sky: the darkest band of the whole cloud
        float under = 1.0 - smoothstep(baseY, baseY + min(0.028, cloudH * 0.25), ty);
        tcol = mix(tcol, deep * gain * 0.95, under * 0.70);
#ifdef FEAT_BACKLIT
        // \u2500\u2500 Against the sun \u2500\u2500 (as the 2D tower's: see there)
        // The face turned this way is in the tower's own shadow, and what
        // comes through it has crossed kilometres of cloud: the mass goes
        // dark in the shade's color, its florets still told apart by which
        // way each turns to the sun, and only the rim \u2014 the outermost of the
        // outline, where the light has little cloud left to cross \u2014 blazes in
        // the sun's own color. Read off the taps alone a tower over a low sun
        // came out a flat lavender-grey, the multiply scattered light the
        // taps let through lighting the whole face evenly. With the sun round
        // to the side the lining keeps to the edge that faces it, and the
        // flank turned to the sun takes it straight, gold over the shade
        if (backT > 0.0) {
          // how far the light had to come: deep in the outline and low down
          // (bare, how far inside the turrets this is), less in a fold
          float through = clamp(smoothstep(0.0, 0.10, bare) * (0.62 + depth * 0.35) - (1.0 - ambVis) * 0.30, 0.0, 1.0);
          vec3 dark = (shade * mix(0.95, mix(0.55, 0.66, side), through) + moon * 0.3) * gain;
          float latL = max(length(Ls.xy), 1e-3);
          float toSun = dot(nrm.xy, Ls.xy) / latL;
          dark *= mix(0.84, 1.16, smoothstep(-0.45, 0.60, toSun)) * mix(0.72, 1.0, ambVis);
          float fwd = exp(-sunAng * 5.0);
          // the turrets' own turn, with no lobe on it: the flank's side
          float bl = length(B.yzw);
          vec3 nB = bl > 1e-4 ? -B.yzw / bl : vec3(0.0, 0.0, -1.0);
          float edgeS = dot(normalize(nB.xy + vec2(1e-4, 0.0)), Ls.xy / latL);
          float margin = (1.0 - smoothstep(0.0, 0.06, bare)) * (1.0 - behind);
          float rimB = (1.0 - smoothstep(-0.01, 0.07, bare)) * (1.0 - behind);
          // (the soft shell's tufts are lining too, the sun through them)
          rimB = max(rimB * rimB, thin * (1.0 - behind)) * mix(0.70, 1.0, fwd);
          rimB *= mix(0.55, 1.0, smoothstep(-0.45, 0.60, toSun)) * mix(0.70, 1.0, ambVis);
          rimB *= mix(1.0, smoothstep(-0.15, 0.70, edgeS), side);
          dark += cloudSun * fwd * fwd * 0.25 * (1.0 - through * 0.7);
          vec3 bcol = mix(dark, rimC * (1.7 + 0.8 * fwd), rimB);
          float facing = max(edgeS, 0.0);
          // (Every turret has a flank turned to the sun, where the 2D tower
          // has the one, its outermost: so a turret's takes the sun only as
          // far as the light gets to it past the turrets standing between
          // it and the sun, which the taps read. Taken off its own turn
          // alone, the inner turrets' flanks lit up as broad, smooth gold
          // fields the color of the sky round the sun, and read as the sky
          // showing through the tower in arches. And its florets still turn
          // it, as they turn the shade round it)
          float flank = side * max(smoothstep(0.45, 0.85, smoothstep(-0.32, 0.48, dot(nB, Ls))) * smoothstep(0.10, 0.55, Tsun),
                                   margin * smoothstep(0.05, 0.45, facing));
          vec3 litF = (shade * 0.35 + sunL * (0.80 + 0.40 * facing) + moon * 0.3) * gain
                    * mix(0.62, 1.0, smoothstep(-0.30, 0.70, dot(nrm, Ls))) * (1.0 - 0.6 * rec);
          bcol = mix(bcol, litF, flank * (1.0 - rimB));
          tcol = mix(tcol, bcol, backT);
        }
#endif
        tcol = mix(tcol, leaden, gloom * 0.85);
        tcol += flash * vec3(0.75, 0.80, 1.0) * 0.55;

        // \u2500\u2500 Aerial perspective \u2500\u2500 (as the 2D tower's)
        vec3 airCol = skyWeather(airSky, dayF, gloom);
#ifdef FEAT_BACKLIT
        airCol = mix(airCol, mix(ambient, cloudSun, mix(0.55, 0.30, side)) * gain, backT);
#endif
        float far = mix(1.6, 1.0, smoothstep(0.20, 0.60, max(topL, skTop - baseY)));
        float airD = mix(pow(cbS, 0.6), 1.0, smoothstep(baseY, ceilN, ty));
        float air = 1.0 - exp(-(0.35 + 0.40 * u_haze) * 0.12 * far * airD / max(rd.y, 0.02));
#ifdef FEAT_BACKLIT
        air = mix(air, min(air * mix(1.0, 0.55, side), 0.55), backT);
#endif
        tcol = mix(tcol, airCol, air);

        // the thin of a soft margin lets the sky through; a crisp one, a
        // sunlit head's, stands solid to its outline. And the last low
        // remnant of a storm that is running out thins away (see cbLive)
        // (only at the outline itself: a thin edge well inside it has more of
        // the tower behind it, and through it the sky showed as cracks)
        // (and never where the march met a turret behind the edge it passed)
        m *= mix(1.0, alphaV, (0.3 + 0.7 * sv) * (1.0 - smoothstep(0.0, 0.03, bare)) * (1.0 - behind) * step(cF, 0.0));
        m *= smoothstep(0.03, 0.35, stand);
        cbMask = clamp(m, 0.0, 1.0);
        OVER(tcol, cbMask);
        cbCol = tcol;
        cbBack = backT;
      }
    }
#else
    // Where neither row stands above the base, and under the base itself,
    // there is nothing to draw \u2014 the envelope tops out at the base, and the
    // anvil's flare is gated on the head \u2014 so the whole lobe stack, the
    // costliest thing in the shader, is skipped there. Under the base is
    // most of a framed shot, and that more than pays for the turrets
    if (!over && (headY > baseY || skTop > baseY + 0.004) && ty > baseY - 0.03) {
      // only let the lobes act where a tower stands. Otherwise a single
      // sphere clears the threshold even in open sky away from any tower, and
      // a white bubble floats there on its own. Read off the turrets'
      // skyline, not the thrust here: a turret reaching over a stretch where
      // the thrust is low would otherwise stand bald
      float near = smoothstep(0.02, 0.24, headY);
      // the skirt's own field: its top less the height, a little steeper
      // than the tower's, with the same lobes laid on it. Kept solid in its
      // lower half, so every turret stands on the base
      float skH = max(skTop - baseY, 1e-3);
      // (a turret too low to tower over its own base is no congestus, only a
      // flat grey smear along the horizon: none at all, then. Judged by the
      // height it stood to before the storm began to sink: sinking, it goes
      // down with the towers and thins away with them, rather than being
      // dropped on its own as it passes that height)
      float skP = smoothstep(0.025, 0.06, skStood);
      // Every lobe below is laid on scaled by near or by skP, so where no
      // turret stands near and no skirt stands either they add nothing: the
      // field is the bare envelope, too far under the edge to draw (m is 0
      // there, and nothing is shaded), and once clear of the base the base's
      // fray cannot cut it. Yet against the sun that field is still read, for
      // the glow round the rim (aura) \u2014 over the whole lower sky on the
      // sun's side. So there the lobes are not read at all
      bool lobes = near > 0.0 || skP > 0.0 || ty < baseY + 0.04;
      // the mass itself. A domain-warped 2D field does double duty as both
      // silhouette bumpiness and internal grain.
      // warping is meant to break up the overall shape. Applying the same
      // amount at every scale stretches even fine lumps in the same direction,
      // reading as a diagonal smear.
      // weaken the distortion the finer the scale, to keep it round
      vec2 warp = vec2(0.0);
      // The middle lobes are read first where they push the flanks out
      // (flank, below), before anything else is known; elsewhere only once
      // the ray is known to come near the cloud
      vec3 pMid = vec3(0.0);
      vec4 kMid = vec4(0.0, 0.0, 1.0, 0.0);
      vec2 dW = vec2(0.0);
      // How much of the sky a pixel spans, in the lobes' cylinder: the
      // pixel's angle (pxA) times the cylinder's own scale there, which is
      // conformal \u2014 |cyl| over cos(elevation) a radian, either way. The
      // folds between the lobes are drawn a pixel or so wide off it, and the
      // florets laid on below are as fine as it allows
      float pxA = u_cam.z / u_frame.w;
      float fpc = pxA * length(cyl) / sqrt(max(1.0 - rd.y * rd.y, 1e-4));
      const float FOLD = 1.6;
      // (only where the push can tell: not where no turret stands near, and
      // not where the skyline already stands so far over the cap that the
      // cap takes it whatever the push does)
      bool flank = near > 0.0 && headY < capV + 0.10;
      if (flank) {
        warp = vec2(fbm4(cyl * 1.5 + u_evo * 0.30),
                    fbm4(cyl * 1.5 + 31.0 - u_evo * 0.25));
        dW = lobeWobble(cyl + 0.42 * warp);
        pMid.x = lobePack((cyl + 0.42 * warp + dW) * 1.55 + 13.0, 0.78, fpc * 1.55 * FOLD, dirc, kMid);
      }
      float bMid = pMid.x;
      // \u2500\u2500 Lobes on the flanks \u2500\u2500
      // A turret's flank is steep, and the lobes laid on below as a lift and
      // a dent in height barely move a steep flank sideways: the flanks came
      // out smooth walls. So the row is read once more with the azimuth
      // pushed one way or the other by the middle lobes \u2014 a lobe swells the
      // flank by its own round shape wherever the push is toward the turret
      // \u2014 and the taller of the two kept: a bulge, never a bite, so nothing
      // on the flank comes loose. Over a level head the push barely changes
      // the height, so it lifts no scraps off it
      if (flank) {
        float headB = turretRow(azT + (bMid - 0.60) * 0.06 / (cosEl * cbS), ${X.toFixed(1)}, 1.0, cosEl, cbS);
        headY = max(headY, mix(headY, min(headB, mix(baseY, headB, stand)), near));
      }
      // Nor does a turret run on far past the tropopause. Under an anvil
      // the ceiling below flattens it into the plate; a tower with no
      // anvil keeps its head round (see the tropopause, below), and there
      // the leading turret, its neighbors slumped, stood up past the
      // ceiling alone as a finger. So the skyline is eased into a dome
      // over the tropopause instead: a little over it at the tower's core,
      // where its thrust is strongest, sinking to it toward the flanks \u2014
      // rounded over, never cut flat (capV, above)
      float hv = clamp(0.5 + 0.5 * (capV - headY) / 0.10, 0.0, 1.0);
      headY = mix(capV, headY, hv) - 0.05 * hv * (1.0 - hv);
      // The envelope: positive under the turrets' skyline, zero on it \u2014 the
      // old "thrust \u2212 height", with the turrets standing in for the thrust
      float envT = headY + 0.6 * headY * headY - hgt;
      // The tower's life (see decay, above), read only on and near the
      // tower itself: nothing outside it has a use for it
      if (mass > 0.40 && envT > -0.15) {
        float gain0 = 1.05 + 1.35 * cbAmt;
        float massP = fbm4HQ(acir + vec2(0.0, cbClock() - CB_LAG));
        float riseN = pow(max(mass - 0.42, 0.0) * 4.6, 1.5) * gain0;
        float riseP = pow(max(massP - 0.42, 0.0) * 4.6, 1.5) * gain0;
        float here = smoothstep(0.40, 0.46, mass) * smoothstep(-0.15, -0.10, envT);
        // Measured against the tower's own size, and dying only once it
        // has lost a good part of itself: read as a bare difference, a big
        // tower moved past the threshold at the least change, so every one
        // was either climbing or sinking \u2014 half the storm dying at any
        // moment, and a tower soft and slumped from the moment it passed
        // its peak. A grown tower holds its height a while; it is the
        // shrinking remnant of one, late in its life, that wastes away
        float rel = (riseN - riseP) / max(max(riseN, riseP), 0.8);
        decay = smoothstep(0.30, 0.65, -rel) * here;
        growth = smoothstep(0.08, 0.35, rel) * here;
      }
      // (a dying tower's lobes slump: shallower, all of them)
      near *= 1.0 - 0.45 * decay;

      // \u2500\u2500 The anvil's column \u2500\u2500
      // The anvil itself is a plate of its own (anvilPlate, laid below), but
      // it has to stand on something: a turret that reaches the tropopause
      // under a plate carries its column on up to it, where the ceiling
      // below flattens it into the plate's root. Only where a turret got
      // near \u2014 a column raised over the notch between two turrets, above
      // the lower one's head, stands in open sky. (It used to lift the air
      // in a window under the cap instead, and wherever that left the air
      // just short of cloud the lobes broke it into a spray of crumbs.)
      float flareA = 0.0;
      if (feed > 0.001) {
        flareA = feed * smoothstep(anvilTop - 0.20, anvilTop - 0.08, headY);
        float headF = mix(headY, max(headY, anvilTop), flareA);
        envT = max(envT, headF + 0.6 * headF * headF - hgt);
      }
      // \u2500\u2500 The tropopause \u2500\u2500
      // Nothing climbs past it, so the envelope is capped there: a ceiling
      // meeting the turrets in a rounded shoulder. Capped before the lobes
      // are laid on, so they ruffle it as they do a head \u2014 cut after them,
      // it left their tips standing clear of it as a spray of crumbs over the
      // anvil. It falls away twice as steeply as a head does: the anvil's top
      // is a broad flat, and the thin crust a head's slope leaves under its
      // edge, laid that wide, the lobes' dents still broke into crumbs.
      //
      // \u2500\u2500 Overshooting top \u2500\u2500
      // Over the strongest updraft of a mature tower the air coasts on past
      // the tropopause before it sinks back: a small dome stands over the
      // flat of the anvil. Only over the very core of the thrust, where the
      // mass stands highest \u2014 every turret of a grown tower reaches past the
      // tropopause, and lifting the ceiling under all of them only raised
      // the whole anvil \u2014 and only where a turret actually got there
      float shoot = 0.06 * smoothstep(0.60, 0.70, mass) * smoothstep(0.0, 0.15, headY - anvilTop)
                  * smoothstep(0.3, 0.7, cbAmt);
      //
      // But only where the anvil is spreading. A tower that has no anvil
      // to give its top to keeps the rounded head its turrets give it,
      // and may stand a little proud of the tropopause the way a strong
      // updraft carries one: capped all the same, a grown tower with no
      // anvil read as a mesa, its crown cut flat against an empty sky
      float ceilT = (anvilTop + shoot - ty) * 3.8;
      float hc = clamp(0.5 + 0.5 * (ceilT - envT) / 0.12, 0.0, 1.0);
      float capW = smoothstep(0.0, 0.5, feed);
      envT = mix(envT, mix(ceilT, envT, hc) - 0.12 * hc * (1.0 - hc), capW);
      hc = mix(1.0, hc, capW);
      float fieldS = (skTop - ty) * 2.5 - 0.03 - (1.0 - skP) * 0.4;
      // \u2500\u2500 Clear of the tower \u2500\u2500
      // Where the envelope, capped, has fallen below the edge by more than
      // any lobe can lift it (they swell only within a band of it) and the
      // skirt's has too, the ray meets no cloud: the lobes need not be read
      // at all. Most of a tower's column above its crown is that, and the
      // lobes are the dearest thing in the shader. (Against the sun, again,
      // out to where the glow round the rim can still show)
      float fieldU = max(envT, fieldS);
      if (fieldU > -0.08 || ty < baseY + 0.60 * skH || auraW * smoothstep(-0.90, -0.11, fieldU) > 0.001) {
        // the silhouette is cut from a sum of spheres (round lobes). But spheres
        // have zero high-frequency content, so alone the silhouette becomes an
        // endlessly smooth blob and detail disappears.
        // layer high-frequency noise at small amplitude to fray the edge while keeping the lobes round.
        // the two just handle different sizes \u2014 neither can be dropped.
        // lobes need at least 3 scales. With only 2, zooming in reveals no new
        // structure, just a stretched-out smear.
        // cauliflower looking "still cauliflower no matter how close you get" is
        // because the same shape repeats in a nested way.
        // kept separate per scale since shading shifts each one differently.
        // Each is read as a pack as well as a sum (lobePack): the sum for the
        // silhouette, the pack for the face's light. (There was a coarser
        // scale still, of lobes wider than a turret, read only for shading;
        // its smooth swells and the soft pools of shadow read off them were
        // most of the airbrushed putty the tower had become, and it is gone \u2014
        // the turrets carry that size, and the tower's own turn its light)
        // (unread where they cannot act, above: the values left there make no
        // fray at the base)
        if (lobes && !flank) {
          warp = vec2(fbm4(cyl * 1.5 + u_evo * 0.30),
                      fbm4(cyl * 1.5 + 31.0 - u_evo * 0.25));
          dW = lobeWobble(cyl + 0.42 * warp);
          pMid.x = lobePack((cyl + 0.42 * warp + dW) * 1.55 + 13.0, 0.78, fpc * 1.55 * FOLD, dirc, kMid);
          bMid = pMid.x;
        }
        vec2 wf = cyl + 0.14 * warp;   // fine scale
        vec3 pFine = vec3(0.0), pMicro = vec3(0.0);
        vec4 kFine = vec4(0.0, 0.0, 1.0, 0.0), kMicro = vec4(0.0, 0.0, 1.0, 0.0);
        float fine = 0.47, wisp = 0.5;
        if (lobes) {
          pFine.x  = lobePack(wf * 3.60 + 41.0, 0.74, fpc * 3.60 * FOLD, dirc, kFine);
          // a fourth octave: real cauliflower is bumps-on-bumps down past what the
          // eye can separate \u2014 stopping at three reads as sculpted foam. Each
          // octave roughly halves the size and the weight
          pMicro.x = lobePack(wf * 7.60 + 97.0, 0.72, fpc * 7.60 * FOLD, dirc, kMicro);
          fine = fbm(wf * 5.5);

          // a very fine fray at the edge. Riding this inside the blurred alpha
          // band gives a "blurry, yet detailed" edge. Cheap: just two vnoise calls
          wisp = vnoise(wf * 13.0) * 0.62 + vnoise(wf * 27.0 + 7.0) * 0.38;
        }
        float bFine = pFine.x, bMicro = pMicro.x;
        // The lobes ride on the turrets as bumps on bumps, each scale laid on
        // the surface the scale above it left (lobeLayer): a floret can only
        // sit on a lobe, and a lobe only on the turret. Each is centered on its
        // own mean, so the surface swells and dents about the turret rather
        // than inflating past it. The coarse octave is left out: a coarse lobe
        // is wider than a turret, and laid on one it only swells the whole cap
        // evenly \u2014 the turrets carry that scale now
        // (no swellings on the anvil's flat: over a top that broad every gap
        // between them let one stand clear as a crumb \u2014 there they only dent)
        float field = lobeLayer(envT, (bMid - 0.60) * near, 0.07, 0.05, hc);
        float fineN = (bFine - 0.54) * 0.82 + (fine - 0.50) * 0.72;
        // (and the same surface with the florets laid on at three quarters
        // and no grain: where the edge goes soft, see the mixed edge below)
        float fieldM = lobeLayer(field, fineN * 0.75 * near, 0.05, 0.035, hc * 0.5);
        field = lobeLayer(field, fineN * near, 0.05, 0.035, hc * 0.5);
        field = lobeLayer(field, ((bMicro - 0.51) * 0.48 + (wisp - 0.50) * 0.22) * near, 0.03, 0.02, 0.5);
        // \u2500\u2500 No floating fragments \u2500\u2500
        // However tight the band, a lobe the noise raises over a dip in it can
        // still stand clear of the surface: a small grey puff with sky under
        // it. So the middle lobes are read once more a lobe's height lower, and
        // where there would be open sky there, nothing raised here may stand
        // more than a sliver above it. A swelling on the mass has the mass
        // under it and passes; only a piece with sky beneath goes
        float yB = ty - 0.03;
        float yBr = rd.y - 0.03 / cbS;
        vec2 cylB = dirc * (2.6 * cbS * sqrt((1.0 + yBr) / max(1.0 - yBr, 0.045)));
        float envB = envT + hgt - (yB + 0.6 * yB * yB);
        // (and only where it can cut: the lobes there dent no deeper than
        // 0.05, so a field already under envB \u2212 0.01 is left as it is, and so
        // is one the floor below lifts past it)
        if (field > envB - 0.01 && field > (envT - 0.12) * 2.0) {
          float bMidB = lobesS((cylB + 0.42 * warp + dW) * 1.55 + 13.0, 0.78);
          float fieldB = lobeLayer(envB, (bMidB - 0.60) * near, 0.07, 0.05, hc);
          field = min(field, fieldB + 0.04);
        }
        // a little way inside, the mass must stay solid however the dents add
        // up: sky showing through the middle reads as moth-eaten holes (the
        // real thing is kilometres thick; only its rim is translucent). A floor
        // under the field rather than a lift: lifting it pushes the silhouette
        // out to a contour of the bare envelope, and the flanks go bald
        field = max(field, (envT - 0.12) * 2.0);
        fieldS = lobeLayer(fieldS, (bMid - 0.60) * skP, 0.08, 0.04, 1.0);
        float fieldSM = lobeLayer(fieldS, fineN * 0.75 * skP, 0.05, 0.035, 0.5);
        fieldS = lobeLayer(fieldS, fineN * skP, 0.05, 0.035, 0.5);
        fieldS = lobeLayer(fieldS, ((bMicro - 0.51) * 0.48 + (wisp - 0.50) * 0.22) * skP, 0.03, 0.02, 0.5);
        float skBase = smoothstep(0.60, 0.15, (ty - baseY) / skH) * 0.50 * skP;
        fieldS += skBase;
        // the two are one cloud: whichever reaches further
        float skW = smoothstep(-0.10, 0.10, fieldS - field);
        field = max(field, fieldS);
        // and nothing below the base. A nearly straight line, frayed only a
        // little by the finest grain \u2014 a base is ragged at close range, but
        // from where this is seen it is ruled across the tower
        float baseFray = (wisp - 0.50) * 0.010 + (fine - 0.47) * 0.016;
        field = min(field, (ty + baseFray - baseY) * 25.0);
        // the edge should fade thin, not cut sharp \u2014 a sharp cut reads as a
        // pasted-on cutout. But too wide a band wraps the whole mass in fog and
        // the cloud never reads as a solid object: photos show a sunlit head
        // whose boundary is crisp with only a thin frayed fringe. Keep the band
        // narrow, and let wisp/fine (already folded into field) supply the fraying.
        //
        // The envelope only climbs about 1.5 a radian, so where the lobes lie
        // smooth over it the old ramp spread a fifth of a radian wide: whole
        // caps went glassy, the sky showing through them. So the ramp is read
        // off a steepened field, and it is all but done at the silhouette \u2014
        // the fade is outside it; inside, the cloud is opaque at once
        // (crisper yet on a young tower; a dying one's edge goes soft, the
        // sky showing through its wasting margins)
        //
        // How wide the fade is, though, is better said on the screen than in
        // the field. Across the silhouette the field climbs some 25 a radian
        // where the lobes lie on it (a few where the bare envelope makes the
        // edge, well over a hundred along a floret's rim), and more as a
        // storm stands further off and its lobes come smaller on screen; at
        // the resolution a background is drawn at, that band was under a
        // pixel along most of a tower's lobes \u2014 a cut-out \u2014 and a cut that
        // falls between two pixels flips one of them on and off as the tower
        // drifts and grows: the head's edge crawled. So the fade is a width
        // in pixels, turned into the field's measure by how much field a
        // pixel of the edge typically crosses here (slope; the base's ruled
        // line, a climb of 25, is steep wherever it is).
        //
        // And how wide, in the sky: a sunlit head is crisp, a couple of
        // pixels at 1080p; down the flanks and toward the foot the cloud is
        // older and more mixed with the air round it, its edge more diffuse;
        // a storm further off is behind more air, and softer still. Never
        // under two or three pixels at the typical slope (the steepest rims
        // get about one even so), nor narrower than the band always was.
        //
        // The fade starts where it always did, just outside the silhouette,
        // and widens inward \u2014 the cloud is opaque a few pixels in, not at
        // once. Its outer edge stays where it stood, so no lobe that stood
        // clear of it before (under the cut that keeps fragments from
        // floating free) shows now as a faint ghost over the sky beside it.
        // And it widens only so far, the steep and the gentle alike, or
        // where the field happens to climb slowly a cap goes glassy again
        float upE = smoothstep(0.20, 0.90, (ty - baseY) / max(headY - baseY, 0.02));
        float soft = mix(mix(2.0, 1.15, upE), 1.25, skW) * (1.0 - 0.2 * growth) + 1.2 * decay;
        float slope = pxA * cbS * max(25.0 * pow(cbS, -0.4) * (0.35 + 0.65 * mix(near, skP, skW)),
                                      25.0 * (1.0 - smoothstep(0.0, 0.04, ty - baseY)));
        float widePx = max(0.0016 * min(soft, 2.6) * pow(cbS, 0.4) / pxA, 2.5);
        float lo = -0.0275 + 0.0075 * growth - 0.03 * decay;
        float bandC = clamp(slope * widePx, 0.0425 - 0.01125 * growth + 0.03 * decay, 0.10 + 0.03 * decay);
        float m = smoothstep(lo, lo + bandC, field);
        // \u2500\u2500 A mixed edge \u2500\u2500
        // Cut that way the whole outline was one line: crisp, a pixel or two
        // of ramp all round, every lobe a cut-out. A real thunderhead's edge
        // is mixed. A young head boiling up in the sun is crisp, but along
        // the rest of the outline the cloud is thinning into the air round
        // it \u2014 evaporating at its margins, older and more mixed down the
        // flanks and toward the foot, glaciating into a fibrous fringe up
        // under the tropopause, and dying all round once the tower decays \u2014
        // and there the edge is a margin, not a line: thin cloud, the sky
        // showing through it, frayed. So how soft the edge is (sv, 0 crisp
        // to 1 soft) is read along the outline: soft low on the tower,
        // crisp toward its crown, softer on the skirt, under the ceiling and
        // on a dying tower, crisper on a growing one \u2014 and broken up by a
        // slow noise a lobe or two across, so neighbouring stretches of one
        // outline differ: one lobe crisp, the next feathered.
        //
        // The soft edge is cut from a field of its own (fieldSoft): the
        // surface with the florets laid on at three quarters and without the
        // grain. It climbs from the silhouette more slowly than the lobed
        // field, whose fine octaves make it steepest just where the edge
        // falls \u2014 read off that, any fade stayed a pixel wide however wide
        // it was asked to be. Read off the gentler one, the fade spreads a
        // few pixels in, and what of the grain and the florets' tips stood
        // beyond it comes out as thin cloud. It is a width on the screen
        // (and, close up, a width in the sky, so a near tower's soft margin
        // does not shrink to a pixel line), and it only ever thins what the
        // crisp cut drew \u2014 the silhouette stays where it stood, so no lobe
        // the cut kept from floating free returns as a ghost.
        //
        // Nor may it spread far: where both fields climb slowly a wide fade
        // turned whole florets glassy, the sky through them. So it is also
        // complete by the time the lobed field has climbed three crisp
        // fades in (teC).
        //
        // Inside the margin a fibrous noise eats into the fade \u2014 gaps between
        // strands, deepest at the outer edge, none where the cloud turns
        // solid \u2014 stretched a little along the horizon, as evaporating and
        // icing fringes are. Only ever into it, so it frays the margin and
        // lifts nothing off it; and only at a scale the screen can hold (a
        // strand under a few pixels flickers as the tower drifts), its finer
        // octave giving way first.
        //
        // All of this is the edge's alone, and only read near it: deeper in
        // the fade is done whatever sv says, and nothing here is needed
        float fieldSoft = min(max(max(fieldM, (envT - 0.12) * 2.0), fieldSM + skBase), (ty + baseFray - baseY) * 25.0);
        float bandW = cbS * max(pxA * 48.0, 0.06);
        float teC = (field - lo) / (bandC * 3.0);
        float te = max((fieldSoft - lo) / (bandW * 1.6), teC);
        float sv = 0.0, fr = 0.5;
        if (field > lo && te < 1.5) {
          float edgeN = vnoiseHQ(wf * 2.0 + vec2(3.7, 1.3)) * 0.6 + vnoiseHQ(wf * 4.4 + vec2(11.0, 5.0)) * 0.4;
          // (how far up the whole tower, not up this turret: at a turret's
          // own edge its head is always just here)
          float upT = smoothstep(0.35, 0.90, (ty - baseY) / max(topV - baseY, 0.02));
          sv = clamp(0.30 + 0.35 * (1.0 - upT) + 0.20 * skW + 0.45 * decay - 0.25 * growth + 0.30 * (1.0 - hc)
                     + (smoothstep(0.30, 0.70, edgeN) - 0.5) * 1.2, 0.0, 1.0);
          te = max((fieldSoft - lo) / (bandW * (0.4 + 1.2 * sv)), teC);
          // the strands: the cylinder's radius stretched about the horizon's,
          // so they run along it half again as long as they stand tall
          float rC = length(cyl);
          vec2 fib = dirc * (2.6 * cbS + (rC - 2.6 * cbS) * 1.6) * 22.0 + warp * 0.6;
          float frPx = 1.0 / (22.0 * 2.6 * cbS * pxA);
          fr = vnoiseHQ(fib + 5.0) * 0.6
             + (vnoiseHQ(fib * 2.3 + 29.0) - 0.5) * 0.4 * smoothstep(2.0, 5.0, frPx / 2.3) + 0.2;
          float teF = te - 1.6 * smoothstep(2.5, 6.0, frPx) * smoothstep(0.35, 0.80, fr) * (1.0 - clamp(te, 0.0, 1.0));
          m = min(m, mix(1.0, smoothstep(0.0, 1.0, teF), sv));
        }
        // the last low remnant of a storm that is running out thins away
        // rather than standing solid to its final sliver (see cbLive)
        m *= smoothstep(0.03, 0.35, stand);
        // how deep inside the cloud this is, for the shading's rim terms (the
        // lining, the margin, how far the crease shadows reach). The field
        // itself only climbs slowly inward from the silhouette, and inside it
        // still carries the kinks where two turrets meet; read raw, the rim
        // terms spread across whole faces and drew those kinks as vertical
        // seams down the tower. Steepened, and lifted well below the head,
        // where the mass is solid however the lobes lie
        float depthIn = field * 2.0
                      + 1.15 * smoothstep(1.0, 0.60, ty / max(headY, 1e-3)) * smoothstep(-0.05, 0.10, field);

        // just outside a backlit rim the air is not empty: the tower's last
        // wisps, too thin to see, scatter the sun forward into a soft glow that
        // hugs the silhouette. Laid under the tower, so the mass covers its inside
#ifdef FEAT_BACKLIT
        float aura = smoothstep(-0.90, -0.11, field) * (1.0 - m) * auraW;
        if (aura > 0.001) {
          OVER(rimC * 1.2, aura * 0.45);
        }
#endif

        if (m > 0.001) {
          // \u2500\u2500 The sun in the tower's own frame \u2500\u2500
          // A face of the tower seen from here has three directions that
          // matter: along the azimuth (sideways on screen), up, and out toward
          // the eye. The sun's share of each decides the lighting: lt and lu
          // are how hard it rakes across the face \u2014 that is what models the
          // lobes \u2014 and lz is whether it falls on the face we see (> 0, the sun
          // behind the eye) or on the far side (< 0, against the sun). A high
          // sun is nearly all lu: it lights the top of every bulge and leaves
          // the flanks and undersides grey. A low sun off to one side is all
          // lt: it lights the sunward flank of every lobe and of the whole tower
          vec2 hz = normalize(rd.xz + vec2(1e-5, 0.0));
          float lt = dot(sunDir.xz, vec2(hz.y, -hz.x));
          float lu = sunDir.y;
          float lz = -dot(sunDir.xz, hz);
          float lat = length(vec2(lt, lu));
          // in cylindrical coordinates dirc is "up" and its perpendicular runs
          // along the azimuth, so this is the sun's direction across the face
          vec2 tangent = vec2(dirc.y, -dirc.x);
          // \u2500\u2500 The face, floret by floret \u2500\u2500
          // The lobes are read as a pack (lobePack): at each point the one
          // in front lends the face its normal, and where it gives way to the
          // next the face turns over across a fold a pixel or so wide. Each
          // scale tilts the face of the one above it, bumps on bumps (their
          // sideways parts summed, so a floret leans out of the side of its
          // lobe), each a little less than the one above.
          //
          // Below the finest lobes the florets go on (budPack), octave after
          // octave, for as long as a floret is a few pixels across: the
          // detail stays about as dense on the screen however large the
          // tower stands, and a near tower gets more florets, not bigger and
          // smoother ones. Each octave is faded in from three pixels a cell to
          // six, so it arrives without a step as the tower draws nearer or the
          // view narrows \u2014 and the number read changes only with the camera,
          // never from one frame to the next. None of them moves the outline;
          // the grain the silhouette is frayed with stands in for them there.
          vec2 lean = kMid.xy * 1.00 + kFine.xy * 0.68 + kMicro.xy * 0.50;
          // how much of the point is a recess: a gap in a scale's pack, where
          // the cloud deeper in shows through \u2014 the coarse gaps only a little,
          // being broad: darkened as hard they were grey blots on the face
          float rec = kMid.z * 0.18 + kFine.z * 0.32 + kMicro.z * 0.28;
          for (int k = 0; k < 3; k++) {
            float fq = 16.3 * pow(2.1, float(k));
            float cellPx = 1.0 / (fpc * fq);
            if (cellPx < 3.0) break;
            float wB = smoothstep(3.0, 6.0, cellPx);
            vec3 bud = budPack(wf * fq + vec2(float(k) * 37.1 + 5.3, 11.3), fpc * fq * FOLD, dirc);
            lean += bud.xy * ((0.27 - 0.05 * float(k)) * wB);
            rec += bud.z * (0.06 * wB);
          }
          rec = clamp(rec, 0.0, 1.0);
          // into the tower's frame: along the azimuth, and up
          vec2 nL = vec2(dot(lean, tangent), dot(lean, dirc));
          // and the middle lobes' alone, for what reads the face a lobe's rim
          // turns to the sun (the lining's side, the margin's powder): the
          // florets' tilt flickers there as a scatter of lit specks
          vec2 nLB = vec2(dot(kMid.xy, tangent), dot(kMid.xy, dirc)) * 0.6;

          // \u2500\u2500 The tower's own roundness \u2500\u2500
          // The envelope rise \u2212 hgt \u2212 1 is the tower with its lobes shaved off:
          // positive inside, zero on the silhouette. Read either side of here
          // along the azimuth, and once a little higher, it says where in the
          // column this point stands \u2014 near the sunward flank, the far flank,
          // the crown, or square in the middle. Turned into a normal, that is a
          // column seen side-on: the face looks at the eye in the middle and
          // turns sideways toward the flanks and upward at the crown. That
          // gives the mountain as a whole a sun side and a shade side, which no
          // amount of per-lobe shading can: lobes alone average out to an even
          // speckle over a face wider than themselves.
          //
          // The thrust is a function of azimuth alone, so anything read off it
          // paints vertical bands. The two samples sit well apart (a fifth of a
          // radian each way), so the fine octaves of the thrust average out and
          // only a tower's real flanks turn the face
          float dA = 0.22;
          float gainR = 1.05 + 1.35 * cbAmt;
          float dAs = dA / cbS;
          float massW = fbm4HQ(vec2(sin(azw - dAs), cos(azw - dAs)) * (0.85 * cbS) + vec2(0.0, cbClock()));
          float massS = fbm4HQ(vec2(sin(azw + dAs), cos(azw + dAs)) * (0.85 * cbS) + vec2(0.0, cbClock()));
          // (clamped at the silhouette: past it the ratios below would read
          // empty sky as a flank)
          //
          // All of it reasons in the bare reach, before cbShape bent it into
          // the crown, so the height is taken back there first
          float yN = cbUnshape(ty, ceilN);
          float hgtN = yN + 0.6 * yN * yN;
          float yU = yN + 0.10;
          float envX = pow(max(mass - 0.42, 0.0) * 4.6, 1.5) * gainR - hgtN - 1.0;
          float envE = max(envX, 0.0);
          float envW = max(pow(max(massW - 0.42, 0.0) * 4.6, 1.5) * gainR - hgtN - 1.0, 0.0);
          float envS = max(pow(max(massS - 0.42, 0.0) * 4.6, 1.5) * gainR - hgtN - 1.0, 0.0);
          float envU = max(envE + hgtN - (yU + yU * yU * 0.6), 0.0);
          vec2 outN = vec2((envW - envS) / (envW + envS + 0.15),
                           (envE - envU) / (envE + envU + 0.12));
          outN *= min(1.0, 0.95 / max(length(outN), 1e-3));
          // a turret the noise pushed well out beyond the envelope is a lump
          // of its own, not a piece of the column's flank: the neighbors'
          // envelopes say nothing about which way it faces, so it looks at the
          // eye and its own domes model it
          outN *= smoothstep(-0.50, -0.05, envX);
          vec3 nT = vec3(outN, sqrt(max(1.0 - dot(outN, outN), 0.0)));

          // the florets ride on that face, each tilting it (nL). The tower's
          // own turn is kept, but at less than the florets' weight: it gives
          // the mountain a sun side and a shade side, and taken stronger it
          // was most of what the eye saw \u2014 a smooth gradient across a smooth
          // mass, the airbrush
          vec3 n = normalize(vec3(nT.xy * 0.8 + nL, nT.z));
          vec3 nB = normalize(vec3(nT.xy * 1.3 + nLB, nT.z));
          vec3 sunT = vec3(lt, lu, lz);
          float ndl = dot(n, sunT);

          // less light reaches lower down the tower. Reference a slowly-varying
          // height, not the turrets' skyline \u2014 that changes abruptly at a
          // turret's flank and paints vertical light/dark seams down the mass.
          // Measured up from the base against how tall the cloud here is: the
          // thrust's height (or the skirt's, for a congestus), not the
          // tropopause's \u2014 a small tower or a skirt turret all within the
          // tropopause's reach of shade came out a dark grey lump on the
          // horizon, where its sunlit head should stay as white as the tower's.
          // Only over the foot of it, though: run over the lower 60% of the
          // cloud, as it was, the whole body sank into one long airbrushed
          // gradient from a grey middle to a dark foot. A sunlit tower is
          // white most of the way down; it is the last few hundred metres
          // over the base, in the shadow of the rest, that go grey
          float cloudH = max(max(topL, skTop) - baseY, 0.04);
          float depth = 1.0 - smoothstep(baseY, baseY + min(cloudH * 0.30, max((anvilTop - baseY) * 0.35, 0.10)), ty);
          depth = mix(depth, 1.0 - smoothstep(baseY, baseY + (skTop + 0.02 - baseY) * 0.6, ty), skW);

          // The palette is the plane layers' own light (cloudLight), so the
          // tower is lit by exactly what lights the cotton beside it: the same
          // cool ambient under the same warm sun by day, the same pink
          // afterglow, the same silver at night, the same diffuse grey under an
          // overcast. It used to carry a palette of its own, and the two never
          // agreed on the color of the light: a cream tower in a mauve sky at
          // magic hour, a blue-grey one among white cotton at noon.
          //
          // The luminance is the tower's, not the cotton's. A plane layer's lit
          // face runs well past 1.0 by day and the tone shoulder flattens it to
          // white \u2014 that is where its cotton look comes from \u2014 but a mass this
          // size needs its florets modelled, so the tower takes the cotton's
          // color at its own authored level (gain, 1 at night, where nothing
          // is overexposed). That level used to be a sunlit head near 0.92
          // with the shade at about 0.55 \u2014 and with the face lit mostly at
          // half strength by a soft wrap, the whole tower sat in a dull mid
          // grey under a summer noon. A sunlit head is the brightest thing in
          // the sky bar the sun: it is taken well over the sky now, to the
          // edge of the tone shoulder, and the shade is the luminous
          // blue-grey of a cloud lit through, a good two thirds of it.
          vec3 ambient, glow, sunL, shade, moon, leaden;
          float diffuse;
          cloudLight(dayF, nightM, sunsetF, cloudSun, 0.3, ambient, glow, sunL, shade, moon, leaden, diffuse);
          float gain = mix(1.0, 0.90, dayF);
          vec3 face = ambient + glow + sunL * 0.42;
          // (the sunlit head well over the face the shade is mixed from)
          vec3 hi = (face + sunL * 0.24 + moon * 0.7) * gain;
          // the shade: half way to the cotton's thickest shadow, with a
          // little of the sun carried round inside the cloud \u2014 and, as
          // there, an overcast's diffuse light fills it in part way
          vec3 lo = (mix(face, shade, 0.50 * (1.0 - diffuse * 0.45)) + sunL * 0.10 + moon * 0.3) * gain;
          // a crease's color: the same sky light, with less of the sky to see
          vec3 deep = (shade * 0.80 + moon * 0.2) * gain;
          // How much of the sun this face gets. A cloud is lit through its
          // outer hundred metres rather than off a skin, so the light wraps
          // past the geometric terminator \u2014 but only so far: every floret
          // keeps a lit cap and a shaded underside, and the fold between it
          // and the next is drawn by that change, at full contrast. The
          // breadth of the wrap is what sets how hard the small scale reads;
          // the large scale, the tower's turn, is folded into the normal at
          // a weight that leaves a face square to a high or side sun white
          // over most of its florets. Overcast light comes from everywhere
          // and flattens it all
          float sunVis = smoothstep(-0.55, 1.05, ndl);
          // and what the lobes and florets above it let through (lobeShadow):
          // read for the two scales that throw a shadow wider than a few
          // pixels, and only where a sun can throw one at all
          // (in the frame of the tower's own face, nT, which the lobes stand
          // out of: on a crown turned up to a high sun the sun stands high
          // over the florets and they throw little; laid out on the plane
          // of the screen instead, a sun high behind the tower raked every
          // crown flat and the whole head went into shadow)
          float lzL = dot(nT, sunT);
          vec2 lxy = sunT.xy - nT.xy * lzL;
          vec3 Lp = vec3(lxy.x * tangent + lxy.y * dirc, lzL);
          float latL = length(lxy);
          float shadow = 0.0;
          if (sunVis > 0.0 && latL > 0.05) {
            shadow = max(lobeShadow((cyl + 0.42 * warp + dW) * 1.55 + 13.0, 0.78, kMid.w, Lp) * 0.60,
                         lobeShadow(wf * 3.60 + 41.0, 0.74, kFine.w, Lp) * 0.80);
            shadow *= smoothstep(0.05, 0.35, latL) * (1.0 - 0.5 * decay) * (1.0 - 0.7 * side)
                    // (a sun behind the face lights only what pokes up into
                    // it, and the normal has already said which that is: the
                    // shadows on top of that left even the tops grey)
                    * mix(0.35, 1.0, smoothstep(-0.20, 0.40, lzL));
          }
          sunVis *= 1.0 - 0.85 * shadow;
          sunVis = mix(sunVis, 0.62, diffuse * 0.55);
          // a recess sees less of the sky, and the sun reaches into it no
          // better: a fold or a gap goes toward the crease's color, a cool
          // blue-grey, never black \u2014 light scattered in from the florets
          // round it fills it
          float ao = 1.0 - rec;
          // A sun high behind the tower \u2014 the hero's noon, looking toward it \u2014
          // lights the crowns from above and leaves every face turned this
          // way in the shade; but the light that went in at the crowns comes
          // out through the faces, kilometres of cloud diffusing it, and the
          // shaded side of a summer tower is a luminous blue-white, not a
          // dull grey. Not in the florets' own shadows (they are shade on a
          // lit face, the contrast that models them), and not with the sun
          // behind the eye, where no light comes through from behind
          lo += sunL * gain * 0.40 * smoothstep(0.30, 0.90, sunDir.y) * smoothstep(0.15, -0.45, lz) * (1.0 - shadow);
          vec3 tcol = mix(mix(deep, lo, ao), hi, sunVis * mix(1.0, ao, 0.5));
          // the sky's own light comes from above, so whatever the sun does the
          // top of each floret sees more of it than the underside: it is what
          // still models a tower with the sun square behind the eye. In the
          // shade that is all there is to model the florets, so there it goes
          // deeper: a face turned down sees the ground and the tower's own
          // shadow, one turned up the whole blue sky.
          // (No highlight on the crowns turned square to the sun: a cloud has
          // no sheen, and a step of light on each lobe's crown was what made
          // the lobes read as glossy balls)
          tcol *= mix(0.90 + 0.34 * n.y, 0.96 + 0.10 * n.y, sunVis);
          // and a little grain, by multiplication so it holds at the same
          // ratio on the bright faces as on the dark
          tcol *= 1.0 + (wisp - 0.5) * 0.08;
          // sink continuously toward the cloud base (never in discrete steps).
          // The base is in the tower's own shadow: no sun reaches it, and no
          // afterglow either \u2014 that comes from the sun's side of the sky \u2014 so
          // it is lit by the sky's own light alone, halfway into the shade. A
          // replace, not a tint: multiplying the sunlit face down by a cool
          // factor cancels pink against blue and lands on a mud grey, which is
          // exactly what the base turned into at magic hour. The sky-lit color
          // stays clean \u2014 blue-grey by day, lavender under the afterglow. Most
          // of the way, not all: the base still catches some light off the
          // ground and the clouds around it
          vec3 base = (mix(ambient, shade, 0.5) + moon * 0.3) * gain;
          tcol = mix(tcol, base, depth * depth * 0.8);
          // and right over the base the underside itself, flat and turned
          // away from the sky: the darkest band of the whole cloud
          float under = 1.0 - smoothstep(baseY, baseY + min(0.028, cloudH * 0.25), ty + baseFray * 0.5);
          tcol = mix(tcol, deep * 0.95, under * 0.70);
          // \u2500\u2500 the margin \u2500\u2500
          // the outermost skin is thin, and thin cloud scatters less of the
          // light back: on an edge facing the sun it reads as a slightly darker
          // line just inside the bright face (the "powder" look). On an edge
          // with the sun behind it the same thinness lets the light through
          // instead \u2014 the silver lining \u2014 so that only happens against the sun
          float margin = 1.0 - smoothstep(0.0, 0.45, depthIn);
          float facing = max(dot(nB.xy, vec2(lt, lu)) / max(lat, 1e-3), 0.0);
          float direct = max(dayF, sunsetF * 0.6) * (1.0 - diffuse);
          tcol *= 1.0 - margin * facing * sunVis * (1.0 - max(-lz, 0.0)) * 0.18 * direct;
          tcol += cloudSun * margin * margin * facing * max(-lz, 0.0) * 0.30 * direct;
          // Against the sun none of that lighting is what the eye gets. The face
          // turned this way is in the tower's own shadow, and what comes through
          // it has crossed kilometres of cloud and lost most of itself on the
          // way: the mass goes dark, in the shade's color \u2014 a blue-grey by day, a
          // violet-grey once the afterglow tints the sky light. Only the rim,
          // where the silhouette thins and the light has little cloud left to
          // cross, blazes in the sun's own color, hottest right by the disc. A
          // tower over a low sun used to come out the same lavender-white as one
          // across the sky from it, and read as a translucent veil for being too
          // light to stand in front of anything.
          if (backT > 0.0) {
            // how much cloud the light crossed: the most deep inside the
            // silhouette, low down, and least where a fold or a gap thins it
            float through = smoothstep(0.05, 0.80, depthIn)
                          * clamp(0.62 - rec * 0.30 + depth * 0.35, 0.0, 1.0);
            vec3 dark = (shade * mix(0.95, mix(0.55, 0.66, side), through) + moon * 0.3) * gain;
            // the florets still show: the side of each turned toward the sun
            // across the face catches what comes round and through its thin
            // margin, the side turned away and the folds between them stay
            // darker still. (Left out, a tower against the sun was a smooth
            // dark cut-out with a glowing outline \u2014 the putty again, only
            // darker)
            float toSun = dot(n.xy, vec2(lt, lu)) / max(lat, 1e-3);
            dark *= mix(0.84, 1.16, smoothstep(-0.45, 0.60, toSun)) * (1.0 + (wisp - 0.5) * 0.10) * mix(0.72, 1.0, ao);
            float fwd = exp(-sunAng * 5.0);
            // the rim is read off the field, not the alpha: the alpha's ramp is
            // a pixel or two wide, and a lining only that wide never shows. Not
            // the depth the rest reads, either \u2014 the lining belongs all the way
            // down the flanks, where that is lifted solid \u2014 and half of it the
            // bare envelope, so the lobes' swellings don't print as dark spots
            // across a glowing margin
            float rimW = 1.0 - smoothstep(0.0, 0.22, mix(envT, field, 0.5));
            rimW *= rimW * mix(0.70, 1.0, fwd);
            // (and broken up by the florets as the body is: brightest along
            // the side of each turned to the sun, dimmed in the folds \u2014 read
            // as one even glow, the lining over a broad head was an
            // airbrushed band)
            rimW *= mix(0.55, 1.0, smoothstep(-0.45, 0.60, toSun)) * mix(0.70, 1.0, ao);
            // With the sun round to the side the lining keeps to the edge that
            // faces it: the far edge has the whole tower between it and the
            // sun, and a lining all round read as a cut-out lit from behind
            float edgeS = dot(normalize(nB.xy + vec2(1e-4, 0.0)), vec2(lt, lu) / max(lat, 1e-3));
            rimW *= mix(1.0, smoothstep(-0.15, 0.70, edgeS), side);
            // and right over the disc even the thick of it lets a little through
            dark += cloudSun * fwd * fwd * 0.25 * (1.0 - through * 0.7);
            vec3 bcol = mix(dark, rimC * (1.7 + 0.8 * fwd), rimW);
            // and the flank turned toward the sun takes it straight: gold-orange
            // over the shade, as hard against the body as a raking sun makes
            // it. How far round the face is turned is read as the front-lit
            // shading reads it, so the lit flank runs on into the front-lit
            // tower without a seam as the sun comes round
            // (and along each lobe's sunward margin, a crescent, the way a
            // ball lit from behind and to the side is)
            // (judged off the tower's turn and its middle lobes alone, nB,
            // not the florets: it is the flank that turns to the sun, and
            // read off every floret's tilt one on the shaded face that
            // happened to lean sunward lit up alone, a gold blot on the dark
            // wall)
            float flank = side * max(smoothstep(0.45, 0.85, smoothstep(-0.32, 0.48, dot(nB, sunT))),
                                     margin * smoothstep(0.05, 0.45, facing));
            vec3 litF = (shade * 0.35 + sunL * (0.80 + 0.40 * facing) + moon * 0.3) * gain;
            bcol = mix(bcol, litF, flank * (1.0 - rimW));
            tcol = mix(tcol, bcol, backT);
          }
          // in severe weather the cumulonimbus itself sits inside the storm.
          // leaving it bright here makes a pure-white cloud float in a leaden
          // sky. Pull it toward the same leaden grey as the other layers.
          tcol = mix(tcol, leaden, gloom * 0.85);
          tcol += flash * vec3(0.75, 0.80, 1.0) * 0.55;

          // \u2500\u2500 Aerial perspective \u2500\u2500
          // A tower stands tens of kilometres off, behind that much air, and
          // the air scatters the sky's light into the line of sight: the base
          // loses contrast and takes on the horizon's color, while the head,
          // seen through thinner air, stays crisp. That is what lets a real
          // cumulonimbus sit *in* its sky rather than in front of it. But the
          // air only veils the tower \u2014 it does not make it see-through: the
          // thing is kilometres thick and shows nothing of the sky behind it,
          // so this is a blend toward the air's color, not a cut in the alpha.
          // The air's color is the sky's own in this direction, without the
          // clouds and lights laid on it; toward a low sun, the glow of its
          // forward-scattered light. The path through the low air grows as
          // 1/sin(elevation), and with the distance \u2014 a tower that stands
          // small is a far one; haze thickens it only a little, since the haze
          // wash at the end already paints the air's own color over everything
          vec3 airCol = skyWeather(airSky, dayF, gloom);
#ifdef FEAT_BACKLIT
          airCol = mix(airCol, mix(ambient, cloudSun, mix(0.55, 0.30, side)) * gain, backT);
#endif
          float far = mix(1.6, 1.0, smoothstep(0.20, 0.60, max(topL, skTop - baseY)));
          // (and a storm further off is behind more air \u2014 but mostly at its
          // foot. The haze is a layer near the ground: the line of sight to
          // a tower's head climbs out of it, crossing about as much of it
          // however far off the tower stands, while the sight line to its
          // base runs through it all the way. So a storm a hundred
          // kilometres off still stands white over a foot sunk in the haze)
          float airD = mix(pow(cbS, 0.6), 1.0, smoothstep(baseY, ceilN, ty));
          float air = 1.0 - exp(-(0.35 + 0.40 * u_haze) * 0.12 * far * airD / max(rd.y, 0.02));
          // Against the sun the air's color is the glow round the disc, far
          // brighter than the tower, and a far storm's foot, deep in the haze,
          // went all the way to it: the silhouette sank into a bright band.
          // Haze in front of a dark mass lends it some of the sky's light; it
          // does not turn it into the sky. Nor is all of that air lit: a tower
          // between the eye and the sun throws its shadow forward through the
          // air in front of it, toward the eye, and air in shadow scatters only
          // the sky's light. Round to the side the sky beyond is the bright
          // sunset's and the body the shade's, and washed as far as straight
          // against the sun it went back to the pale lavender
#ifdef FEAT_BACKLIT
          air = mix(air, min(air * mix(1.0, 0.55, side), 0.55), backT);
#endif
          // and the margin is thin cloud, behind as much air as the rest
          // but with less of itself to show through it: the air's color
          // takes more of it \u2014 a paler, hazier rim where the edge is soft,
          // paler still between its strands; against the sun, the glow of
          // the light it lets through. Further off, more so: what is left
          // of a far storm's margins is mostly the air in front of them.
          // (A rim only: spread further in it veiled whole florets, which
          // read as glass)
          float thinM = (1.0 - smoothstep(0.0, 1.5, te)) * (0.30 + 0.70 * sv) * (0.7 + 0.6 * smoothstep(0.35, 0.80, fr));
          air += (1.0 - air) * thinM * 0.15 * (1.0 + smoothstep(1.0, 3.5, cbS));
          tcol = mix(tcol, airCol, air);
          cbMask = clamp(m, 0.0, 1.0);
          OVER(tcol, cbMask);
          cbCol = tcol;
          cbBack = backT;
        }
      }
    }
#endif
    // and the anvil's near side, over the tower's head
    if (anvA > 0.001) {
      OVER(anvCol, anvA * anvNear);
      cbCol = cbMask > 0.0 ? mix(cbCol, anvCol, anvA * anvNear) : anvCol;
      cbBack = max(cbBack, backI);
      cbMask = max(cbMask, anvA * anvNear);
    }

    // \u2500\u2500 Veil cloud (velum) \u2500\u2500
    // A thin, flat cap draped like white cloth over the tower's head.
    //
    // Building this from an elevation band like "|rd.y - constant| < width"
    // makes it structurally a line no matter how frayed the edge gets \u2014 it
    // can never have thickness or skin. Use the same sphere field as the
    // tower, but heavily flattened vertically per cylindrical coordinate.
    // Round lobes stretch horizontally and overlap into a "flat mass",
    // giving it thickness variation and skin naturally.
    // (and only where the mass stands past the spread's cut below: anywhere
    // else it spreads nothing, and the veil's height need not be read)
    if (u_cbFeat.y > 0.001 && massE > 0.50) {
      // veil forms as a horizontal sheet at a stable layer, so its height
      // stays roughly constant regardless of azimuth. Scaling it with tower
      // height turns the veil into a zigzag tracing the ridgeline.
      // **what ties it to the tower is presence, not height** \u2014 only show it
      // around a tower that actually reaches that high
      float velumY = cbShape(0.30 + 0.18 * cbAmt, ceilN) + (fbm4(dirc * (2.2 * cbS) + 29.0) - 0.47) * 0.05;
      // the reach gate must stay strict: relaxed, the veil stretches into
      // long horizontal streaks across azimuths that hold no real tower
      float reach = smoothstep(velumY * 0.85, velumY * 1.25, towerTop);
      float spread = clamp(max(massE - 0.50, 0.0) * 6.0, 0.0, 1.0) * reach;
      if (spread > 0.02) {
        float dY = ty - velumY;
        // cylindrical coordinates flattened vertically by 26\xD7. This multiplier decides how thin the cap is
        vec2 vcyl = dirc * (2.4 * cbS) + vec2(0.0, dY * 26.0);
        float vb = blobs(vcyl * 0.9 + 61.0, 0.86);
        // the sphere field gives thickness variation; a vertical falloff keeps it from spilling outside the cap
        float vfield = (vb - 0.58) * 1.4 + (spread - 0.42) * 1.7 - abs(dY) * 21.0;
        // a thin veil, so the edge dissolves broadly into the sky
        // (a cap over a rising head: a dying tower loses it)
        float v = smoothstep(-0.16, 0.40, vfield) * u_cbFeat.y * (1.0 - decay) * stand;
        if (v > 0.001) {
          // lean the same slightly-blue white as the tower's daytime hi \u2014
          // a neutral-warm white here reads as cream against the other layers
          vec3 vcol = mix(vec3(0.11, 0.12, 0.15), vec3(0.935, 0.950, 0.970), dayF);
          vcol = mix(vcol, vcol * vec3(1.10, 0.88, 0.72), sunsetF * 0.8);
          vcol = mix(vcol, vec3(0.21, 0.22, 0.25) * (0.25 + 0.75 * dayF), gloom * 0.85);
          // the underside sinks into shadow, the top face catches the sun
          vcol *= mix(0.80, 1.05, smoothstep(-0.030, 0.024, dY));
          // skin. Multiplicative so it adds texture without changing overall brightness
          float vFray = vnoise(vcyl * 4.2 + 3.0) * 0.6 + vnoise(vcyl * 9.5 + 11.0) * 0.4 - 0.5;
          vcol *= 1.0 + vFray * 0.22;
          // against the sun the cap does what the tower's rim does: where it
          // hangs in open sky, thin, it glows with the light coming through
          // it; where it lies across the tower, in the tower's shadow, it is
          // as dark as the mass behind it. (As far round as the plate's,
          // backI: lit as if the sun were behind the eye, a cap laid over a
          // tower gone dark round to the side of a low sun was a pale band
          // drawn across it)
          if (backI > 0.0) {
            vec3 ambient, glow, sunL, shade, moon, leaden;
            float diffuse;
            cloudLight(dayF, nightM, sunsetF, cloudSun, 0.3, ambient, glow, sunL, shade, moon, leaden, diffuse);
            vec3 vdark = shade * 0.75 * mix(1.0, 0.82, dayF);
            vec3 vback = mix(rimC * mix(1.25, 0.80, side), vdark, max(cbMask, smoothstep(0.20, 0.70, v)));
            vcol = mix(vcol, vback * (1.0 + vFray * 0.22), backI);
          }
#ifdef FEAT_CBVOL
          // Across the volumetric tower the cap is a sheet the turrets have
          // risen through, wrapped round them: what of it lies in front of
          // a turret lies against its face, a few hundred metres of cloud
          // on kilometres, lit as the face is \u2014 by the sun from above when
          // the face is, in its shade when it is not. So there it takes the
          // tower's own light, and shows as the cap only where it stands
          // out past the flanks, a collar in open sky. Its colour above is
          // authored for the 2D tower, a flat white or, against the sun,
          // that tower's shade: laid on the march's turrets \u2014 lit from
          // above under a high sun however far round it stands, and taking
          // a low sun's rose \u2014 it was a grey band (green at dusk) across
          // white or pink turrets half way up, drawn out in streaks by its
          // skin, and its top edge cut each one flat. (A little of its own
          // is kept, the collar's smoothness over the florets)
          vcol = mix(vcol, cbCol, cbMask * 0.85);
#endif
          OVER(vcol, v * 0.70 * horizonFade);
        }
      }
    }
  }
#endif

  // \u2500\u2500 Low layer, under 2000m \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Stratocumulus Sc (roll cloud) \u2014 large mottled masses, arranged as rolls
  if (u_low.y > 0.001 && above && stack) {
    vec2 g = granular(planeUV(rd, rdY, ALT_LOW * 1.9, u_windOff * 1.2), 1.22, 0.5, 0.78, ldir);
    vec3 col = cloudColor(g.x, g.y, 0.48, dayF, nightM, sunsetF, flash, gloom, 1.05, cloudSun, 0.0);
    float scA = g.x * u_low.y * 0.95 * horizonFade;
    // Over a tower, as the cumulus's fringes (below): only what is nearly
    // opaque crosses it, in the tower's own tone. Here it is the amount
    // that makes a grain translucent, not its edge \u2014 a trace of the layer
    // is a few percent of cloud in every grain \u2014 and toward the horizon,
    // where the towers stand, its rolls are drawn out flat: laid across the
    // tower as they were, a sky with a trace of it in had the mass ruled
    // with faint pale and grey streaks, a smear across the cauliflower
    // (the volumetric tower's smooth shaded faces showed it most)
#ifdef FEAT_CB
    if (cbMask > 0.001) {
      scA *= 1.0 - cbMask * (1.0 - smoothstep(0.60, 0.97, scA)) * 0.92;
      col = overTower(col, 1.0 - g.x, cbMask, cbCol, cbBack, mix(cloudSun, vec3(1.0, 0.86, 0.58), 0.35 * sunsetF));
    }
#endif
    OVER(col, scA);
  }
  // Cumulus Cu (cotton cloud) \u2014 dome-shaped billowing lumps. The heaviest layer, so skip it at tiny amounts
  if (u_low.z > 0.02 && above && stack) {
    // \u2500\u2500 Cumulus as a slab: a top and a base \u2500\u2500
    // A cumulus is a column standing on a flat base, and seen from below it
    // is two things: a dark flat underside, and a sunlit crown that shows
    // past it. One plane cannot be both. So the same field is read on two
    // planes \u2014 a plane a third higher for the crown, which billows out wider
    // than the flat base beneath it, and the base, only the denser cores \u2014
    // and the two are composited top first, base last (the base is the
    // nearer). Overhead the two project to the same place and the shaded
    // base sits inside the crown's lit margin; toward the
    // horizon the crown projects above the base and stands clear of it, a
    // white top over a grey bottom, which is the cumulus of a photograph.
    // The parallax between the planes is what gives the lump its side.
    //
    // during high wind the whole sky wobbles slightly.
    // driven by u_windOff (which only advances in wind) so the phase is
    // continuous across u_time's wrap; at full gust its rate matches the
    // old u_time * 2.3 / 1.7 frequencies
    vec2 wob = u_wind * 0.01 * vec2(
      sin(u_windOff * 10.0 + rd.y * 8.0),
      cos(u_windOff * 7.4 + rd.x * 6.0)
    );
    // the smaller the amount, the higher the threshold \u2014 sparse clouds only sprout here and there
    float edge = 0.88 - u_low.z * 0.52;
    // The amount sets how much of the sky the lumps cover (the threshold
    // above), not how solid each one is: scaled by it as well, a fair sky's
    // grey bases came out at 60% and the blue showed through them in muddy
    // patches. A lump is opaque; only a trace of cumulus fades in
    float solid = smoothstep(0.02, 0.30, u_low.z);
    // A cumulus edge is soft: the ramp the other layers use cut each lump out
    // of the blue like paper overhead, where it is narrowest. Widened about
    // the same threshold, so the lumps keep their size and lose the outline
    float cuRamp = ramp + 0.14;
    float cuSoft = 0.07;
    // Locality: a real sky's clouds gather \u2014 a flock here, a bare stretch
    // there, a street downwind \u2014 where a noise field cut at one threshold
    // is evenly peppered everywhere. A much coarser field moves the
    // threshold around the sky, denser in some quarters and sparser in
    // others; it fades out as the cover closes, since a full deck is a deck
    {
      vec2 puv = planeUV(rd, rdY, ALT_LOW * 2.5, u_windOff * 0.7);
      float patch = fbm2(puv * 0.045 + 61.0) - 0.5;
      edge += patch * 0.34 * (1.0 - smoothstep(0.55, 0.9, u_low.z));
    }

    // Against the sun a lump is lit from behind, like the tower: a thick
    // core shows the eye its shadowed face and goes a blue-grey (violet at
    // dusk), while a thin lump and every lump's margin glow with the light
    // coming through them. The thin ones carry the day here \u2014 a fair sky's
    // small cotton round the sun stays bright, only real cores darken
#ifdef FEAT_BACKLIT
    float cuBack = backlit(rd, sunDir, mix(0.5, 1.0, smoothstep(0.15, 0.60, sunEl)));
#else
    const float cuBack = 0.0;
#endif
    vec3 cuShade = vec3(0.0), cuRim = vec3(0.0);
    if (cuBack > 0.0) {
      vec3 ambient, glow, sunL, shade, moon, leaden;
      float diffuse;
      cloudLight(dayF, nightM, sunsetF, cloudSun, 0.0, ambient, glow, sunL, shade, moon, leaden, diffuse);
      // lighter than the tower's: a lump is a few hundred metres through, not kilometres
      cuShade = mix(shade, ambient + glow, 0.40) + moon * 0.3;
      cuRim = mix(cloudSun, vec3(1.0, 0.86, 0.58), 0.35 * sunsetF) * (1.45 + 0.6 * exp(-sunAng * 5.0));
      // a lump hanging in front of a tower that hides the sun is in the
      // tower's shadow: nothing comes through it to glow
      cuRim = mix(cuRim, cuShade, cbMask);
    }
    // the tower's lining color, for a lump in front of it (overTower)
#ifdef FEAT_CB
    vec3 cbGlow = mix(cloudSun, vec3(1.0, 0.86, 0.58), 0.35 * sunsetF);
#endif
    // Which flank the eye sees. With the sun off to the side a lump has a
    // lit flank and a shaded one, so the lit-ness swing is widest there;
    // with the sun behind the eye every face in view is lit, and toward the
    // sun every face in view is the far one. Only a lump seen side-on \u2014
    // low in the sky, under a sun low enough to light it from the side \u2014
    // shows its flanks at all; overhead it is all crown and base
    float cuAz = dot(normalize(rd.xz + vec2(1e-5)), ldir);
    float cuSide = (1.0 - smoothstep(0.35, 0.85, sunEl)) * (1.0 - smoothstep(0.15, 0.65, rd.y));
    // how far the flank swings the lit-ness, and which way the whole lump leans
    float cuFlank = 1.6 * (1.0 - cuAz * cuAz) * cuSide;
    float cuBias = -cuAz * 0.30 * cuSide;

    // the crown: the plane above, the full footprint, lit from above and
    // shaded shallowly
    {
      vec2 tuv = planeUV(rd, rdY, ALT_LOW * 2.5 * 1.32, u_windOff) + wob;
      float tedge = edge;
      vec3 tl = cloudField(tuv, churn, ldir, tedge - cuSoft, cuRamp, tedge - cuSoft - 0.01);
      float talpha = tl.x * solid * horizonFade;
      talpha *= 1.0 - cbMask * (1.0 - smoothstep(0.60, 0.97, tl.x)) * 0.92;
      float tthick = smoothstep(tedge, tedge + 0.35, tl.z);
      // shaded enough inside that a lump has a form rather than a flat white
      // cut-out \u2014 the flat white is most of what read as hard contrast
      // the flank is read off the plain density gradient toward the sun:
      // positive on the flank facing it, negative on the far one. cloudField's
      // lit-ness can't serve as it is \u2014 it sets a contrast-stretched density
      // against an unstretched resample, so inside a lump it leans bright
      // whatever the side, which is why a lump came out white all round.
      // Undoing the stretch on its two halves recovers the gradient
      float tgrad = clamp(((tl.z - 0.5) / 2.2 + 0.5 - tl.z + tl.y / 2.5) * 16.0, -1.0, 1.0);
      float tlit = tl.y + tgrad * cuFlank + cuBias;
      vec3 tc = cloudColor(tl.x, tlit + 0.20, tthick * 0.75, dayF, nightM, sunsetF, flash, gloom, 0.8, cloudSun, 0.0);
      if (cuBack > 0.0) {
        // graded over a wider span of the raw density than tthick, or the
        // glow and the grey meet in a line and the core reads as a stain
        float thin = 1.0 - smoothstep(tedge, tedge + 0.30, tl.z);
        float deep = smoothstep(tedge + 0.05, tedge + 0.65, tl.z);
        vec3 bc = mix(mix(cuRim * 0.75, cuShade, deep), cuRim, thin * thin);
        tc = mix(tc, bc, cuBack);
      }
#ifdef FEAT_CB
      if (cbMask > 0.001) tc = overTower(tc, 1.0 - smoothstep(tedge, tedge + 0.30, tl.z), cbMask, cbCol, cbBack, cbGlow);
#endif
      OVER(tc, talpha * 0.97);
    }

    // the base: flat, narrower than the crown, in the lump's own shadow and
    // lit by the sky \u2014 and from the side, by a sun low enough to get under
    // it. Its footprint as wide as the crown's, the grey of it ringed every
    // small white top in a fair sky
    vec2 cuv = planeUV(rd, rdY, ALT_LOW * 2.5, u_windOff) + wob;
    // the veil's skirt reaches lower than the density's, so it sets the floor
    float bedge = edge + 0.15;
    vec3 dl = cloudField(cuv, churn, ldir, bedge - cuSoft, cuRamp, bedge - 0.08);
    // a thin, translucent veil cloud: a short skirt below the density threshold
    // (a little haze at the lumps' feet; a wide one spread translucent grey
    // across the blue). Scaled with the amount, or a residual haze is all
    // that's left in an otherwise cloudless sky
    float veil = smoothstep(bedge - 0.08, bedge + 0.02, dl.z) * 0.22 * u_low.z;
    float alpha = max(dl.x * solid, veil) * horizonFade;
    // over a cumulonimbus tower, a translucent fringe reads as a dirty
    // smudge stamped onto the bright mass \u2014 let only near-opaque cores
    // cross it (a half-dense patch is the worst case: neither cloud nor sky)
    alpha *= 1.0 - cbMask * (1.0 - smoothstep(0.60, 0.97, dl.x)) * 0.92;
    // shade from continuous thickness across the wide ramp, not from the saturated density (den)
    float thick = smoothstep(edge, edge + 0.35, dl.z);
    // the underside takes the sun only when the sun is low enough to reach
    // under it; the rest of the day it is the shade, darkest at the core
    // the rest of the day it is the shade \u2014 a soft grey, not a dark one: a
    // cumulus base is lit by the whole sky and by the ground, and photographs
    // of one read as white with grey beneath, not grey with white above
    float under = smoothstep(0.30, 0.02, sunEl);
    // Only under a thick core, though, and a light grey: shaded throughout,
    // the base laid broad grey patches among the white tops of a fair sky, a
    // camouflage print. Where the base is thin it is the lump's sunlit flank
    // and takes the lump's own light
    float core = smoothstep(0.20, 1.0, thick);
    // and that flank turns lit or shaded with the sun's bearing, as the crown does
    float dgrad = clamp(((dl.z - 0.5) / 2.2 + 0.5 - dl.z + dl.y / 2.5) * 16.0, -1.0, 1.0);
    float dlit = dl.y + dgrad * cuFlank + cuBias;
    float baseLit = mix(dlit, mix(-0.30, dlit, under), core);
    vec3 c = cloudColor(dl.x, baseLit, max(thick * 0.9, 0.30 * dl.x), dayF, nightM, sunsetF, flash, gloom, 0.5, cloudSun, 0.0);
    if (cuBack > 0.0) {
      float thin = 1.0 - smoothstep(bedge, bedge + 0.30, dl.z);
      float deep = smoothstep(bedge + 0.05, bedge + 0.65, dl.z);
      vec3 bc = mix(mix(cuRim * 0.75, cuShade, deep), cuRim, thin * thin);
      c = mix(c, bc, cuBack);
    }
#ifdef FEAT_CB
    if (cbMask > 0.001) c = overTower(c, 1.0 - smoothstep(bedge, bedge + 0.30, dl.z), cbMask, cbCol, cbBack, cbGlow);
#endif
    OVER(c, alpha * 0.97);

    // fast-moving ragged clouds nearby (fragments of cumulus)
    vec2 fuv = planeUV(rd, rdY, ALT_LOW * 1.2, u_windOff * 1.9) + 51.7;
    float fedge = 0.94 - u_low.z * 0.42;
    vec3 fl = cloudField(fuv, churn * 1.2, ldir, fedge - cuSoft, cuRamp, fedge - cuSoft - 0.01);
    float falpha = fl.x * u_low.z * horizonFade * (1.0 - cbMask * 0.6);
    float fthick = smoothstep(fedge, fedge + 0.35, fl.z);
    vec3 fc = cloudColor(fl.x, fl.y, fthick, dayF, nightM, sunsetF, flash, gloom, 1.25, cloudSun, 0.0);
    if (cuBack > 0.0) {
      float thin = 1.0 - smoothstep(fedge, fedge + 0.30, fl.z);
      float deep = smoothstep(fedge + 0.05, fedge + 0.65, fl.z);
      fc = mix(fc, mix(mix(cuRim * 0.75, cuShade, deep), cuRim, thin * thin), cuBack);
    }
#ifdef FEAT_CB
    if (cbMask > 0.001) fc = overTower(fc, 1.0 - smoothstep(fedge, fedge + 0.30, fl.z), cbMask, cbCol, cbBack, cbGlow);
#endif
    OVER(fc, falpha * 0.95);
  }
  // Stratus St (fog cloud) \u2014 hangs low. Denser toward the horizon
  if (u_low.x > 0.001 && above && stack) {
    vec2 s = stratiform(planeUV(rd, rdY, ALT_LOW * 0.5, u_windOff * 1.2), 0.45, 0.45);
    vec3 col = cloudColor(0.95, -0.25, 0.60,
                          dayF, nightM, sunsetF, flash, gloom, 1.2, cloudSun, 0.0) * 0.86;
    float lowBias = mix(1.0, 0.40, smoothstep(0.05, 0.55, rd.y));
    OVER(col, s.x * u_low.x * lowBias * 0.95 * horizonFade);
  }

  // \u2500\u2500 Light leaking in under the cloud base \u2500\u2500
  // Even under a thick deck covering the whole sky, right along the horizon
  // distant light having passed beneath the clouds breaks through and
  // brightens things. This single band is usually what sells a rain-cloud sky.
  float deck = max(u_mid.z, max(u_mid.x, u_low.x));
  if (deck > 0.01 && stack) {
    vec3 leak = mix(vec3(0.055, 0.058, 0.066), vec3(0.70, 0.70, 0.63), dayF);
    leak = mix(leak, vec3(0.86, 0.60, 0.40), sunsetF * 0.7);
    float band = smoothstep(0.22, 0.005, rd.y) * smoothstep(-0.02, 0.02, rd.y);
    OVER(leak, band * deck * 0.88);
  }

#ifdef FEAT_SHAFTS
  // \u2500\u2500 Rain shafts (praecipitatio, and virga where it never lands) \u2500\u2500
  // A grey curtain hanging from a distant cloud base toward the ground: the
  // one sign that says it is raining over there. They hang in the band
  // between the horizon and the base, under whichever of two things is
  // raining \u2014 a cumulonimbus tower, or a cell of heavier rain in the
  // nimbostratus deck. A thunderstorm's tower rains whether or not it is
  // raining here, so thunder alone is enough to give it shafts.
  //
  // Laid after the light leaking in under the base, not before it: a
  // curtain stands in front of that bright distance and darkens it, and
  // under it the leak's band washed the shafts out to nothing. Before the
  // scud, though, which races by far nearer than any of this
  float shaftRain = max(u_rain, step(0.001, u_thunder) * step(0.05, u_low.w) * 0.5);
  // the tower's scale, as there: a nearer storm's base stands higher, and
  // its curtains hang from it
  float cbSS = cbScale(u_cbFeat.z);
  float shTop = max(0.20, sin(min(0.2025 / cbSS, 1.5)));
  if (shaftRain > 0.01 && stack && rd.y > -0.01 && rd.y < shTop) {
    // tilted with the wind: the air the rain falls through moves slower than
    // the cloud that drops it, so the curtain trails behind its cloud the
    // lower it hangs \u2014 sampled at the azimuth the rain left the base from
    float lean = 0.10 + 0.40 * u_wind;
    float azw = az + u_windOff * 0.15;
    // the tower's own thrust, read off the same field the cumulonimbus is cut
    // from (see that block), so the curtain hangs only where a tower stands.
    // Unrelated noise here would rain out of an empty sky. (Read as the
    // tower reads it, through vnoiseHQ: it rides the storm's clock, and the
    // curtain stepped with it, column by column)
    float cbP = 0.0, cbBase = 0.12;
#ifdef FEAT_CB
    if (u_low.w > 0.001) {
      float cbAmtS = max(u_low.w, 0.30) * (1.0 - gloom * 0.6);
      float azT = azw - lean * max(sin(0.1304 / cbSS) - rd.y, 0.0);
      float massS = fbm4HQ(vec2(sin(azT), cos(azT)) * (0.85 * cbSS) + vec2(0.0, cbClock()));
      float riseS = pow(max(massS - 0.42, 0.0) * 4.6, 1.5) * (1.05 + 1.35 * cbAmtS);
      // only a grown tower rains, and only from its core: the flanks of the
      // footprint, where the mass is thin, stay dry
      cbP = smoothstep(0.60, 1.40, riseS) * smoothstep(0.05, 0.30, u_low.w);
      // a bigger tower's base spreads wider and lower over the ground, so it
      // stands a little higher on screen (the tower's baseY, taken back
      // from the storm's own sky to the real one)
      cbBase = sin(asin(0.12 + 0.06 * smoothstep(0.6, 2.0, riseS)) / cbSS);
    }
#endif
    // the deck: rain falls from all of it, but heavier in cells, and only
    // the cells show as shafts against the lighter rain round them. The more
    // it rains the more of the deck is a cell
    float dkP = 0.0;
    if (u_mid.z > 0.02 && u_rain > 0.01) {
      float azD = azw - lean * max(0.18 - rd.y, 0.0);
      float cell = fbm2(vec2(sin(azD), cos(azD)) * 1.45 + vec2(13.0, u_evo * 0.05));
      float cut = 0.62 - 0.20 * u_rain;
      dkP = smoothstep(cut, cut + 0.18, cell) * smoothstep(0.05, 0.5, u_mid.z)
          * smoothstep(0.01, 0.30, u_rain);
    }
    float pres = max(cbP, dkP);
    if (pres > 0.002) {
      // where the curtain starts: just under the base it hangs from (the
      // deck's base is where the plane layers fade into the horizon)
      float base = (cbP * cbBase + dkP * 0.18) / (cbP + dkP);
      float t = rd.y / base;   // 0 at the horizon, 1 at the base
      // the grain, sheared by the same lean as the presence above
      float aS = azw - lean * max(base - rd.y, 0.0);
      vec2 gr = shaftGrain(aS, rd.y);
      float sheet = smoothstep(0.20, 0.80, gr.x);
      // how far down the rain gets before it evaporates. Heavy rain reaches
      // the ground; a light shower is virga, gone by mid-height. Not at one
      // height across the curtain, either \u2014 each sheet runs out at its own
      float reach = mix(0.45, 1.25, smoothstep(0.10, 0.65, shaftRain));
      reach *= 0.70 + 0.35 * sheet + 0.20 * gr.y;
      float fall = smoothstep(1.0 - reach, 1.0 - reach + 0.50, t);
      // densest just under the base, thinning as it falls; and soft into the
      // base itself, never a hard top edge
      float hang = fall * smoothstep(1.12, 0.70, t) * mix(0.65, 1.0, t);
      // the sheets and streaks modulate the curtain, they are not the
      // curtain: cut to lines it reads as a barcode
      float a = pres * hang * (0.50 + 0.50 * sheet) * (0.70 + 0.30 * smoothstep(0.25, 0.75, gr.y));
      // below the horizon is the ground; let the curtain meet it, not cross it
      a *= smoothstep(-0.01, 0.006, rd.y);
      // the air in front of a shaft kilometres off washes it toward the
      // horizon, as it does the tower's foot \u2014 but a heavy curtain still
      // shows down to the ground
      float air = 1.0 - exp(-(0.35 + 0.40 * u_haze) * 0.05 * mix(1.0, pow(cbSS, 0.6), cbP / (cbP + dkP)) / max(rd.y, 0.02));
      a *= 1.0 - air * 0.55;
      a *= 0.70 + 0.30 * smoothstep(0.05, 0.6, shaftRain);
      if (a > 0.002) {
        // a curtain of drops is lit like a thin cloud: mostly by the sky, so
        // the cloud palette's shade \u2014 greyer than the shade, though, since
        // what is above falling rain is the cloud, not blue sky. Left blue,
        // a typhoon's curtains came out a steel blue on a grey horizon
        vec3 ambient, glow, sunL, shade, moon, leaden;
        float diffuse;
        cloudLight(dayF, nightM, sunsetF, cloudSun, 0.0, ambient, glow, sunL, shade, moon, leaden, diffuse);
        vec3 col = mix(shade, ambient + glow, 0.15);
        col = mix(col, vec3(dot(col, vec3(0.30, 0.59, 0.11))), 0.40);
        // and from the side by a sun that is not behind the deck: drops
        // scatter forward, so the curtain is brightest toward the sun, but a
        // low sun across it still lights it \u2014 the orange curtains of an
        // evening shower. Toward the sunlit color, not added over the shade:
        // a lit curtain is the light it scatters, and the blue of the shade
        // under it turns an orange curtain a muddy pink
        vec2 hs = normalize(sunDir.xz + vec2(1e-5)), hr = normalize(rd.xz + vec2(1e-5));
        float fwd = 0.5 + 0.5 * dot(hs, hr);
        float side = (1.0 - diffuse) * (0.40 + 0.60 * fwd * fwd) * (0.80 + 0.40 * gr.y);
        col = mix(col, sunL * 1.15 + ambient * 0.10, clamp(side * 1.05, 0.0, 1.0));
        col = mix(col, leaden, gloom * 0.80 * (1.0 - side * 0.6));
        // and a lit curtain shows more than a shaded one: the drops scatter
        // the sun toward us against the shadow of the storm behind them
        a *= 1.0 + 0.60 * side * sunsetF;
        col += moon * 0.2;
        col += flash * vec3(0.75, 0.80, 1.0) * 0.40;
        OVER(col, clamp(a, 0.0, 1.0));
      }
    }
  }
#endif

  // \u2500\u2500 Pannus (ragged scud beneath rain clouds) \u2500\u2500
  // Dark fragments racing fast beneath the cloud base. Layering dark shapes
  // over the bright leaking horizon reads as "there's another layer beneath
  // the thick deck", adding depth.
  // Near the horizon the cloud plane's projection diverges and high
  // frequency breaks down, so squeeze this into a band and stretch the
  // threshold's ramp wide to dissolve it into an outline-less haze instead.
  float fband = smoothstep(0.015, 0.075, rd.y) * smoothstep(0.42, 0.10, rd.y);
  if (u_mid.z > 0.02 && fband > 0.001 && stack) {
    vec2 fuv = planeUV(rd, rdY, ALT_LOW * 0.42, u_windOff * 2.4) + 77.0;
    float pedge = 0.90 - u_mid.z * 0.22;
    vec3 fr = cloudField(fuv, churn + 0.45, ldir, pedge, ramp * 2.2, pedge - 0.01);
    vec3 fcol = mix(vec3(0.030, 0.033, 0.040), vec3(0.26, 0.27, 0.29), dayF);
    OVER(fcol, fr.x * u_mid.z * fband * 0.80);
  }

  // \u2500\u2500 Applying the stack (the split variant) \u2500\u2500
#ifdef CLOUD_SPLIT
  if (u_cloudMode > 1.5) {
    // Composite: the stack was drawn at its own resolution in mode 1. The 22\xB0
    // halo goes beneath all of it here rather than between the cirrostratus
    // and the layers above \u2014 the one place the split departs from one pass
#ifdef FEAT_HALOS
    vec3 halo = iceHalo(rd, el, sunDir, sunAng, sunVis, moonDir, moonAng, moonVis, nightF);
    if (halo.r + halo.g + halo.b > 0.0) disp = encodeSrgb(L(disp) + halo);
#endif
    // sampled where this pixel's ray was cast \u2014 after any lens droplet bent
    // it \u2014 since mode 1 drew the stack for the undistorted rays over the same
    // 0..1 frame
    vec4 ct = CLOUD_FETCH(p);
    cC = ct.rgb;
    cT = ct.a;
  } else if (u_cloudMode > 0.5) {
    gl_FragColor = vec4(cC, cT);
    return;
  }
  disp = disp * cT + cC;

#ifdef FEAT_RAYS
  // \u2500\u2500 Crepuscular rays \u2500\u2500
  // Sunlight through the gaps in a cloud deck lights the air it crosses, and
  // the lit air between the shadows reads as shafts fanning out from the
  // sun. The cloud stack's alpha is the deck's transmittance, pixel by pixel,
  // so a march along the line toward the sun's place on screen, summing what
  // gets through, is how much sunlit air stands between this pixel and the
  // sun \u2014 the shadow-volume integral in screen space. Only here, in the
  // composite, where that stack exists to be read; jittered per pixel so the
  // march's steps do not band
  if (u_cloudMode > 1.5 && u_rays > 0.001 && sunVis > 0.0) {
    vec3 proj = projectDir(sunDir, u_cam.x, u_cam.y, u_cam.z, aspect);
    float near = proj.z > 0.0 ? smoothstep(2.4, 1.2, max(abs(proj.x), abs(proj.y))) : 0.0;
    if (near > 0.0) {
      vec2 sunPos = proj.xy * 0.5 + 0.5;
      vec2 dp = sunPos - p;
      const int N = 24;
      float jitter = fract(52.9829189 * fract(0.06711056 * gl_FragCoord.x + 0.00583715 * gl_FragCoord.y));
      float lit = 0.0, wsum = 0.0;
      for (int i = 0; i < N; i++) {
        float f = (float(i) + jitter) / float(N);
        vec2 q = clamp(p + dp * f, 0.0, 1.0);
        float wgt = 1.0 - f * 0.5;
        lit += CLOUD_FETCH(q).a * wgt;
        wsum += wgt;
      }
      // squared: a line half in cloud is a shadow, not half a shaft
      float shaft = lit / wsum;
      shaft *= shaft;
      // the shafts show against the sky near the sun, and most when the sun
      // is low and the air it crosses is long
      float glow = exp(-sunAng * 1.5) * near * sunVis * u_rays
                 * (0.35 + 0.65 * smoothstep(0.6, 0.05, sunDir.y));
      vec3 shaftCol = L(mix(vec3(1.0, 0.95, 0.85), vec3(1.05, 0.62, 0.35), sunsetF));
      disp = encodeSrgb(L(disp) + shaftCol * shaft * glow * 1.2);
    }
  }
#endif
#endif

  // \u2500\u2500 Below the horizon \u2500\u2500
  // Out of frame with the default framing; there when looking down and for the
  // skybox's lower hemisphere. A plate of ground, or \u2014 u_sea \u2014 open water.
  {
    vec3 ground = mix(vec3(0.020, 0.022, 0.028), vec3(0.17, 0.165, 0.150), dayF);
    ground = mix(ground, ground * 0.6, gloom * 0.5);
    ground += vec3(0.06, 0.03, 0.015) * sunsetF * 0.5;
    disp = mix(disp, ground, smoothstep(0.0, -0.05, rd.y) * (1.0 - u_sea.x));
  }

#ifdef FEAT_SEA
  // \u2500\u2500 Sea \u2500\u2500
  // Water is a mirror laid flat. What reaches the eye off it is mostly the
  // sky, reflected \u2014 nearly all of it at a grazing look, next to none looking
  // straight down (Fresnel), where the water's own dark green-blue shows
  // instead. So the sea takes the color of its hour exactly, and the sun and
  // the moon lay a path across it: their reflection, scattered along the wind
  // by the slopes of the waves. The horizon is a hard line, unlike the
  // ground's \u2014 a sea meets the sky at an edge.
  //
  // Only the sky's own color is mirrored (skyBase, skyWeather) plus the sun,
  // the moon and the city glow \u2014 not the clouds. At the grazing angles where
  // the mirror is strong the sky it mirrors is the near-horizon sky, where
  // the clouds have already faded; where the clouds would show, the mirror
  // has gone weak. The gate is on the ray alone, so above the horizon this
  // costs nothing.
  if (u_sea.x > 0.001 && rd.y < 0.0) {
    // where the ray meets the water, with the eye one unit above it. The
    // intersection runs off to infinity at the horizon, so each wave's slope
    // is faded out before its length on screen falls under a pixel
    float dist = 1.0 / max(-rd.y, 1e-3);
    vec2 wp = rd.xz * dist;
    // the wind's heading on the water, the one the clouds take
    vec2 wdir = normalize(vec2(1.0, 0.15));
    vec2 wperp = vec2(-wdir.y, wdir.x);
    // \u2500\u2500 slopes \u2500\u2500
    // Every temporal frequency below is a whole number of cycles per wrap of
    // u_time (2\u03C0\xB7n / 4096), so the sea does not jump when the clock wraps \u2014
    // and each is deep-water dispersion's for its length, with the eye 1.6 m
    // up, so long waves roll and short ones flicker in proportion
    float t = u_time;
    vec2 slope = vec2(0.0);
    // swell: three long waves near the wind's heading, at different lengths
    // so they beat against each other instead of marching in step
    float sw = u_sea.y * (1.0 - smoothstep(200.0, 600.0, dist));
    if (sw > 0.001) {
      slope += waveSlope(wp, (wdir) * 0.157, 0.60 * sw, 0.9802, t);
      slope += waveSlope(wp, (wdir * 0.94 + wperp * 0.34) * 0.233, 0.30 * sw, 1.1996, t);
      slope += waveSlope(wp, (wdir * 0.88 - wperp * 0.48) * 0.105, 0.50 * sw, 0.8008, t);
    }
    // chop: short waves the wind raises, spread wide across its heading. These
    // are what break the sun's image into a path: their slopes reach several
    // degrees even in a light air, where the swell's are long and shallow
    float ch = (0.35 + 0.65 * u_wind) * (1.0 - smoothstep(20.0, 60.0, dist));
    // where the chop is cresting, -1 in a trough .. 1 on a crest, leaning a
    // little onto the face downwind of it: a wave breaks forward, and its foam
    // spills down the front. Fades to 0 \u2014 no knowledge \u2014 with the chop
    float crest = 0.0;
    if (ch > 0.001) {
      vec3 c = waveSlopeHeight(wp, (wdir * 0.62 + wperp * 0.78) * 2.09, 0.030 * ch, 3.580, t)
             + waveSlopeHeight(wp, (wdir * 0.71 - wperp * 0.71) * 3.14, 0.018 * ch, 4.390, t)
             + waveSlopeHeight(wp, (wdir * 0.97 + wperp * 0.26) * 1.40, 0.045 * ch, 2.930, t);
      slope += c.xy;
      // the three amplitudes sum to 0.093 and their slopes along the wind to
      // 0.140, which brings both to about -1..1; the chop's fade with
      // distance then goes back on
      float front = max(-dot(c.xy, wdir) / (0.140 * ch), 0.0);
      crest = (c.z / (0.093 * ch) + 0.5 * front) / 1.5 * (ch / (0.35 + 0.65 * u_wind));
    }
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));
    vec3 r = reflect(rd, n);
    // a slope steep enough to mirror the water itself is a slope the sea
    // never shows at these amplitudes; keep the mirror pointed at the sky
    r.y = max(r.y, 0.01);

    // \u2500\u2500 cloud shadows \u2500\u2500
    // Water under a low cloud is in its shadow: the sun's glitter is gone
    // from it, and the light coming up out of the water is only the sky's,
    // darker and bluer. Found the way the sun finds it \u2014 from the point on
    // the water, up toward the sun to the plane the low clouds are read on,
    // and the same field there, cut the same way, so each shadow is the
    // shadow of a cloud that is drawn. The mirror itself is not shaded: what
    // it shows comes from the sky, not from the sun.
    //
    // The scale: the eye is one unit up, 1.6 m, and the low clouds' plane
    // a kilometre, some 600 units. So the shadows are big, as they are \u2014
    // the near water lies wholly in one or wholly out of one, and the
    // patches show as bands across the far water, breaking up the sun's path
    float shade = 0.0;
    if (sunVis > 0.0 && (u_low.z > 0.02 || u_low.y > 0.02)) {
      // plane units per unit of eye height, at the cumulus plane
      float toPlane = ALT_LOW * 2.5 / 600.0;
      vec2 toSun = sunDir.xz / max(sunDir.y, 0.05);
      // the cumulus' ramp as it is overhead, where the widening the layers
      // take toward the horizon is nil
      float cuRampS = 0.22;
      float sunLit = 1.0;
      if (u_low.z > 0.02) {
        // the cumulus: its crown's threshold, the full footprint of the lump,
        // and its locality field, as the cumulus block takes them
        vec2 x = (wp + toSun * 601.0) * toPlane;
        float edgeS = 0.88 - u_low.z * 0.52;
        edgeS += (fbm2((x + vec2(u_windOff * 0.7, u_windOff * 0.105)) * 0.045 + 61.0) - 0.5)
               * 0.34 * (1.0 - smoothstep(0.55, 0.9, u_low.z));
        vec3 cs = cloudField(x + vec2(u_windOff, u_windOff * 0.15), churn, ldir,
                             edgeS - 0.07, cuRampS, edgeS - 0.08);
        sunLit *= 1.0 - cs.x * smoothstep(0.02, 0.30, u_low.z);
      }
      if (u_low.y > 0.02) {
        // the stratocumulus, on its own lower plane
        vec2 x = (wp + toSun * (600.0 * 1.9 / 2.5 + 1.0)) * toPlane;
        sunLit *= 1.0 - granular(x + vec2(u_windOff * 1.2, u_windOff * 0.18), 1.22, 0.5, 0.78, ldir).x
                     * u_low.y * 0.95;
      }
      // the more of the sun the sky has already taken, the less a cloud's
      // shadow has to take away
      shade = (1.0 - sunLit) * smoothstep(0.0, 0.35, sunVis);
    }

    // \u2500\u2500 the far water \u2500\u2500
    // The last kilometres before the horizon sit behind a long reach of air,
    // which scatters the horizon's own light into the line of sight: the
    // water there takes the horizon sky's color and the sea meets the sky
    // through a soft band rather than along a drawn line \u2014 the clouds and
    // towers the sky carries above that line are not in the mirror, and a
    // hard line made that plain. A little of it even on the clearest day,
    // and a lot in haze, where a sea horizon goes altogether. Folded into
    // the mirror's direction, bent toward the horizon by that much, so the
    // sky is asked only once; the sun, the moon and the water's own color
    // fade by the same amount below
    float seaFog = 1.0 - exp(-dist * (0.0035 + 0.045 * u_haze));
    vec3 rm = normalize(mix(r, vec3(rd.x, 0.0, rd.z), seaFog));
    rm.y = max(rm.y, 0.005);
    float rel = asin(clamp(rm.y, -1.0, 1.0));
    float rh = clamp(rel / (PI * 0.5), 0.0, 1.0);

    // \u2500\u2500 what the mirror shows \u2500\u2500
    float wideSea = 0.0;
    vec3 mir = L(skyWeather(skyBase(rm, rel, rh, sunDir, sunEl, dayF, sunsetF, wideSea), dayF, gloom));
    float clear = 1.0 - seaFog;
    // the sun's path: its disc and halo, as the sky draws them, in the
    // mirrored direction \u2014 the waves' slopes are what spread it into a path.
    // The disc is drawn a little wider than in the sky: the water's finest
    // ripples, under the pixels, scatter it that much
    if (sunVis > 0.0) {
      float ang = acos(clamp(dot(r, sunDir), -1.0, 1.0));
      vec3 sunCol = L(mix(vec3(1.0, 0.98, 0.92), vec3(1.05, 0.6, 0.3), sunsetF));
      float core = clamp(exp(-ang * ang * 400.0) * 2.2, 0.0, 1.0);
      // and none of it where a cloud's shadow lies
      float lightS = sunVis * clear * (1.0 - shade);
      mir = mix(mir, vec3(SUN_LUM), core * lightS);
      mir += sunCol * exp(-ang * 4.0) * 0.22 * HALO_LUM * lightS;
    }
    // the moon's, at night
    if (moonVis > 0.0) {
      float ang = acos(clamp(dot(r, moonDir), -1.0, 1.0));
      mir += L(vec3(1.0, 0.96, 0.88)) * (smoothstep(0.075, 0.035, ang) * 0.55 + exp(-ang * 18.0) * 0.12)
           * moonVis * u_moon.z * MOON_LUM * clear;
    }
    // the city's glow along the horizon, as the sky carries it
    mir += L(vec3(0.26, 0.16, 0.09)) * exp(-rh * 8.0) * starF
         * (0.4 * (u_sky.x - 1.0) / 5.0) * (1.0 - gloom * 0.6);
#ifdef FEAT_AURORA
    // the aurora, under the same night and cloud as in the sky
    if (u_aurora > 0.001) {
      mir += aurora(r, u_aurora) * AURORA_LUM * clear * starF
           * clamp(1.0 - u_cover * 1.4, 0.0, 1.0) * (1.0 - gloom);
    }
#endif
#ifdef FEAT_RAINBOW
    // the rainbow, as the sky draws it but in the mirrored direction. Not the
    // sky's bow turned over: the drops that send it to the water are other
    // drops, at 42\xB0 from the point opposite the sun as seen along the
    // reflected ray, so the bow in the water is centred on that point's
    // image above the horizon \u2014 it stands wider than a mirror image would,
    // and the waves break it up as they do the sun's path
    if (u_rain > 0.01 && sunVis > 0.0) {
      float bAng = acos(clamp(-dot(r, sunDir), -1.0, 1.0));
      float bDeg = bAng * 57.2958;
      if (bDeg > 25.0 && bDeg < 64.0) {
        float bAmt = smoothstep(0.03, 0.25, u_rain) * sqrt(sunVis) * smoothstep(-0.02, 0.06, r.y) * clear;
        float along = fbm2(r.xz * 2.2 + vec2(r.y * 3.1, 7.3) + u_evo * 0.04);
        bAmt *= smoothstep(0.25, 0.65, along) * mix(1.0, 0.35, smoothstep(0.05, 0.65, r.y));
        vec3 bows = bowLight(bDeg);
        float bLum = dot(bows, vec3(0.2126, 0.7152, 0.0722));
        bows = mix(vec3(bLum), bows, 0.72);
        float dark = smoothstep(0.73, 0.76, bAng) * smoothstep(0.90, 0.87, bAng);
        mir *= 1.0 - dark * bAmt * 0.12;
        mir += bows * bAmt * 0.8;
      }
    }
#endif

    // \u2500\u2500 the water itself \u2500\u2500
    // Fresnel: how much of the mirror is seen, against how much of the water
    float cosT = clamp(dot(-rd, n), 0.0, 1.0);
    float f1 = 1.0 - cosT;
    float f2 = f1 * f1;
    float fres = 0.02 + 0.98 * f2 * f2 * f1;
    // light off water is polarized \u2014 wholly so at Brewster's angle, 37\xB0 down \u2014
    // with its e-vector flat along the horizon, which is what a polarizer
    // turned to darken the sky cuts. Cutting the glare off water is the other
    // half of why one is carried
    float brewster = 1.0 - clamp(abs(cosT - 0.60) / 0.60, 0.0, 1.0);
#ifdef FEAT_POLARIZER
    if (u_pol.x > 0.001) mir *= polarizerTransmission(brewster * 0.9, 0.0, polAim);
#endif
    // the body of the water: dark, green-blue, lit by the day; grey under an
    // overcast, murkier in a storm
    vec3 deep = L(mix(vec3(0.010, 0.016, 0.022), vec3(0.030, 0.105, 0.145), dayF));
    deep = mix(deep, L(mix(vec3(0.012, 0.014, 0.017), vec3(0.085, 0.095, 0.105), dayF)),
               smoothstep(0.5, 0.95, u_cover) * 0.8);
    deep = mix(deep, deep * vec3(0.9, 0.85, 0.8), gloom * 0.5);
    // in a cloud's shadow the light down into the water is the sky's alone:
    // less of it, and bluer
    deep *= mix(vec3(1.0), vec3(0.32, 0.42, 0.60), shade);
    // the far water is all air: the water's own color goes with the fog too
    vec3 seaLin = mix(deep, mir, fres + (1.0 - fres) * seaFog);

    // \u2500\u2500 whitecaps \u2500\u2500
    // Past a fresh breeze the crests start to break, and the broken water is
    // foam: white, lit by the whole sky, covering both the mirror and the
    // water beneath. How much of the sea it covers is the measured share
    // (Monahan's, 3.84e-6 \xB7 U^3.41 at U m/s, U got back from u_wind by
    // undoing the wind curve): a fleck here and there at 8 m/s, a few in a
    // hundred by 15, two fifths of the sea in a typhoon. Where the foam lies
    // is a field of noise, held to the crests of the chop; past a gale the
    // wind tears it into streaks along its heading, which is the same field
    // stretched downwind. Like the waves, the foam
    // is laid on the water, so it shrinks with distance \u2014 and once a fleck
    // is smaller than a pixel what is left is its share, a paling of the far
    // water, until the haze takes that too
    float cov = min(3.84e-6 * pow(33.0 * pow(u_wind, 1.25), 3.41), 0.45);
    if (cov > 0.0005) {
      // a fleck of foam is a few tens of centimetres, a fifth of the eye's height
      const float FLECK = 5.0;
      vec2 fp = wp - wdir * (u_windOff * 6.0);
      float stretch = mix(1.6, 8.0, smoothstep(0.6, 0.95, u_wind));
      // two octaves: one alone thresholds into smooth blobs, which read as
      // paint; the second frays them
      vec2 fq = vec2(dot(fp, wdir) / stretch, dot(fp, wperp)) * FLECK + 3.7;
      float fn = vnoise(fq) * 0.62 + vnoise(fq * 2.9 + 11.3) * 0.38;
      // Two kinds of it from the one field. The caps: flecks of solid white
      // where the noise runs high, gathered onto the crests of the chop. And
      // the lace they leave behind as the crest moves on, a net of thin
      // strands \u2014 the lines where the noise crosses its middle \u2014 spread over
      // more of the sea the harder it blows, and torn into streaks with it
      float body = 0.5 * crest + (fn - 0.5);
      // the threshold that leaves cov of the sea white, fitted to how the
      // noise and the crests are distributed
      float th = 0.625 - 0.88 * pow(cov, 0.3);
      // a cap is densest at its heart and thins toward its rim
      float cap = smoothstep(th, th + 0.25, body) * (0.7 + 0.3 * smoothstep(th, th + 0.4, body));
      // in a fresh breeze the lace is only on the crests, and faint; in a
      // gale it spreads across the troughs as well
      float spread = smoothstep(0.02, 0.3, cov);
      float strand = 1.0 - smoothstep(0.0, 0.02 + 0.06 * cov, abs(fn - 0.5));
      float fleck = max(cap, strand * smoothstep(th - 0.1 - 0.4 * spread, th - 0.05, body)
                             * (0.25 + 0.35 * spread));
      // a fleck's size against a pixel's footprint along the water, which
      // grows as the distance squared; past it, the share, still gathered
      // onto the crests as far as the chop reaches
      float fpx = dist * dist * u_cam.z / u_frame.w * FLECK;
      float foam = mix(fleck, clamp(cov * (1.0 + 1.5 * crest), 0.0, 1.0), smoothstep(0.35, 1.4, fpx));
      // white under a clear sky, grey under a storm's; warm at sunset, blue in
      // a cloud's shadow
      vec3 foamCol = mix(vec3(0.10, 0.11, 0.13), vec3(0.90, 0.92, 0.94), dayF);
      foamCol = mix(foamCol, vec3(0.42, 0.45, 0.49) * (0.25 + 0.75 * dayF), gloom * 0.8);
      foamCol *= mix(vec3(1.0), vec3(1.0, 0.86, 0.74), sunsetF * 0.5);
      foamCol *= mix(vec3(1.0), vec3(0.58, 0.64, 0.76), shade);
      seaLin = mix(seaLin, L(foamCol), foam * clear);
    }
    disp = mix(disp, encodeSrgb(seaLin), smoothstep(0.0, -0.012, rd.y) * u_sea.x);
  }
#endif

  // \u2500\u2500 Rain (thin threads slanting with the wind) \u2500\u2500
  // Laid out along the view ray, not the screen: columns stand at fixed
  // azimuths and the drops run down in elevation, so turning the camera
  // carries the rain with the sky instead of leaving it pasted on the glass.
  // A column of constant azimuth is exactly how a vertical line projects, so
  // looking up, the streaks converge on the zenith the way real rain does.
  //
  // The scales are the old screen-space ones re-expressed per radian \u2014 the
  // default framing shows about FALL_REF radians top to bottom \u2014 so the rain
  // looks as it did at that framing, and zooming in magnifies it with the sky.
  if (u_rain * u_fall > 0.001) {
    // az (the clouds' azimuth, above) runs -PI..PI, growing to the right on screen
    float cosEl = sqrt(max(0.0, 1.0 - rd.y * rd.y));
    // ordinary rain falls nearly vertical; only high wind slants it strongly
    float slant = mix(0.06, 0.8, smoothstep(0.3, 1.0, u_wind));
    float rain = 0.0;
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      // a whole number of columns around the horizon, so there is no seam where
      // az wraps. That is due south \u2014 the middle of the default framing \u2014 and
      // with a whole number the wrap shifts gx by exactly cols, which the mod
      // below folds back onto the same column
      float cols = floor(6.2831853 / FALL_REF * mix(220.0, 380.0, fi));
      float gx = (az - el * slant) / 6.2831853 * cols;
      float gy = el / FALL_REF * mix(2.6, 4.2, fi);
      float colId = mod(floor(gx), cols) + fi * 57.0;
      float drop = fract(gy + u_time * mix(5.5, 8.5, fi) * (0.6 + 0.4 * u_wind) + hash11(colId) * 13.0);
      float active = step(mix(0.9, 0.72, u_rain), hash11(colId * 1.37 + fi * 91.0));
      // columns crowd together by 1/cos(elevation) on screen as they converge
      // upward; keep that fraction of them so the density on screen holds
      active *= step(hash11(colId * 2.71 + fi * 7.0), cosEl);
      // draw only the thin thread down the column's center, at a steady width
      // on screen however narrow the column has become
      float line = smoothstep(0.16, 0.05, abs(fract(gx) - 0.5) * max(cosEl, 0.3));
      rain += active * line * smoothstep(0.24, 0.03, drop) * smoothstep(0.0, 0.015, drop);
    }
    disp = mix(disp, disp * 0.92 + vec3(0.5, 0.55, 0.63) * 0.35,
      clamp(rain, 0.0, 1.0) * u_rain * 0.32 * u_fall);
  }

  // \u2500\u2500 Snow \u2500\u2500
  // What actually reads in real snowfall isn't "flakes of one size falling
  // at even spacing". From large, blurred flakes up close to fine ones far
  // away, both size and density scatter continuously with depth. Uniform
  // flake size, or a visible grid, reads as artificial on its own.
  //
  // And another thing: the strongest impression in heavy snow isn't the
  // flakes themselves, but **visibility being whited out**. Drawing flakes
  // alone reads as "white dots floating in a clear sky".
  //
  // The flakes live in a lattice of view directions \u2014 the ray scaled out to a
  // sphere and cut into cubic cells \u2014 rather than on the screen, so they turn
  // with the sky and there is no pole or seam anywhere to look at. They fall
  // down: across the view near the horizon, and straight at the camera
  // looking up. The layer scales are the old screen-space ones per radian (see
  // FALL_REF at the rain), so the default framing looks as it did.
  //
  // Only a shell of the lattice around that sphere is drawn, though, so a
  // flake moving along the ray leaves it: falling straight down while the
  // view looks up, the far flakes crossed it in a fifth of a second and
  // the snow blinked rather than fell. So they fall down the screen instead
  // \u2014 u_snowDrift is integrated along a direction leaned toward the view's
  // own down (snowFallDir), which keeps them in the shell across the middle
  // of the frame, and turning the camera only changes where they go next.
  if (u_snow > 0.001) {
    float flakes = 0.0;
    if (u_fall > 0.001) {
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float k = fi * 0.25;                    // 0=near, 1=far
        // Big and blurred up close, fine far off. A flake is drawn by every
        // pixel whose ray passes near it, from whichever cell that pixel's
        // ray is in \u2014 so a disc that reached past its own cell was cut off
        // square at the cell's face. The pixel searches the 2x2x2 block of
        // cells nearest it instead, and that block reaches at least half a
        // cell each way: a flake's radius plus the shell it is drawn from
        // (the gate below, 0.5 less the radius) keeps every flake inside it. The near layers, whose flakes were
        // wider than that, get bigger cells instead, so they look as large
        // as they did; fewer cells, so more of them are switched on
        float rad0 = mix(0.40, 0.10, k);
        float fit = min(1.0, 0.2 / rad0);
        float rad = rad0 * fit;
        float sc = mix(8.0, 160.0, k * k) * fit;
        // How fast a layer crosses the view goes with how near it is, as its
        // size does: parallax. Faster than that, a far flake moves through the
        // lattice \u2014 and out of the drawn shell, wherever the view is not
        // square to its fall \u2014 in a fraction of a second, and the fine snow
        // twinkled. Not fully in proportion: the far snow would stand still
        float speed = 0.30 * pow((rad0 / mix(8.0, 160.0, k * k)) / 0.05, 0.75);
        float fall = u_time * speed;

        // a per-layer offset keeps the five lattices from lining up
        vec3 g = rd * (sc / FALL_REF) + fi * vec3(0.37, 0.61, 0.23);
        g -= u_snowDrift * (speed * sc);
        // drift with the wind, and tumble side to side while falling
        g.x += (u_wind * fall * 2.6 + sin(g.y * 0.22 + fi * 2.7) * 0.35) * sc * 0.06;

        // how many cells hold a flake: the old density on screen, across
        // fewer, bigger cells for the near layers
        float on = min(1.0, (1.0 - mix(0.94, 0.40, u_snow)) * 2.4 / (fit * fit));
        float edge = mix(0.10, 0.72, k);
        float wt = mix(0.55, 1.0, k);
        float shell = 0.5 - rad;
        // a flake this pixel draws is within this of its sample point, so a
        // neighbouring cell whose nearest face is further off holds none:
        // skipped before any hashing, which leaves about half the block
        float reach2 = rad * rad + shell * shell;
        // the two far layers' flakes are a few pixels across, too small for
        // a cut edge to show: their own cell only
        if (i >= 3) reach2 = -1.0;
        float cy0 = floor(g.y);
        float sy = fract(g.y) < 0.5 ? -1.0 : 1.0;
        float fy = min(fract(g.y), 1.0 - fract(g.y));
        for (int jy = 0; jy < 2; jy++) {
          float dy2 = float(jy) * fy * fy;
          if (jy > 0 && dy2 > reach2) continue;
          float cy = cy0 + float(jy) * sy;
          // shift each horizontal slab of cells. Without this the lattice
          // shows straight through as "flakes falling at even spacing"
          vec3 gs = g;
          gs.x += hash11(cy * 1.37 + fi * 13.0) * 4.0;
          gs.z += hash11(cy * 2.71 + fi * 7.0) * 4.0;
          vec2 c0 = floor(gs.xz);
          vec2 fg = fract(gs.xz);
          vec2 s2 = vec2(fg.x < 0.5 ? -1.0 : 1.0, fg.y < 0.5 ? -1.0 : 1.0);
          vec2 fn = min(fg, 1.0 - fg);
          for (int jx = 0; jx < 2; jx++) {
            for (int jz = 0; jz < 2; jz++) {
              if (jx + jy + jz > 0 && dy2 + float(jx) * fn.x * fn.x + float(jz) * fn.y * fn.y > reach2) continue;
              vec3 cell = vec3(c0.x + float(jx) * s2.x, cy, c0.y + float(jz) * s2.y);
              vec2 ch = cell.xz + cell.y * vec2(37.1, 91.7);
              if (hash12(ch + fi * 37.0) < 1.0 - on) continue;
              // anywhere in its cell: the block search means no margin is needed
              vec3 off = hash32(ch + fi * 11.0);
              vec3 dv = gs - (cell + off);
              // size is the distance across the view; how far the flake sits
              // off the sphere along the ray decides whether it is drawn at all
              float dr = dot(dv, rd);
              float d = length(dv - rd * dr);
              float gate = smoothstep(shell, shell * 0.5, abs(dr));
              flakes += gate * smoothstep(rad, rad * edge, d) * wt;
            }
          }
        }
      }
    }
    disp = mix(disp, vec3(0.95, 0.96, 1.0), clamp(flakes, 0.0, 1.0) * u_snow * 0.85 * u_fall);

    // the snowfall itself whites out visibility \u2014 flakes alone don't sell the impression of heavy snow.
    // a snowy sky is bright grey, unlike a rain cloud, so lift it here
    vec3 whiteout = mix(vec3(0.28, 0.30, 0.34), vec3(0.92, 0.93, 0.95), dayF);
    disp = mix(disp, whiteout, u_snow * 0.55);
  }

  // back to linear light for the flash, which adds
  sky = L(disp);

  // lightning's glow reflected across the whole sky
  sky += flash * L(vec3(0.85, 0.9, 1.1)) * (0.18 + 0.3 * (1.0 - h)) * FLASH_LUM;
  // the blue-white of a flash already runs past 1.0 and gets clipped; in P3 more
  // of it survives. Claimed at the glow's own weight, so it covers the whole sky
  // during a flash and nothing between flashes
  wide = max(wide, clamp(flash * (0.18 + 0.3 * (1.0 - h)), 0.0, 1.0) * 0.7);

#ifdef FEAT_BOLT
  // \u2500\u2500 The bolt \u2500\u2500
  // The flash lights the clouds from inside; now and then the channel itself
  // shows beneath the base \u2014 a crooked line down to the horizon with a fork
  // off it, there for a few frames and gone, a white-violet core in a blue
  // glow, flickering as the return strokes follow. Drawn in ray space at a
  // fixed azimuth, so it stands in the sky as the view swings, and after the
  // clouds, which it hangs below. Every other slot or so; the rest are the
  // sheet lightning the flash alone is
  if (flash > 0.0 && ltPh < 0.10 && hash11(ltCell * 3.3) > 0.4) {
    float azB = hash11(ltCell * 5.9) * 6.2831853;           // where it strikes
    float top = 0.18 + hash11(ltCell * 7.1) * 0.25;         // the base it comes out of
    float dAz = az - azB;
    dAz -= 6.2831853 * floor(dAz / 6.2831853 + 0.5);        // the short way round
    // the channel wanders as it comes down: three octaves along the elevation
    float wob = (vnoise(vec2(el * 9.0, ltCell)) - 0.5) * 0.12
              + (vnoise(vec2(el * 31.0, ltCell + 7.0)) - 0.5) * 0.04
              + (vnoise(vec2(el * 90.0, ltCell + 13.0)) - 0.5) * 0.015;
    float dx = (dAz - wob) * sqrt(max(1.0 - rd.y * rd.y, 0.0));   // across it, in sky radians
    float span = smoothstep(top + 0.02, top - 0.04, el) * smoothstep(-0.01, 0.02, el);
    float core = exp(-dx * dx / 0.000004) * span;
    float glow = exp(-abs(dx) * 60.0) * span;
    // a fork leaving the channel partway down, leaning off to one side
    float forkAt = top * (0.35 + 0.4 * hash11(ltCell * 11.3));
    float lean = (hash11(ltCell * 2.7) - 0.5) * 2.0;
    float fdx = dx - (forkAt - el) * lean;
    float below = step(el, forkAt);
    float fork = (exp(-fdx * fdx / 0.000003) * 0.8 + exp(-abs(fdx) * 90.0) * 0.5)
               * smoothstep(forkAt - 0.14, forkAt - 0.02, el) * below * span;
    float strobe = 0.55 + 0.45 * step(0.5, fract(ltPh * 60.0 + ltCell));
    vec3 bolt = (L(vec3(0.95, 0.90, 1.0)) * (core + fork)
               + L(vec3(0.55, 0.60, 1.0)) * glow * 0.25) * strobe * FLASH_LUM * 1.5;
    sky += bolt;
    wide = max(wide, min(core + fork, 1.0) * 0.5);
  }
#endif

#ifdef FEAT_RAINBOW
  // \u2500\u2500 Rainbow \u2500\u2500
  // Sunlight sent back by the raindrops: a ring 42\xB0 from the point opposite
  // the sun, red on the outside, and a fainter second ring outside it with
  // the colors reversed; between the two the air sends back less and the
  // sky is a shade darker \u2014 Alexander's band. Needs the rain and the sun at
  // once, so a downpour under a full deck shows none; a shower with the sun
  // out behind the camera is the sky it was made for. Drawn after the
  // clouds: the rain falls beneath them
  if (u_rain > 0.01 && sunVis > 0.0) {
    float ang = acos(clamp(-dot(rd, sunDir), -1.0, 1.0));
    // a light shower is bow enough; what the gloom took from the sun's disc
    // it takes from the bow only in part \u2014 a bow stands against dark rain
    float amt = smoothstep(0.03, 0.25, u_rain) * sqrt(sunVis) * smoothstep(-0.02, 0.06, rd.y);
    float deg = ang * 57.2958;
    if (deg > 25.0 && deg < 64.0) {
      // A bow is only where there are drops in the sunlight, and a shower is
      // never an even curtain: it comes and goes along the arc, and is most
      // often strongest low down, in front of the rain, fading as the arc
      // climbs into the drier air above
      float along = fbm2(rd.xz * 2.2 + vec2(rd.y * 3.1, 7.3) + u_evo * 0.04);
      amt *= smoothstep(0.25, 0.65, along) * mix(1.0, 0.35, smoothstep(0.05, 0.65, rd.y));
      vec3 bows = bowLight(deg);
      // the colors are light added to the sky, and never pure: the drops
      // span sizes, and the sun is half a degree across
      float lum = dot(bows, vec3(0.2126, 0.7152, 0.0722));
      bows = mix(vec3(lum), bows, 0.72);
      float dark = smoothstep(0.73, 0.76, ang) * smoothstep(0.90, 0.87, ang);
      sky *= 1.0 - dark * amt * 0.12;
      // already linear: the colors are mixed as light, not as paint
      sky += bows * amt * 0.8;
      // how far the light strays from white is what needs the wide gamut
      float chroma = max(bows.r, max(bows.g, bows.b)) - min(bows.r, min(bows.g, bows.b));
      wide = max(wide, min(chroma * 3.0, 1.0) * amt * 0.6);
    }
  }
#endif

  // \u2500\u2500 Haze/mist (the shorter the visibility, the further out \u2014 toward the horizon \u2014 it crushes white) \u2500\u2500
  if (u_haze > 0.001) {
    vec3 hazeCol = mix(vec3(0.10, 0.11, 0.13), vec3(0.78, 0.80, 0.83), dayF);
    hazeCol = mix(hazeCol, hazeCol * vec3(1.10, 0.98, 0.90), sunsetF * 0.7);
    hazeCol = mix(hazeCol, hazeCol * vec3(0.38, 0.40, 0.45), gloom);
    // thin haze only crushes the horizon; the thicker it gets, the higher it climbs toward the zenith, covering the whole sky
    float reach = mix(0.22, 1.0, u_haze * u_haze);
    // measured from the horizon either way: the ground and the water close
    // below the eye sit behind as little air as the sky high above it
    float hh = clamp(abs(el) / (PI * 0.5), 0.0, 1.0);
    float hz = u_haze * mix(1.0, reach, smoothstep(0.0, 0.45, hh));
    // cutting haze is half the reason to carry the filter \u2014 by as much as
    // the filter actually took from this pixel's sky, so a ring turned to
    // brighten the band leaves the haze alone
    hz *= 1.0 - max(polCut, 0.0) * 0.6;
    sky = overlay(sky, hazeCol, clamp(hz, 0.0, 0.96));
  }

  // \u2500\u2500 Lens flare (only while the sun is on screen. An artifact inside the lens, so screen space) \u2500\u2500
  if (sunVis * u_lensFx > 0.001) {
    vec3 proj = projectDir(sunDir, u_cam.x, u_cam.y, u_cam.z, aspect);
    if (proj.z > 0.0) {
      vec2 sunPos = proj.xy * 0.5 + 0.5;
      vec2 axis = vec2(0.5, 0.5) - sunPos;   // the optical axis from the sun to screen center
      // weaken the further it strays off-screen
      float onScreen = smoothstep(1.6, 0.9, max(abs(proj.x), abs(proj.y)));
      float fl = sunVis * smoothstep(0.02, 0.18, sunEl) * onScreen;
      vec3 flare = vec3(0.0);
      // ghosts lined up along the optical axis (each a different color, from chromatic aberration)
      flare += L(vec3(1.0, 0.75, 0.45)) * 0.055 * ghost(p, sunPos + axis * 0.45, 0.030, aspect);
      flare += L(vec3(0.45, 1.0, 0.60)) * 0.045 * ghost(p, sunPos + axis * 0.75, 0.018, aspect);
      flare += L(vec3(0.55, 0.65, 1.0)) * 0.050 * ghost(p, sunPos + axis * 1.35, 0.055, aspect);
      flare += L(vec3(1.0, 0.55, 0.75)) * 0.035 * ghost(p, sunPos + axis * 1.80, 0.095, aspect);
      // a large, faint colored ring
      float rg = length((p - (sunPos + axis * 1.1)) * vec2(aspect, 1.0));
      flare += L(vec3(0.9, 0.75, 1.0)) * 0.030 * smoothstep(0.012, 0.0, abs(rg - 0.16));
      // an anamorphic-ish horizontal streak
      vec2 dsun = (p - sunPos) * vec2(aspect, 1.0);
      flare += L(vec3(0.8, 0.85, 1.0)) * 0.10 * exp(-abs(dsun.y) * 60.0) * exp(-abs(dsun.x) * 4.0);
      sky += flare * fl;
    }
  }

  // the droplet rim and the vignette are both display-space, so they share one encode
  disp = encodeSrgb(sky);

  // the rim of a lens droplet: bleeds slightly dark
  if (dropMask > 0.0) {
    disp = mix(disp, disp * 0.88 + vec3(0.03), clamp(dropMask, 0.0, 1.0) * 0.55);
  }

  // \u2500\u2500 Vignette \u2500\u2500
  // Display-referred, unlike the polarizer above. A polarizer is a real
  // transmission and belongs in linear light; a vignette is a chosen falloff that
  // was dialled in on encoded values, and multiplying linear light by the same
  // factor lands visibly weaker (0.5 goes to 0.48 instead of 0.45).
  sky = L(disp * (1.0 - 0.22 * u_lensFx * length(p - vec2(0.5, 0.45))));

  // \u2500\u2500 Linear light \u2192 display \u2500\u2500
  // Everything above this line is linear scene light and may run far past 1.0
  // (the sun's core, a lightning flash). Everything below is display-referred:
  // the film grade, the gamut conversion and the dither all keep their original
  // meaning only in encoded values, so they stay on this side of the encode.
  sky = encodeSrgb(tonemap(max(sky, 0.0)));

  // \u2500\u2500 Color filter \u2500\u2500
  if (u_filtAmt > 0.001) {
    float lum = dot(sky, vec3(0.2126, 0.7152, 0.0722));
    vec3 g = mix(vec3(lum), sky, u_filtSat) * u_filtTint;
    g = g * (1.0 - u_filtLift) + u_filtLift;   // lift only the blacks (whites don't move)
    sky = mix(sky, g, clamp(u_filtAmt, 0.0, 1.0));
  }

  // \u2500\u2500 Wide gamut \u2500\u2500
  if (u_p3 > 0.5) {
    // Reading the untransformed values as P3 numbers gives "the same nominal
    // color, at the highest purity P3 can express" \u2014 so reaching past sRGB is
    // exactly undoing part of the conversion. wide=0 is appearance-preserving,
    // wide=1 degenerates to the naive over-saturated flip; nothing in between
    // can blow up, and no new color literal is needed.
    sky = mix(srgbToDisplayP3(sky), sky, clamp(wide, 0.0, 1.0) * ${0 .toFixed(4)});
  }

  // dither (to prevent banding). Last, so it lands in whatever space the 8-bit
  // drawing buffer actually quantizes
  sky += (hash12(gl_FragCoord.xy + fract(u_time)) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(sky, 1.0);
}
`;function Vt(e,t,n){let r=``;for(let[e,t]of Ht)n&e&&(r+=`#define ${t}
`);return(e?`#extension GL_EXT_shader_texture_lod : enable
#define NOISE_FETCH(uv) texture2DLodEXT(u_noise, (uv), 0.0)
#define NOISEQ_FETCH(uv) texture2DLodEXT(u_noiseQ, (uv), 0.0)
#define TURRET_FETCH(uv) texture2DLodEXT(u_turrets, (uv), 0.0)
`:`#define NOISE_FETCH(uv) texture2D(u_noise, (uv))
#define NOISEQ_FETCH(uv) texture2D(u_noiseQ, (uv))
#define TURRET_FETCH(uv) texture2D(u_turrets, (uv))
`)+(e?`#define CLOUD_FETCH(uv) texture2DLodEXT(u_clouds, (uv), 0.0)
`:`#define CLOUD_FETCH(uv) texture2D(u_clouds, (uv))
`)+(t?`#define CLOUD_SPLIT
`:``)+r+Bt}var $={SEA:1,AURORA:2,CONTRAILS:4,RAYS:8,HALOS:16,RAINBOW:32,BOLT:64,DARKSKY:128,POLARIZER:256,SHAFTS:512,CB:1024,BACKLIT:2048,IRIDESCENCE:4096,MOONLIT:8192,CBVOL:16384},Ht=[[$.SEA,`FEAT_SEA`],[$.AURORA,`FEAT_AURORA`],[$.CONTRAILS,`FEAT_CONTRAILS`],[$.RAYS,`FEAT_RAYS`],[$.HALOS,`FEAT_HALOS`],[$.RAINBOW,`FEAT_RAINBOW`],[$.BOLT,`FEAT_BOLT`],[$.DARKSKY,`FEAT_DARKSKY`],[$.POLARIZER,`FEAT_POLARIZER`],[$.SHAFTS,`FEAT_SHAFTS`],[$.CB,`FEAT_CB`],[$.BACKLIT,`FEAT_BACKLIT`],[$.IRIDESCENCE,`FEAT_IRIDESCENCE`],[$.MOONLIT,`FEAT_MOONLIT`],[$.CBVOL,`FEAT_CBVOL`]],Ut=32767;function Wt(e){return e===`2d`||e===`volumetric`?e:`auto`}var Gt=[.42,.52];function Kt(e){let[t,n]=Gt,r=Math.min(Math.max((e-t)/(n-t),0),1);return r*r*(3-2*r)}function qt(e,t=0,n=`auto`){let r=0;e.ground.sea>.001&&(r|=$.SEA),e.celestial.aurora>.001&&(r|=$.AURORA),e.particles.contrails>.001&&(r|=$.CONTRAILS),t>0&&(r|=$.RAYS),e.clouds.cirrostratus>.001&&(r|=$.HALOS),e.rain>.01&&(r|=$.RAINBOW),e.thunder>.001&&(r|=$.BOLT),(e.celestial.bortle<5.95||e.celestial.milkyWay>.001)&&(r|=$.DARKSKY),e.polarizer.strength>.001&&(r|=$.POLARIZER),(e.rain>.01||e.clouds.cumulonimbus>.05&&e.thunder>.001)&&(r|=$.SHAFTS);let i=e.clouds;i.cumulonimbus>.001&&(r|=$.CB),(n===`volumetric`||n===`auto`&&Kt(e.features.distance)>=.5)&&r&$.CB&&(r|=$.CBVOL);let a=Math.sin(e.sunElevation);a>-.0501&&e.cloudCover<.95&&(i.cumulus>.02||i.cumulonimbus>.001)&&(r|=$.BACKLIT);let o=i.altocumulus>.001||i.stratocumulus>.001||i.cumulus>.02||i.stratus>.001;a>-.0201&&o&&(r|=$.IRIDESCENCE);let s=Math.min(Math.max(e.moonEclipse??0,0),1);return(o||i.cirrocumulus>.001)&&Math.sin(e.moonElevation)>-.0301&&a<.1401&&e.moonPhase*(1-.9*s)>0&&(r|=$.MOONLIT),r}function Jt(e,t=0,n=`auto`){let r=qt(e,t,n);if(n!==`auto`||!(r&$.CB))return[{key:r,share:1}];let i=Kt(e.features.distance);return i<=0||i>=1?[{key:r,share:1}]:[{key:r&~$.CBVOL,share:1},{key:r|$.CBVOL,share:i}]}var Yt=8;function Xt(e){let t=0;for(let n=e;n;n>>=1)t+=n&1;return t}var Zt=4096;function Qt(e){let t=Math.sin(e.pitch),n=Math.cos(e.pitch),r=.85*t,i=r*n*Math.sin(e.yaw),a=-1+r*t,o=r*n*Math.cos(e.yaw),s=Math.hypot(i,a,o);return[i/s,a/s,o/s]}function $t(e){return Number.isFinite(e)&&e<.95?Math.max(.25,e):1}function en(e){for(let n of t)if(e[n]>.001)return!0;return!1}var tn=16,nn=`u_noise.u_noiseQ.u_turrets.u_frame.u_aspect.u_time.u_cam.u_sun.u_moon.u_moonEclipse.u_cover.u_high.u_mid.u_low.u_rain.u_snow.u_wind.u_thunder.u_haze.u_cbFeat.u_windOff.u_evo.u_filtAmt.u_filtTint.u_filtSat.u_filtLift.u_p3.u_headroom.u_tone.u_pol.u_sky.u_radiant.u_lensDrops.u_lensFx.u_fall.u_snowDrift.u_sea.u_aurora.u_contrails.u_rays.u_sunset.u_cloudMode.u_clouds`.split(`.`),rn=class{canvas;opts;gl=null;variants=new Map;current=null;wanted=0;frame=0;snowDrift=[0,0,0];snowAt=NaN;reported=!1;parallel=null;explicitLod=!1;buffer=null;noise=null;noiseQ=null;turrets=null;turretData=new Uint8Array(Y*J*4);turretKey=``;probeFbo=null;probeTex=null;probeSize=[0,0];probePixels=null;cloudScaleWanted;raysWanted;cbMode;wantedVol=-1;split;cloudSupport=null;cloudFbo=null;cloudTex=null;cloudSize=[0,0];timer=null;pending=[];gpuTimes=[];u={};lost=!1;p3=!1;poll=0;onLost=e=>{e.preventDefault(),this.lost=!0};onRestored=()=>{this.lost=!1,this.init()};constructor(e,t={}){this.canvas=e,this.opts=t,this.cloudScaleWanted=t.cloudScale??1,this.raysWanted=t.rays??0,this.cbMode=Wt(t.cumulonimbus),this.split=t.cloudScale!==void 0,e.addEventListener(`webglcontextlost`,this.onLost),e.addEventListener(`webglcontextrestored`,this.onRestored),this.init()}get available(){return this.gl!==null}get ready(){return this.gl?!this.parallel||!!this.variants.get(this.wanted)?.linked||this.current!==null:!1}get colorSpace(){return this.p3?`display-p3`:`srgb`}get cloudScale(){return!this.split||this.cloudSupport===!1?1:$t(this.cloudScaleWanted)}set cloudScale(e){this.cloudScaleWanted=e}get rays(){return!this.split||this.cloudSupport===!1?0:Math.min(1,Math.max(0,this.raysWanted))}set rays(e){this.raysWanted=e}get cumulonimbus(){return this.cbMode}set cumulonimbus(e){this.cbMode=Wt(e)}keysFor(e){let t=Ut&~$.CBVOL|(this.cbMode===`2d`?0:$.CBVOL);if(e===null)return[{key:t,share:1}];let n=Jt(e,this.rays,this.cbMode);if(this.opts.variants===!1){if(!(n[0].key&$.CB))return[{key:t,share:1}];for(let e of n)e.key=Ut&~$.CBVOL|e.key&$.CBVOL}return n}takeGpuTimes(){this.harvestTimes();let e=this.gpuTimes;return this.gpuTimes=[],e}init(){this.variants=new Map,this.current=null,this.reported=!1,this.u={},this.stopPolling(),this.probeFbo=null,this.probeTex=null,this.probeSize=[0,0],this.cloudFbo=null,this.cloudTex=null,this.cloudSize=[0,0],this.cloudSupport=null,this.pending=[];let e=this.canvas.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`low-power`});e?(this.gl=e,this.p3=!1,this.opts.colorSpace!==`srgb`&&`drawingBufferColorSpace`in e&&(e.drawingBufferColorSpace=`display-p3`,this.p3=e.drawingBufferColorSpace===`display-p3`),this.explicitLod=e.getExtension(`EXT_shader_texture_lod`)!==null,this.parallel=this.opts.compile===`sync`?null:e.getExtension(`KHR_parallel_shader_compile`),this.noise=this.createNoise(e),this.noiseQ=this.createNoiseQuads(e),this.turrets=this.createTurrets(e),this.buffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.timer=this.opts.timing?e.getExtension(`EXT_disjoint_timer_query`):null,this.parallel?setTimeout(()=>{!this.gl||this.lost||this.variants.size>0||(this.wanted=this.keysFor(null)[0].key,this.ensure(this.wanted))},0):this.notifyReady(!0)):(this.gl=null,this.notifyReady(!1))}prepare(e){if(!this.gl||this.lost)return;let t=this.keysFor(e);this.current===null&&(this.wanted=t[0].key);for(let e of t)this.ensure(e.key)}ensure(e){let t=this.variants.get(e);if(t)return t;let n=this.gl;if(!n)return null;let r=(e,t)=>{let r=n.createShader(e);return r?(n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`atmosphere shader compile error:`,n.getShaderInfoLog(r)),n.deleteShader(r),null)):null},i=r(n.VERTEX_SHADER,zt),a=r(n.FRAGMENT_SHADER,Vt(this.explicitLod,this.split,e)),o=i&&a?n.createProgram():null;if(!i||!a||!o){i&&n.deleteShader(i),a&&n.deleteShader(a);let t={key:e,program:null,u:{},linked:!1,failed:!0,used:this.frame};return this.variants.set(e,t),this.onVariantFailed(t),t}n.attachShader(o,i),n.attachShader(o,a),n.bindAttribLocation(o,0,`a_pos`),n.linkProgram(o),n.deleteShader(i),n.deleteShader(a);let s={key:e,program:o,u:{},linked:!1,failed:!1,used:this.frame};return this.variants.set(e,s),this.evict(),this.parallel?this.startPolling():this.finishLink(s),s}pick(e){this.wanted=e;let t=this.ensure(e);if(!t)return null;if(t.linked)return t;if(t.failed){if(e===0)return null;let t=this.ensure(0);return t?.linked?t:null}return this.standIn(e)??(this.current?.linked?this.current:null)}standIn(e){let t=null;for(let n of this.variants.values())n.linked&&(n.key&e)===e&&(e&$.CB&&(n.key^e)&$.CBVOL||(!t||Xt(n.key)<Xt(t.key))&&(t=n));return t}evict(){let e=this.gl;if(e)for(;this.variants.size>Yt;){let t=null;for(let e of this.variants.values())e!==this.current&&e.key!==this.wanted&&e.key!==this.wantedVol&&(e.linked||e.failed)&&(!t||e.used<t.used)&&(t=e);if(!t)return;t.failed||e.deleteProgram(t.program),this.variants.delete(t.key)}}startPolling(){if(this.poll)return;let e=()=>{this.poll=0;let t=this.gl,n=this.parallel;if(!t||!n)return;let r=!1;for(let e of this.variants.values())e.linked||e.failed||(t.getProgramParameter(e.program,n.COMPLETION_STATUS_KHR)?this.finishLink(e):r=!0);r&&(this.poll=setTimeout(e,tn))};this.poll=setTimeout(e,tn)}createNoise(e){let t=e.createTexture();return t?(e.bindTexture(e.TEXTURE_2D,t),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,G,G,0,e.LUMINANCE,e.UNSIGNED_BYTE,Et()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),t):null}createNoiseQuads(e){let t=e.createTexture();return t?(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,t),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,G,G,0,e.RGBA,e.UNSIGNED_BYTE,Ot()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.activeTexture(e.TEXTURE0),t):null}createTurrets(e){let t=e.createTexture();return t?(e.activeTexture(e.TEXTURE3),e.bindTexture(e.TEXTURE_2D,t),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,Y,J,0,e.RGBA,e.UNSIGNED_BYTE,this.turretData),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.activeTexture(e.TEXTURE0),this.turretKey=``,t):null}updateTurrets(e,t,n){if(e.activeTexture(e.TEXTURE3),e.bindTexture(e.TEXTURE_2D,this.turrets),!this.turrets||!(t.clouds.cumulonimbus>0))return;let r=It(t.clouds.cumulonimbus,t.rain,t.snow,t.wind),i=t.features.distance+` `+n+` `+r;i!==this.turretKey&&(this.turretKey=i,Rt(t.features.distance,n,r,this.turretData),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,0,0,Y,J,e.RGBA,e.UNSIGNED_BYTE,this.turretData))}advanceSnow(e,t){let n=e%Zt,r=Qt(t),i=n-this.snowAt,a=this.snowDrift;i>=0&&i<=1?(a[0]+=r[0]*i,a[1]+=r[1]*i,a[2]+=r[2]*i):(a[0]=r[0]*n,a[1]=r[1]*n,a[2]=r[2]*n),this.snowAt=n}finishLink(e){let t=this.gl;if(t){if(!t.getProgramParameter(e.program,t.LINK_STATUS))console.error(`atmosphere shader link error:`,t.getProgramInfoLog(e.program)),t.deleteProgram(e.program),e.failed=!0,this.onVariantFailed(e);else{t.useProgram(e.program);for(let n of nn)e.u[n]=t.getUniformLocation(e.program,n);t.uniform1i(e.u.u_noise,0),t.uniform1i(e.u.u_clouds,1),t.uniform1i(e.u.u_noiseQ,2),t.uniform1i(e.u.u_turrets,3),e.linked=!0,!this.reported&&e.key===this.wanted&&(this.reported=!0,this.notifyReady(!0))}}}onVariantFailed(e){if(e.key!==0){e.key===this.wanted&&!this.reported&&this.ensure(0);return}let t=this.gl;if(t){for(let e of this.variants.values())e.linked&&t.deleteProgram(e.program);this.noise&&t.deleteTexture(this.noise),this.noiseQ&&t.deleteTexture(this.noiseQ),this.turrets&&t.deleteTexture(this.turrets)}this.variants=new Map,this.current=null,this.noise=null,this.noiseQ=null,this.turrets=null,this.gl=null,this.notifyReady(!1)}notifyReady(e){this.opts.onReady?.(e)}stopPolling(){this.poll&&=(clearTimeout(this.poll),0)}resize(e,t){this.canvas.width=e,this.canvas.height=t,this.gl?.viewport(0,0,e,t)}render(e,t,n=qe,r=0,i=0){this.advanceSnow(e,n);let a=this.passes(t);if(!a)return;let o=this.gl,s=this.canvas.width,c=this.canvas.height,l=this.beginTiming(s*c);a.forEach((a,s)=>this.drawFrame(o,a.v,s>0?a.share:1,e,t,n,r,i)),l&&this.timer.endQueryEXT(this.timer.TIME_ELAPSED_EXT)}passes(e){if(!this.gl||this.lost)return null;let t=this.keysFor(e);if(t.length===1){this.wantedVol=-1;let e=this.pick(t[0].key);return e?[{v:e,share:1}]:null}let[n,r]=t;this.wantedVol=r.key;let i=e=>{let t=this.ensure(e);return t?.linked?t:this.standIn(e)},a=i(n.key),o=i(r.key);if(this.wanted=r.share>=.5?r.key:n.key,a&&o)return[{v:a,share:1},{v:o,share:r.share}];let s=a??o??this.pick(this.wanted);return s?[{v:s,share:1}]:null}drawFrame(e,t,n,r,i,a,o,s){this.bind(t,r,i,o,s);let c=this.u,l=this.canvas.width,u=this.canvas.height;e.uniform1f(c.u_aspect,l/Math.max(1,u)),e.uniform3f(c.u_cam,a.yaw,a.pitch,a.fov);let d=0,f=this.cloudScale;if((f<1||this.rays>0)&&en(i.clouds)){let t=Math.max(1,Math.round(l*f)),n=Math.max(1,Math.round(u*f));this.cloudTarget(e,t,n)&&(e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,this.cloudFbo),e.viewport(0,0,t,n),e.uniform4f(c.u_frame,0,0,t,n),e.uniform1f(c.u_cloudMode,1),e.uniform1f(c.u_lensDrops,0),e.uniform1f(c.u_p3,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,l,u),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.cloudTex),e.activeTexture(e.TEXTURE0),d=2)}e.uniform4f(c.u_frame,0,0,l,u),e.uniform1f(c.u_cloudMode,d),e.uniform1f(c.u_p3,+!!this.p3),e.uniform1f(c.u_lensDrops,i.lens.droplets),e.uniform1f(c.u_lensFx,1),n<1&&this.blendOver(e,n),e.drawArrays(e.TRIANGLES,0,3),n<1&&e.disable(e.BLEND)}blendOver(e,t){e.enable(e.BLEND),e.blendColor(0,0,0,t),e.blendFunc(e.CONSTANT_ALPHA,e.ONE_MINUS_CONSTANT_ALPHA)}beginTiming(e){let t=this.timer;if(!t||(this.harvestTimes(),this.pending.length>=8))return null;let n=t.createQueryEXT();return n?(t.beginQueryEXT(t.TIME_ELAPSED_EXT,n),this.pending.push({q:n,pixels:e}),n):null}harvestTimes(){let e=this.timer,t=this.gl;if(e&&t){if(t.getParameter(e.GPU_DISJOINT_EXT)){for(let t of this.pending)e.deleteQueryEXT(t.q);this.pending=[]}else{for(;this.pending.length;){let t=this.pending[0];if(!e.getQueryObjectEXT(t.q,e.QUERY_RESULT_AVAILABLE_EXT))break;let n=e.getQueryObjectEXT(t.q,e.QUERY_RESULT_EXT);e.deleteQueryEXT(t.q),this.pending.shift(),this.gpuTimes.push({ms:n/1e6,pixels:t.pixels})}this.gpuTimes.length>120&&this.gpuTimes.splice(0,this.gpuTimes.length-120)}}}cloudTarget(e,t,n){if(this.cloudSupport===!1)return!1;if(this.cloudFbo&&this.cloudSize[0]===t&&this.cloudSize[1]===n)return!0;let r=e.getExtension(`OES_texture_half_float`),i=e.getExtension(`OES_texture_half_float_linear`);if(e.getExtension(`EXT_color_buffer_half_float`),!r||!i)return this.cloudSupport=!1,!1;this.freeClouds(e);let a=e.createTexture(),o=e.createFramebuffer();if(!a||!o)return this.cloudSupport=!1,!1;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,r.HALF_FLOAT_OES,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);let s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),this.cloudTex=a,this.cloudFbo=o,s?(this.cloudSupport=!0,this.cloudSize=[t,n],!0):(this.freeClouds(e),this.cloudSupport=!1,!1)}freeClouds(e){this.cloudFbo&&e.deleteFramebuffer(this.cloudFbo),this.cloudTex&&e.deleteTexture(this.cloudTex),this.cloudFbo=null,this.cloudTex=null,this.cloudSize=[0,0]}probe(e,t,n=qe,r=0,i=0,a={}){let[o,s]=a.grid??[8,6],c=ot(o,s,a.environment??!0),l=this.passes(t),u=this.gl;if(!l||!u||!this.probeTarget(u,c))return null;u.bindFramebuffer(u.FRAMEBUFFER,this.probeFbo),l.forEach((a,o)=>{o>0&&this.blendOver(u,a.share),this.drawProbe(u,a.v,c,e,t,n,r,i),o>0&&u.disable(u.BLEND)});let d=this.probePixels;return u.readPixels(0,0,c.width,c.height,u.RGBA,u.UNSIGNED_BYTE,d),u.bindFramebuffer(u.FRAMEBUFFER,null),u.viewport(0,0,this.canvas.width,this.canvas.height),lt(d,c)}drawProbe(e,t,n,r,i,a,o,s){this.bind(t,r,i,o,s);let c=this.u;e.uniform1f(c.u_p3,0);let l=n.cols*R,u=n.frameHeight;e.viewport(0,0,l,u),e.uniform4f(c.u_frame,0,0,l,u),e.uniform1f(c.u_aspect,this.canvas.width/Math.max(1,this.canvas.height)),e.uniform3f(c.u_cam,a.yaw,a.pitch,a.fov),e.uniform1f(c.u_lensDrops,i.lens.droplets),e.uniform1f(c.u_lensFx,1),e.uniform1f(c.u_cloudMode,0),e.drawArrays(e.TRIANGLES,0,3),n.environment&&(e.uniform1f(c.u_aspect,1),e.uniform1f(c.u_lensDrops,0),e.uniform1f(c.u_lensFx,0),Je.forEach((t,n)=>{e.viewport(n*z,u,z,z),e.uniform4f(c.u_frame,n*z,u,z,z),e.uniform3f(c.u_cam,t.yaw,t.pitch,t.fov),e.drawArrays(e.TRIANGLES,0,3)}))}bind(e,t,n,r,i){let a=this.gl;this.current=e,e.used=++this.frame,this.u=e.u,a.useProgram(e.program),this.updateTurrets(a,n,i),a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_2D,this.noiseQ),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.noise);let o=this.u;a.uniform1f(o.u_time,t%Zt),a.uniform3f(o.u_snowDrift,this.snowDrift[0],this.snowDrift[1],this.snowDrift[2]),a.uniform2f(o.u_sun,n.sunElevation,n.sunAzimuth);let s=Math.min(Math.max(n.moonEclipse??0,0),1);a.uniform3f(o.u_moon,n.moonElevation,n.moonAzimuth,n.moonPhase*(1-.9*s)),a.uniform1f(o.u_moonEclipse,s);let c=n.clouds;a.uniform1f(o.u_cover,n.cloudCover),a.uniform3f(o.u_high,c.cirrus,c.cirrostratus,c.cirrocumulus),a.uniform3f(o.u_mid,c.altostratus,c.altocumulus,c.nimbostratus),a.uniform4f(o.u_low,c.stratus,c.stratocumulus,c.cumulus,c.cumulonimbus),a.uniform1f(o.u_rain,n.rain),a.uniform1f(o.u_snow,n.snow),a.uniform1f(o.u_fall,n.particles.precipitation),a.uniform2f(o.u_sea,n.ground.sea,n.ground.swell),a.uniform2f(o.u_sunset,n.sunset.warmth,n.sunset.glow),a.uniform1f(o.u_wind,n.wind),a.uniform1f(o.u_thunder,n.thunder),a.uniform1f(o.u_haze,n.haze),a.uniform4f(o.u_cbFeat,n.features.anvil,n.features.velum,n.features.distance,n.features.softness),a.uniform1f(o.u_windOff,r),a.uniform1f(o.u_evo,i),a.uniform1f(o.u_filtAmt,n.filter.amount),a.uniform3f(o.u_filtTint,n.filter.tint[0],n.filter.tint[1],n.filter.tint[2]),a.uniform1f(o.u_filtSat,n.filter.saturation),a.uniform1f(o.u_filtLift,n.filter.lift),a.uniform1f(o.u_headroom,Math.max(1,this.opts.headroom??1));let l=n.tone;a.uniform4f(o.u_tone,l.exposure,l.contrast,l.knee,l.bleach);let u=n.polarizer;a.uniform4f(o.u_pol,u.strength,u.angle,u.saturation,u.stopLoss);let d=n.celestial;a.uniform4f(o.u_sky,d.bortle,d.milkyWay,d.meteors,+!!d.radiant),a.uniform2f(o.u_radiant,d.radiant?.[0]??0,d.radiant?.[1]??0),a.uniform1f(o.u_aurora,d.aurora),a.uniform1f(o.u_contrails,n.particles.contrails),a.uniform1f(o.u_rays,this.rays)}probeTarget(e,t){if(this.probeFbo&&this.probeSize[0]===t.width&&this.probeSize[1]===t.height)return!0;this.freeProbe(e);let n=e.createTexture(),r=e.createFramebuffer();if(!n||!r)return!1;e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t.width,t.height,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let i=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,this.noise),this.probeTex=n,this.probeFbo=r,i?(this.probeSize=[t.width,t.height],this.probePixels=new Uint8Array(t.width*t.height*4),!0):(this.freeProbe(e),!1)}freeProbe(e){this.probeFbo&&e.deleteFramebuffer(this.probeFbo),this.probeTex&&e.deleteTexture(this.probeTex),this.probeFbo=null,this.probeTex=null,this.probeSize=[0,0]}dispose(e={}){let t=this.gl;if(this.stopPolling(),this.canvas.removeEventListener(`webglcontextlost`,this.onLost),this.canvas.removeEventListener(`webglcontextrestored`,this.onRestored),t){for(let e of this.variants.values())e.failed||t.deleteProgram(e.program);this.buffer&&t.deleteBuffer(this.buffer),this.noise&&t.deleteTexture(this.noise),this.noiseQ&&t.deleteTexture(this.noiseQ),this.turrets&&t.deleteTexture(this.turrets),this.freeProbe(t),this.freeClouds(t);for(let e of this.pending)this.timer?.deleteQueryEXT(e.q);this.pending=[],e.loseContext&&t.getExtension(`WEBGL_lose_context`)?.loseContext()}this.gl=null,this.variants=new Map,this.current=null,this.buffer=null,this.noise=null,this.noiseQ=null,this.turrets=null}},an=()=>Math.min(typeof devicePixelRatio==`number`?devicePixelRatio:1,1.5)*.55,on=class{canvas;renderer;animator;opts;target;conditions;cam;raf=0;observer=null;startedAt=0;last=0;lastDraw=0;wantRunning=!1;motionQuery=null;measured=null;governor=null;fallbackSize;lastProbe=-1/0;onRendererReady=e=>{e&&this.wantRunning&&!this.raf&&this.draw(performance.now()),this.opts.onReady?.(e)};onMotionChange=()=>{this.wantRunning&&(this.reducedMotion?(this.stopLoop(),this.jump()):this.startLoop())};constructor(e,t={}){this.canvas=e,this.opts=t,this.conditions={time:t.time,location:t.location,weather:t.weather,filter:t.filter,tone:t.tone,polarizer:t.polarizer,celestial:t.celestial,lens:t.lens,particles:t.particles,ground:t.ground,sunset:t.sunset,camera:t.camera},this.target=Xe(this.conditions),this.cam=Ze(t.camera),this.fallbackSize=[e.width,e.height];let n=t.adaptiveResolution;if(n){let e=typeof n==`object`?n:{};this.governor=new bt({budget:e.budget??.75*(1e3/Math.min(t.fps??30,60)),min:e.min})}this.renderer=new rn(e,{colorSpace:t.colorSpace,onReady:this.onRendererReady,cloudScale:t.cloudScale,rays:t.rays===!0?1:t.rays===!1?0:t.rays,variants:t.variants,cumulonimbus:t.cumulonimbus,timing:!!n}),this.renderer.prepare(this.target),this.animator=new h(this.target,t.animator),this.resize(),typeof ResizeObserver<`u`&&(this.observer=new ResizeObserver(()=>this.resize()),this.observer.observe(e)),t.respectReducedMotion!==!1&&typeof matchMedia<`u`&&(this.motionQuery=matchMedia(`(prefers-reduced-motion: reduce)`),this.motionQuery.addEventListener(`change`,this.onMotionChange)),t.autoStart!==!1&&this.start()}get reducedMotion(){return this.motionQuery?.matches??!1}get available(){return this.renderer.available}get ready(){return this.renderer.ready}get colorSpace(){return this.renderer.colorSpace}get resolution(){return this.governor?.scale??1}get cloudScale(){return this.renderer.cloudScale}set cloudScale(e){this.renderer.cloudScale=e,this.wantRunning&&!this.raf&&this.draw(performance.now())}get cumulonimbus(){return this.renderer.cumulonimbus}set cumulonimbus(e){this.renderer.cumulonimbus=e,this.renderer.prepare(this.target),this.wantRunning&&!this.raf&&this.draw(performance.now())}get rays(){return this.renderer.rays}set rays(e){this.renderer.rays=e,this.wantRunning&&!this.raf&&this.draw(performance.now())}get state(){let e=this.animator.current;return{...e,clouds:{...e.clouds},features:{...e.features},filter:{...e.filter,tint:[...e.filter.tint]},tone:{...e.tone},polarizer:{...e.polarizer},celestial:{...e.celestial,radiant:e.celestial.radiant?[e.celestial.radiant[0],e.celestial.radiant[1]]:null},lens:{...e.lens},particles:{...e.particles},ground:{...e.ground},sunset:{...e.sunset}}}get camera(){return this.cam}get light(){let e=this.canvas.width,t=this.canvas.height;return{...at(this.animator.current,this.cam,e/Math.max(1,t)),frame:this.measured?.frame??null,environment:this.measured?.environment??null}}measureLight(e={}){let t=this.probe(performance.now(),{...this.probeOptions,...e});if(!t)return null;this.measured=t,this.lastProbe=performance.now();let n=this.light;return this.opts.onLight?.(n),n}get probeOptions(){let e=this.opts.lightProbe;return typeof e==`object`?e:{}}probe(e,t){return this.renderer.probe((e-(this.startedAt||e))/1e3,this.animator.current,this.cam,this.animator.wind,this.animator.evolution,t)}set(e){this.applyConditions(e),this.wantRunning&&!this.raf&&this.reducedMotion&&(this.animator.jump(this.target),this.draw(performance.now()))}jump(e={}){this.applyConditions(e),this.animator.jump(this.target),this.draw(performance.now())}applyConditions(e){this.conditions={...this.conditions,...e},this.target=Xe(this.conditions),e.camera&&(this.cam=Ze({...this.cam,...e.camera})),this.renderer.prepare(this.target)}resize(){let[e,t]=this.fullSize(),n=this.resolution;this.renderer.resize(Math.max(1,Math.round(e*n)),Math.max(1,Math.round(t*n)))}fullSize(){let e=this.opts.resolutionScale??an(),t=this.canvas.clientWidth||this.fallbackSize[0],n=this.canvas.clientHeight||this.fallbackSize[1];return[Math.max(1,Math.round(t*e)),Math.max(1,Math.round(n*e))]}start(){this.available&&(this.wantRunning=!0,this.reducedMotion?this.jump():this.startLoop())}stop(){this.wantRunning=!1,this.stopLoop()}startLoop(){if(this.raf)return;let e=performance.now();this.startedAt||=e,this.last=e;let t=e=>{this.raf=requestAnimationFrame(t);let n=1e3/(this.opts.fps??30),r=e-this.lastDraw;r<n||(this.lastDraw=e-r%n,this.draw(e))};this.raf=requestAnimationFrame(t)}stopLoop(){this.raf&&=(cancelAnimationFrame(this.raf),0)}draw(e){this.startedAt||(this.startedAt=e,this.last=e);let t=Math.min(.2,(e-this.last)/1e3);if(this.last=e,this.animator.step(this.target,t),this.reducedMotion&&(this.animator.current.celestial.meteors=0),this.opts.lightProbe&&this.maybeProbe(e),this.renderer.render((e-this.startedAt)/1e3,this.animator.current,this.cam,this.animator.wind,this.animator.evolution),this.governor){let t=this.renderer.takeGpuTimes();if(t.length){let[n,r]=this.fullSize(),i=this.governor.scale;this.governor.update(t,n*r,e)!==i&&this.resize()}}}maybeProbe(e){let t=this.probeOptions,n=!this.raf,r=1e3/Math.max(.1,t.rate??10);if(!n&&e-this.lastProbe<r)return;let i=this.probe(e,t);if(!i)return;let a=Math.max(0,t.smoothing??.3),o=Math.min(1,(e-this.lastProbe)/1e3),s=n||!this.measured||a===0?1:1-Math.exp(-o/a);this.measured=this.measured?ut(this.measured,i,s):i,this.lastProbe=e,this.opts.onLight?.(this.light)}dispose(e={}){this.stop(),this.observer?.disconnect(),this.observer=null,this.motionQuery?.removeEventListener(`change`,this.onMotionChange),this.motionQuery=null,this.renderer.dispose(e)}};function sn(e,t){let n={};for(let r of Object.keys(e))n[r]=t(e[r]);return n}sn(Ve,e=>e.label),sn(w,e=>e.label),sn(e,e=>({label:e.label,alias:e.alias}));export{on as Atmosphere};