(self.webpackChunkflowmazonfrontend=self.webpackChunkflowmazonfrontend||[]).push([[16],{"./node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.umd.js":function(__unused_webpack_module,exports,__webpack_require__){var Buffer=__webpack_require__("./node_modules/buffer/index.js").Buffer;!function(exports){"use strict";const comma=",".charCodeAt(0),semicolon=";".charCodeAt(0),chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",intToChar=new Uint8Array(64),charToInt=new Uint8Array(128);for(let i=0;i<chars.length;i++){const c=chars.charCodeAt(i);intToChar[i]=c,charToInt[c]=i}function decodeInteger(reader,relative){let value=0,shift=0,integer=0;do{const c=reader.next();integer=charToInt[c],value|=(31&integer)<<shift,shift+=5}while(32&integer);const shouldNegate=1&value;return value>>>=1,shouldNegate&&(value=-2147483648|-value),relative+value}function encodeInteger(builder,num,relative){let delta=num-relative;delta=delta<0?-delta<<1|1:delta<<1;do{let clamped=31&delta;delta>>>=5,delta>0&&(clamped|=32),builder.write(intToChar[clamped])}while(delta>0);return num}function hasMoreVlq(reader,max){return!(reader.pos>=max)&&reader.peek()!==comma}const bufLength=16384,td="undefined"!=typeof TextDecoder?new TextDecoder:void 0!==Buffer?{decode:buf=>Buffer.from(buf.buffer,buf.byteOffset,buf.byteLength).toString()}:{decode(buf){let out="";for(let i=0;i<buf.length;i++)out+=String.fromCharCode(buf[i]);return out}};class StringWriter{constructor(){this.pos=0,this.out="",this.buffer=new Uint8Array(bufLength)}write(v){const{buffer}=this;buffer[this.pos++]=v,this.pos===bufLength&&(this.out+=td.decode(buffer),this.pos=0)}flush(){const{buffer,out,pos}=this;return pos>0?out+td.decode(buffer.subarray(0,pos)):out}}class StringReader{constructor(buffer){this.pos=0,this.buffer=buffer}next(){return this.buffer.charCodeAt(this.pos++)}peek(){return this.buffer.charCodeAt(this.pos)}indexOf(char){const{buffer,pos}=this,idx=buffer.indexOf(char,pos);return-1===idx?buffer.length:idx}}const EMPTY=[];function decodeOriginalScopes(input){const{length}=input,reader=new StringReader(input),scopes=[],stack=[];let line=0;for(;reader.pos<length;reader.pos++){line=decodeInteger(reader,line);const column=decodeInteger(reader,0);if(!hasMoreVlq(reader,length)){const last=stack.pop();last[2]=line,last[3]=column;continue}const kind=decodeInteger(reader,0),scope=1&decodeInteger(reader,0)?[line,column,0,0,kind,decodeInteger(reader,0)]:[line,column,0,0,kind];let vars=EMPTY;if(hasMoreVlq(reader,length)){vars=[];do{const varsIndex=decodeInteger(reader,0);vars.push(varsIndex)}while(hasMoreVlq(reader,length))}scope.vars=vars,scopes.push(scope),stack.push(scope)}return scopes}function encodeOriginalScopes(scopes){const writer=new StringWriter;for(let i=0;i<scopes.length;)i=_encodeOriginalScopes(scopes,i,writer,[0]);return writer.flush()}function _encodeOriginalScopes(scopes,index,writer,state){const scope=scopes[index],{0:startLine,1:startColumn,2:endLine,3:endColumn,4:kind,vars}=scope;index>0&&writer.write(comma),state[0]=encodeInteger(writer,startLine,state[0]),encodeInteger(writer,startColumn,0),encodeInteger(writer,kind,0),encodeInteger(writer,6===scope.length?1:0,0),6===scope.length&&encodeInteger(writer,scope[5],0);for(const v of vars)encodeInteger(writer,v,0);for(index++;index<scopes.length;){const next=scopes[index],{0:l,1:c}=next;if(l>endLine||l===endLine&&c>=endColumn)break;index=_encodeOriginalScopes(scopes,index,writer,state)}return writer.write(comma),state[0]=encodeInteger(writer,endLine,state[0]),encodeInteger(writer,endColumn,0),index}function decodeGeneratedRanges(input){const{length}=input,reader=new StringReader(input),ranges=[],stack=[];let genLine=0,definitionSourcesIndex=0,definitionScopeIndex=0,callsiteSourcesIndex=0,callsiteLine=0,callsiteColumn=0,bindingLine=0,bindingColumn=0;do{const semi=reader.indexOf(";");let genColumn=0;for(;reader.pos<semi;reader.pos++){if(genColumn=decodeInteger(reader,genColumn),!hasMoreVlq(reader,semi)){const last=stack.pop();last[2]=genLine,last[3]=genColumn;continue}const fields=decodeInteger(reader,0),hasCallsite=2&fields,hasScope=4&fields;let range,callsite=null,bindings=EMPTY;if(1&fields){const defSourcesIndex=decodeInteger(reader,definitionSourcesIndex);definitionScopeIndex=decodeInteger(reader,definitionSourcesIndex===defSourcesIndex?definitionScopeIndex:0),definitionSourcesIndex=defSourcesIndex,range=[genLine,genColumn,0,0,defSourcesIndex,definitionScopeIndex]}else range=[genLine,genColumn,0,0];if(range.isScope=!!hasScope,hasCallsite){const prevCsi=callsiteSourcesIndex,prevLine=callsiteLine;callsiteSourcesIndex=decodeInteger(reader,callsiteSourcesIndex);const sameSource=prevCsi===callsiteSourcesIndex;callsiteLine=decodeInteger(reader,sameSource?callsiteLine:0),callsiteColumn=decodeInteger(reader,sameSource&&prevLine===callsiteLine?callsiteColumn:0),callsite=[callsiteSourcesIndex,callsiteLine,callsiteColumn]}if(range.callsite=callsite,hasMoreVlq(reader,semi)){bindings=[];do{bindingLine=genLine,bindingColumn=genColumn;const expressionsCount=decodeInteger(reader,0);let expressionRanges;if(expressionsCount<-1){expressionRanges=[[decodeInteger(reader,0)]];for(let i=-1;i>expressionsCount;i--){const prevBl=bindingLine;bindingLine=decodeInteger(reader,bindingLine),bindingColumn=decodeInteger(reader,bindingLine===prevBl?bindingColumn:0);const expression=decodeInteger(reader,0);expressionRanges.push([expression,bindingLine,bindingColumn])}}else expressionRanges=[[expressionsCount]];bindings.push(expressionRanges)}while(hasMoreVlq(reader,semi))}range.bindings=bindings,ranges.push(range),stack.push(range)}genLine++,reader.pos=semi+1}while(reader.pos<length);return ranges}function encodeGeneratedRanges(ranges){if(0===ranges.length)return"";const writer=new StringWriter;for(let i=0;i<ranges.length;)i=_encodeGeneratedRanges(ranges,i,writer,[0,0,0,0,0,0,0]);return writer.flush()}function _encodeGeneratedRanges(ranges,index,writer,state){const range=ranges[index],{0:startLine,1:startColumn,2:endLine,3:endColumn,isScope,callsite,bindings}=range;if(state[0]<startLine?(catchupLine(writer,state[0],startLine),state[0]=startLine,state[1]=0):index>0&&writer.write(comma),state[1]=encodeInteger(writer,range[1],state[1]),encodeInteger(writer,(6===range.length?1:0)|(callsite?2:0)|(isScope?4:0),0),6===range.length){const{4:sourcesIndex,5:scopesIndex}=range;sourcesIndex!==state[2]&&(state[3]=0),state[2]=encodeInteger(writer,sourcesIndex,state[2]),state[3]=encodeInteger(writer,scopesIndex,state[3])}if(callsite){const{0:sourcesIndex,1:callLine,2:callColumn}=range.callsite;sourcesIndex!==state[4]?(state[5]=0,state[6]=0):callLine!==state[5]&&(state[6]=0),state[4]=encodeInteger(writer,sourcesIndex,state[4]),state[5]=encodeInteger(writer,callLine,state[5]),state[6]=encodeInteger(writer,callColumn,state[6])}if(bindings)for(const binding of bindings){binding.length>1&&encodeInteger(writer,-binding.length,0),encodeInteger(writer,binding[0][0],0);let bindingStartLine=startLine,bindingStartColumn=startColumn;for(let i=1;i<binding.length;i++){const expRange=binding[i];bindingStartLine=encodeInteger(writer,expRange[1],bindingStartLine),bindingStartColumn=encodeInteger(writer,expRange[2],bindingStartColumn),encodeInteger(writer,expRange[0],0)}}for(index++;index<ranges.length;){const next=ranges[index],{0:l,1:c}=next;if(l>endLine||l===endLine&&c>=endColumn)break;index=_encodeGeneratedRanges(ranges,index,writer,state)}return state[0]<endLine?(catchupLine(writer,state[0],endLine),state[0]=endLine,state[1]=0):writer.write(comma),state[1]=encodeInteger(writer,endColumn,state[1]),index}function catchupLine(writer,lastLine,line){do{writer.write(semicolon)}while(++lastLine<line)}function decode(mappings){const{length}=mappings,reader=new StringReader(mappings),decoded=[];let genColumn=0,sourcesIndex=0,sourceLine=0,sourceColumn=0,namesIndex=0;do{const semi=reader.indexOf(";"),line=[];let sorted=!0,lastCol=0;for(genColumn=0;reader.pos<semi;){let seg;genColumn=decodeInteger(reader,genColumn),genColumn<lastCol&&(sorted=!1),lastCol=genColumn,hasMoreVlq(reader,semi)?(sourcesIndex=decodeInteger(reader,sourcesIndex),sourceLine=decodeInteger(reader,sourceLine),sourceColumn=decodeInteger(reader,sourceColumn),hasMoreVlq(reader,semi)?(namesIndex=decodeInteger(reader,namesIndex),seg=[genColumn,sourcesIndex,sourceLine,sourceColumn,namesIndex]):seg=[genColumn,sourcesIndex,sourceLine,sourceColumn]):seg=[genColumn],line.push(seg),reader.pos++}sorted||sort(line),decoded.push(line),reader.pos=semi+1}while(reader.pos<=length);return decoded}function sort(line){line.sort(sortComparator)}function sortComparator(a,b){return a[0]-b[0]}function encode(decoded){const writer=new StringWriter;let sourcesIndex=0,sourceLine=0,sourceColumn=0,namesIndex=0;for(let i=0;i<decoded.length;i++){const line=decoded[i];if(i>0&&writer.write(semicolon),0===line.length)continue;let genColumn=0;for(let j=0;j<line.length;j++){const segment=line[j];j>0&&writer.write(comma),genColumn=encodeInteger(writer,segment[0],genColumn),1!==segment.length&&(sourcesIndex=encodeInteger(writer,segment[1],sourcesIndex),sourceLine=encodeInteger(writer,segment[2],sourceLine),sourceColumn=encodeInteger(writer,segment[3],sourceColumn),4!==segment.length&&(namesIndex=encodeInteger(writer,segment[4],namesIndex)))}}return writer.flush()}exports.decode=decode,exports.decodeGeneratedRanges=decodeGeneratedRanges,exports.decodeOriginalScopes=decodeOriginalScopes,exports.encode=encode,exports.encodeGeneratedRanges=encodeGeneratedRanges,exports.encodeOriginalScopes=encodeOriginalScopes,Object.defineProperty(exports,"__esModule",{value:!0})}(exports)},"./node_modules/magic-string/dist/magic-string.es.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Bundle:()=>Bundle,SourceMap:()=>SourceMap,default:()=>MagicString});var _jridgewell_sourcemap_codec__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.umd.js"),Buffer=__webpack_require__("./node_modules/buffer/index.js").Buffer,console=__webpack_require__("./node_modules/console-browserify/index.js");class BitSet{constructor(arg){this.bits=arg instanceof BitSet?arg.bits.slice():[]}add(n){this.bits[n>>5]|=1<<(31&n)}has(n){return!!(this.bits[n>>5]&1<<(31&n))}}class Chunk{constructor(start,end,content){this.start=start,this.end=end,this.original=content,this.intro="",this.outro="",this.content=content,this.storeName=!1,this.edited=!1,this.previous=null,this.next=null}appendLeft(content){this.outro+=content}appendRight(content){this.intro=this.intro+content}clone(){const chunk=new Chunk(this.start,this.end,this.original);return chunk.intro=this.intro,chunk.outro=this.outro,chunk.content=this.content,chunk.storeName=this.storeName,chunk.edited=this.edited,chunk}contains(index){return this.start<index&&index<this.end}eachNext(fn){let chunk=this;for(;chunk;)fn(chunk),chunk=chunk.next}eachPrevious(fn){let chunk=this;for(;chunk;)fn(chunk),chunk=chunk.previous}edit(content,storeName,contentOnly){return this.content=content,contentOnly||(this.intro="",this.outro=""),this.storeName=storeName,this.edited=!0,this}prependLeft(content){this.outro=content+this.outro}prependRight(content){this.intro=content+this.intro}reset(){this.intro="",this.outro="",this.edited&&(this.content=this.original,this.storeName=!1,this.edited=!1)}split(index){const sliceIndex=index-this.start,originalBefore=this.original.slice(0,sliceIndex),originalAfter=this.original.slice(sliceIndex);this.original=originalBefore;const newChunk=new Chunk(index,this.end,originalAfter);return newChunk.outro=this.outro,this.outro="",this.end=index,this.edited?(newChunk.edit("",!1),this.content=""):this.content=originalBefore,newChunk.next=this.next,newChunk.next&&(newChunk.next.previous=newChunk),newChunk.previous=this,this.next=newChunk,newChunk}toString(){return this.intro+this.content+this.outro}trimEnd(rx){if(this.outro=this.outro.replace(rx,""),this.outro.length)return!0;const trimmed=this.content.replace(rx,"");return trimmed.length?(trimmed!==this.content&&(this.split(this.start+trimmed.length).edit("",void 0,!0),this.edited&&this.edit(trimmed,this.storeName,!0)),!0):(this.edit("",void 0,!0),this.intro=this.intro.replace(rx,""),!!this.intro.length||void 0)}trimStart(rx){if(this.intro=this.intro.replace(rx,""),this.intro.length)return!0;const trimmed=this.content.replace(rx,"");if(trimmed.length){if(trimmed!==this.content){const newChunk=this.split(this.end-trimmed.length);this.edited&&newChunk.edit(trimmed,this.storeName,!0),this.edit("",void 0,!0)}return!0}return this.edit("",void 0,!0),this.outro=this.outro.replace(rx,""),!!this.outro.length||void 0}}function getBtoa(){return"undefined"!=typeof globalThis&&"function"==typeof globalThis.btoa?str=>globalThis.btoa(unescape(encodeURIComponent(str))):"function"==typeof Buffer?str=>Buffer.from(str,"utf-8").toString("base64"):()=>{throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.")}}const btoa=getBtoa();class SourceMap{constructor(properties){this.version=3,this.file=properties.file,this.sources=properties.sources,this.sourcesContent=properties.sourcesContent,this.names=properties.names,this.mappings=(0,_jridgewell_sourcemap_codec__WEBPACK_IMPORTED_MODULE_0__.encode)(properties.mappings),void 0!==properties.x_google_ignoreList&&(this.x_google_ignoreList=properties.x_google_ignoreList),void 0!==properties.debugId&&(this.debugId=properties.debugId)}toString(){return JSON.stringify(this)}toUrl(){return"data:application/json;charset=utf-8;base64,"+btoa(this.toString())}}function getRelativePath(from,to){const fromParts=from.split(/[/\\]/),toParts=to.split(/[/\\]/);for(fromParts.pop();fromParts[0]===toParts[0];)fromParts.shift(),toParts.shift();if(fromParts.length){let i=fromParts.length;for(;i--;)fromParts[i]=".."}return fromParts.concat(toParts).join("/")}const toString=Object.prototype.toString;function isObject(thing){return"[object Object]"===toString.call(thing)}function getLocator(source){const originalLines=source.split("\n"),lineOffsets=[];for(let i=0,pos=0;i<originalLines.length;i++)lineOffsets.push(pos),pos+=originalLines[i].length+1;return function locate(index){let i=0,j=lineOffsets.length;for(;i<j;){const m=i+j>>1;index<lineOffsets[m]?j=m:i=m+1}const line=i-1;return{line,column:index-lineOffsets[line]}}}const wordRegex=/\w/;class Mappings{constructor(hires){this.hires=hires,this.generatedCodeLine=0,this.generatedCodeColumn=0,this.raw=[],this.rawSegments=this.raw[this.generatedCodeLine]=[],this.pending=null}addEdit(sourceIndex,content,loc,nameIndex){if(content.length){const contentLengthMinusOne=content.length-1;let contentLineEnd=content.indexOf("\n",0),previousContentLineEnd=-1;for(;contentLineEnd>=0&&contentLengthMinusOne>contentLineEnd;){const segment=[this.generatedCodeColumn,sourceIndex,loc.line,loc.column];nameIndex>=0&&segment.push(nameIndex),this.rawSegments.push(segment),this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,previousContentLineEnd=contentLineEnd,contentLineEnd=content.indexOf("\n",contentLineEnd+1)}const segment=[this.generatedCodeColumn,sourceIndex,loc.line,loc.column];nameIndex>=0&&segment.push(nameIndex),this.rawSegments.push(segment),this.advance(content.slice(previousContentLineEnd+1))}else this.pending&&(this.rawSegments.push(this.pending),this.advance(content));this.pending=null}addUneditedChunk(sourceIndex,chunk,original,loc,sourcemapLocations){let originalCharIndex=chunk.start,first=!0,charInHiresBoundary=!1;for(;originalCharIndex<chunk.end;){if("\n"===original[originalCharIndex])loc.line+=1,loc.column=0,this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,first=!0,charInHiresBoundary=!1;else{if(this.hires||first||sourcemapLocations.has(originalCharIndex)){const segment=[this.generatedCodeColumn,sourceIndex,loc.line,loc.column];"boundary"===this.hires?wordRegex.test(original[originalCharIndex])?charInHiresBoundary||(this.rawSegments.push(segment),charInHiresBoundary=!0):(this.rawSegments.push(segment),charInHiresBoundary=!1):this.rawSegments.push(segment)}loc.column+=1,this.generatedCodeColumn+=1,first=!1}originalCharIndex+=1}this.pending=null}advance(str){if(!str)return;const lines=str.split("\n");if(lines.length>1){for(let i=0;i<lines.length-1;i++)this.generatedCodeLine++,this.raw[this.generatedCodeLine]=this.rawSegments=[];this.generatedCodeColumn=0}this.generatedCodeColumn+=lines[lines.length-1].length}}const n="\n",warned={insertLeft:!1,insertRight:!1,storeName:!1};class MagicString{constructor(string,options={}){const chunk=new Chunk(0,string.length,string);Object.defineProperties(this,{original:{writable:!0,value:string},outro:{writable:!0,value:""},intro:{writable:!0,value:""},firstChunk:{writable:!0,value:chunk},lastChunk:{writable:!0,value:chunk},lastSearchedChunk:{writable:!0,value:chunk},byStart:{writable:!0,value:{}},byEnd:{writable:!0,value:{}},filename:{writable:!0,value:options.filename},indentExclusionRanges:{writable:!0,value:options.indentExclusionRanges},sourcemapLocations:{writable:!0,value:new BitSet},storedNames:{writable:!0,value:{}},indentStr:{writable:!0,value:void 0},ignoreList:{writable:!0,value:options.ignoreList},offset:{writable:!0,value:options.offset||0}}),this.byStart[0]=chunk,this.byEnd[string.length]=chunk}addSourcemapLocation(char){this.sourcemapLocations.add(char)}append(content){if("string"!=typeof content)throw new TypeError("outro content must be a string");return this.outro+=content,this}appendLeft(index,content){if(index+=this.offset,"string"!=typeof content)throw new TypeError("inserted content must be a string");this._split(index);const chunk=this.byEnd[index];return chunk?chunk.appendLeft(content):this.intro+=content,this}appendRight(index,content){if(index+=this.offset,"string"!=typeof content)throw new TypeError("inserted content must be a string");this._split(index);const chunk=this.byStart[index];return chunk?chunk.appendRight(content):this.outro+=content,this}clone(){const cloned=new MagicString(this.original,{filename:this.filename,offset:this.offset});let originalChunk=this.firstChunk,clonedChunk=cloned.firstChunk=cloned.lastSearchedChunk=originalChunk.clone();for(;originalChunk;){cloned.byStart[clonedChunk.start]=clonedChunk,cloned.byEnd[clonedChunk.end]=clonedChunk;const nextOriginalChunk=originalChunk.next,nextClonedChunk=nextOriginalChunk&&nextOriginalChunk.clone();nextClonedChunk&&(clonedChunk.next=nextClonedChunk,nextClonedChunk.previous=clonedChunk,clonedChunk=nextClonedChunk),originalChunk=nextOriginalChunk}return cloned.lastChunk=clonedChunk,this.indentExclusionRanges&&(cloned.indentExclusionRanges=this.indentExclusionRanges.slice()),cloned.sourcemapLocations=new BitSet(this.sourcemapLocations),cloned.intro=this.intro,cloned.outro=this.outro,cloned}generateDecodedMap(options){options=options||{};const names=Object.keys(this.storedNames),mappings=new Mappings(options.hires),locate=getLocator(this.original);return this.intro&&mappings.advance(this.intro),this.firstChunk.eachNext((chunk=>{const loc=locate(chunk.start);chunk.intro.length&&mappings.advance(chunk.intro),chunk.edited?mappings.addEdit(0,chunk.content,loc,chunk.storeName?names.indexOf(chunk.original):-1):mappings.addUneditedChunk(0,chunk,this.original,loc,this.sourcemapLocations),chunk.outro.length&&mappings.advance(chunk.outro)})),{file:options.file?options.file.split(/[/\\]/).pop():void 0,sources:[options.source?getRelativePath(options.file||"",options.source):options.file||""],sourcesContent:options.includeContent?[this.original]:void 0,names,mappings:mappings.raw,x_google_ignoreList:this.ignoreList?[0]:void 0}}generateMap(options){return new SourceMap(this.generateDecodedMap(options))}_ensureindentStr(){void 0===this.indentStr&&(this.indentStr=function guessIndent(code){const lines=code.split("\n"),tabbed=lines.filter((line=>/^\t+/.test(line))),spaced=lines.filter((line=>/^ {2,}/.test(line)));if(0===tabbed.length&&0===spaced.length)return null;if(tabbed.length>=spaced.length)return"\t";const min=spaced.reduce(((previous,current)=>{const numSpaces=/^ +/.exec(current)[0].length;return Math.min(numSpaces,previous)}),1/0);return new Array(min+1).join(" ")}(this.original))}_getRawIndentString(){return this._ensureindentStr(),this.indentStr}getIndentString(){return this._ensureindentStr(),null===this.indentStr?"\t":this.indentStr}indent(indentStr,options){const pattern=/^[^\r\n]/gm;if(isObject(indentStr)&&(options=indentStr,indentStr=void 0),void 0===indentStr&&(this._ensureindentStr(),indentStr=this.indentStr||"\t"),""===indentStr)return this;const isExcluded={};if((options=options||{}).exclude){("number"==typeof options.exclude[0]?[options.exclude]:options.exclude).forEach((exclusion=>{for(let i=exclusion[0];i<exclusion[1];i+=1)isExcluded[i]=!0}))}let shouldIndentNextCharacter=!1!==options.indentStart;const replacer=match=>shouldIndentNextCharacter?`${indentStr}${match}`:(shouldIndentNextCharacter=!0,match);this.intro=this.intro.replace(pattern,replacer);let charIndex=0,chunk=this.firstChunk;for(;chunk;){const end=chunk.end;if(chunk.edited)isExcluded[charIndex]||(chunk.content=chunk.content.replace(pattern,replacer),chunk.content.length&&(shouldIndentNextCharacter="\n"===chunk.content[chunk.content.length-1]));else for(charIndex=chunk.start;charIndex<end;){if(!isExcluded[charIndex]){const char=this.original[charIndex];"\n"===char?shouldIndentNextCharacter=!0:"\r"!==char&&shouldIndentNextCharacter&&(shouldIndentNextCharacter=!1,charIndex===chunk.start||(this._splitChunk(chunk,charIndex),chunk=chunk.next),chunk.prependRight(indentStr))}charIndex+=1}charIndex=chunk.end,chunk=chunk.next}return this.outro=this.outro.replace(pattern,replacer),this}insert(){throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)")}insertLeft(index,content){return warned.insertLeft||(console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"),warned.insertLeft=!0),this.appendLeft(index,content)}insertRight(index,content){return warned.insertRight||(console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"),warned.insertRight=!0),this.prependRight(index,content)}move(start,end,index){if(start+=this.offset,end+=this.offset,(index+=this.offset)>=start&&index<=end)throw new Error("Cannot move a selection inside itself");this._split(start),this._split(end),this._split(index);const first=this.byStart[start],last=this.byEnd[end],oldLeft=first.previous,oldRight=last.next,newRight=this.byStart[index];if(!newRight&&last===this.lastChunk)return this;const newLeft=newRight?newRight.previous:this.lastChunk;return oldLeft&&(oldLeft.next=oldRight),oldRight&&(oldRight.previous=oldLeft),newLeft&&(newLeft.next=first),newRight&&(newRight.previous=last),first.previous||(this.firstChunk=last.next),last.next||(this.lastChunk=first.previous,this.lastChunk.next=null),first.previous=newLeft,last.next=newRight||null,newLeft||(this.firstChunk=first),newRight||(this.lastChunk=last),this}overwrite(start,end,content,options){return options=options||{},this.update(start,end,content,{...options,overwrite:!options.contentOnly})}update(start,end,content,options){if(start+=this.offset,end+=this.offset,"string"!=typeof content)throw new TypeError("replacement content must be a string");if(0!==this.original.length){for(;start<0;)start+=this.original.length;for(;end<0;)end+=this.original.length}if(end>this.original.length)throw new Error("end is out of bounds");if(start===end)throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");this._split(start),this._split(end),!0===options&&(warned.storeName||(console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"),warned.storeName=!0),options={storeName:!0});const storeName=void 0!==options&&options.storeName,overwrite=void 0!==options&&options.overwrite;if(storeName){const original=this.original.slice(start,end);Object.defineProperty(this.storedNames,original,{writable:!0,value:!0,enumerable:!0})}const first=this.byStart[start],last=this.byEnd[end];if(first){let chunk=first;for(;chunk!==last;){if(chunk.next!==this.byStart[chunk.end])throw new Error("Cannot overwrite across a split point");chunk=chunk.next,chunk.edit("",!1)}first.edit(content,storeName,!overwrite)}else{const newChunk=new Chunk(start,end,"").edit(content,storeName);last.next=newChunk,newChunk.previous=last}return this}prepend(content){if("string"!=typeof content)throw new TypeError("outro content must be a string");return this.intro=content+this.intro,this}prependLeft(index,content){if(index+=this.offset,"string"!=typeof content)throw new TypeError("inserted content must be a string");this._split(index);const chunk=this.byEnd[index];return chunk?chunk.prependLeft(content):this.intro=content+this.intro,this}prependRight(index,content){if(index+=this.offset,"string"!=typeof content)throw new TypeError("inserted content must be a string");this._split(index);const chunk=this.byStart[index];return chunk?chunk.prependRight(content):this.outro=content+this.outro,this}remove(start,end){if(start+=this.offset,end+=this.offset,0!==this.original.length){for(;start<0;)start+=this.original.length;for(;end<0;)end+=this.original.length}if(start===end)return this;if(start<0||end>this.original.length)throw new Error("Character is out of bounds");if(start>end)throw new Error("end must be greater than start");this._split(start),this._split(end);let chunk=this.byStart[start];for(;chunk;)chunk.intro="",chunk.outro="",chunk.edit(""),chunk=end>chunk.end?this.byStart[chunk.end]:null;return this}reset(start,end){if(start+=this.offset,end+=this.offset,0!==this.original.length){for(;start<0;)start+=this.original.length;for(;end<0;)end+=this.original.length}if(start===end)return this;if(start<0||end>this.original.length)throw new Error("Character is out of bounds");if(start>end)throw new Error("end must be greater than start");this._split(start),this._split(end);let chunk=this.byStart[start];for(;chunk;)chunk.reset(),chunk=end>chunk.end?this.byStart[chunk.end]:null;return this}lastChar(){if(this.outro.length)return this.outro[this.outro.length-1];let chunk=this.lastChunk;do{if(chunk.outro.length)return chunk.outro[chunk.outro.length-1];if(chunk.content.length)return chunk.content[chunk.content.length-1];if(chunk.intro.length)return chunk.intro[chunk.intro.length-1]}while(chunk=chunk.previous);return this.intro.length?this.intro[this.intro.length-1]:""}lastLine(){let lineIndex=this.outro.lastIndexOf(n);if(-1!==lineIndex)return this.outro.substr(lineIndex+1);let lineStr=this.outro,chunk=this.lastChunk;do{if(chunk.outro.length>0){if(lineIndex=chunk.outro.lastIndexOf(n),-1!==lineIndex)return chunk.outro.substr(lineIndex+1)+lineStr;lineStr=chunk.outro+lineStr}if(chunk.content.length>0){if(lineIndex=chunk.content.lastIndexOf(n),-1!==lineIndex)return chunk.content.substr(lineIndex+1)+lineStr;lineStr=chunk.content+lineStr}if(chunk.intro.length>0){if(lineIndex=chunk.intro.lastIndexOf(n),-1!==lineIndex)return chunk.intro.substr(lineIndex+1)+lineStr;lineStr=chunk.intro+lineStr}}while(chunk=chunk.previous);return lineIndex=this.intro.lastIndexOf(n),-1!==lineIndex?this.intro.substr(lineIndex+1)+lineStr:this.intro+lineStr}slice(start=0,end=this.original.length-this.offset){if(start+=this.offset,end+=this.offset,0!==this.original.length){for(;start<0;)start+=this.original.length;for(;end<0;)end+=this.original.length}let result="",chunk=this.firstChunk;for(;chunk&&(chunk.start>start||chunk.end<=start);){if(chunk.start<end&&chunk.end>=end)return result;chunk=chunk.next}if(chunk&&chunk.edited&&chunk.start!==start)throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);const startChunk=chunk;for(;chunk;){!chunk.intro||startChunk===chunk&&chunk.start!==start||(result+=chunk.intro);const containsEnd=chunk.start<end&&chunk.end>=end;if(containsEnd&&chunk.edited&&chunk.end!==end)throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);const sliceStart=startChunk===chunk?start-chunk.start:0,sliceEnd=containsEnd?chunk.content.length+end-chunk.end:chunk.content.length;if(result+=chunk.content.slice(sliceStart,sliceEnd),!chunk.outro||containsEnd&&chunk.end!==end||(result+=chunk.outro),containsEnd)break;chunk=chunk.next}return result}snip(start,end){const clone=this.clone();return clone.remove(0,start),clone.remove(end,clone.original.length),clone}_split(index){if(this.byStart[index]||this.byEnd[index])return;let chunk=this.lastSearchedChunk;const searchForward=index>chunk.end;for(;chunk;){if(chunk.contains(index))return this._splitChunk(chunk,index);chunk=searchForward?this.byStart[chunk.end]:this.byEnd[chunk.start]}}_splitChunk(chunk,index){if(chunk.edited&&chunk.content.length){const loc=getLocator(this.original)(index);throw new Error(`Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`)}const newChunk=chunk.split(index);return this.byEnd[index]=chunk,this.byStart[index]=newChunk,this.byEnd[newChunk.end]=newChunk,chunk===this.lastChunk&&(this.lastChunk=newChunk),this.lastSearchedChunk=chunk,!0}toString(){let str=this.intro,chunk=this.firstChunk;for(;chunk;)str+=chunk.toString(),chunk=chunk.next;return str+this.outro}isEmpty(){let chunk=this.firstChunk;do{if(chunk.intro.length&&chunk.intro.trim()||chunk.content.length&&chunk.content.trim()||chunk.outro.length&&chunk.outro.trim())return!1}while(chunk=chunk.next);return!0}length(){let chunk=this.firstChunk,length=0;do{length+=chunk.intro.length+chunk.content.length+chunk.outro.length}while(chunk=chunk.next);return length}trimLines(){return this.trim("[\\r\\n]")}trim(charType){return this.trimStart(charType).trimEnd(charType)}trimEndAborted(charType){const rx=new RegExp((charType||"\\s")+"+$");if(this.outro=this.outro.replace(rx,""),this.outro.length)return!0;let chunk=this.lastChunk;do{const end=chunk.end,aborted=chunk.trimEnd(rx);if(chunk.end!==end&&(this.lastChunk===chunk&&(this.lastChunk=chunk.next),this.byEnd[chunk.end]=chunk,this.byStart[chunk.next.start]=chunk.next,this.byEnd[chunk.next.end]=chunk.next),aborted)return!0;chunk=chunk.previous}while(chunk);return!1}trimEnd(charType){return this.trimEndAborted(charType),this}trimStartAborted(charType){const rx=new RegExp("^"+(charType||"\\s")+"+");if(this.intro=this.intro.replace(rx,""),this.intro.length)return!0;let chunk=this.firstChunk;do{const end=chunk.end,aborted=chunk.trimStart(rx);if(chunk.end!==end&&(chunk===this.lastChunk&&(this.lastChunk=chunk.next),this.byEnd[chunk.end]=chunk,this.byStart[chunk.next.start]=chunk.next,this.byEnd[chunk.next.end]=chunk.next),aborted)return!0;chunk=chunk.next}while(chunk);return!1}trimStart(charType){return this.trimStartAborted(charType),this}hasChanged(){return this.original!==this.toString()}_replaceRegexp(searchValue,replacement){function getReplacement(match,str){return"string"==typeof replacement?replacement.replace(/\$(\$|&|\d+)/g,((_,i)=>{if("$"===i)return"$";if("&"===i)return match[0];return+i<match.length?match[+i]:`$${i}`})):replacement(...match,match.index,str,match.groups)}if(searchValue.global){(function matchAll(re,str){let match;const matches=[];for(;match=re.exec(str);)matches.push(match);return matches})(searchValue,this.original).forEach((match=>{if(null!=match.index){const replacement=getReplacement(match,this.original);replacement!==match[0]&&this.overwrite(match.index,match.index+match[0].length,replacement)}}))}else{const match=this.original.match(searchValue);if(match&&null!=match.index){const replacement=getReplacement(match,this.original);replacement!==match[0]&&this.overwrite(match.index,match.index+match[0].length,replacement)}}return this}_replaceString(string,replacement){const{original}=this,index=original.indexOf(string);return-1!==index&&this.overwrite(index,index+string.length,replacement),this}replace(searchValue,replacement){return"string"==typeof searchValue?this._replaceString(searchValue,replacement):this._replaceRegexp(searchValue,replacement)}_replaceAllString(string,replacement){const{original}=this,stringLength=string.length;for(let index=original.indexOf(string);-1!==index;index=original.indexOf(string,index+stringLength)){original.slice(index,index+stringLength)!==replacement&&this.overwrite(index,index+stringLength,replacement)}return this}replaceAll(searchValue,replacement){if("string"==typeof searchValue)return this._replaceAllString(searchValue,replacement);if(!searchValue.global)throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");return this._replaceRegexp(searchValue,replacement)}}const hasOwnProp=Object.prototype.hasOwnProperty;class Bundle{constructor(options={}){this.intro=options.intro||"",this.separator=void 0!==options.separator?options.separator:"\n",this.sources=[],this.uniqueSources=[],this.uniqueSourceIndexByFilename={}}addSource(source){if(source instanceof MagicString)return this.addSource({content:source,filename:source.filename,separator:this.separator});if(!isObject(source)||!source.content)throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");if(["filename","ignoreList","indentExclusionRanges","separator"].forEach((option=>{hasOwnProp.call(source,option)||(source[option]=source.content[option])})),void 0===source.separator&&(source.separator=this.separator),source.filename)if(hasOwnProp.call(this.uniqueSourceIndexByFilename,source.filename)){const uniqueSource=this.uniqueSources[this.uniqueSourceIndexByFilename[source.filename]];if(source.content.original!==uniqueSource.content)throw new Error(`Illegal source: same filename (${source.filename}), different contents`)}else this.uniqueSourceIndexByFilename[source.filename]=this.uniqueSources.length,this.uniqueSources.push({filename:source.filename,content:source.content.original});return this.sources.push(source),this}append(str,options){return this.addSource({content:new MagicString(str),separator:options&&options.separator||""}),this}clone(){const bundle=new Bundle({intro:this.intro,separator:this.separator});return this.sources.forEach((source=>{bundle.addSource({filename:source.filename,content:source.content.clone(),separator:source.separator})})),bundle}generateDecodedMap(options={}){const names=[];let x_google_ignoreList;this.sources.forEach((source=>{Object.keys(source.content.storedNames).forEach((name=>{~names.indexOf(name)||names.push(name)}))}));const mappings=new Mappings(options.hires);return this.intro&&mappings.advance(this.intro),this.sources.forEach(((source,i)=>{i>0&&mappings.advance(this.separator);const sourceIndex=source.filename?this.uniqueSourceIndexByFilename[source.filename]:-1,magicString=source.content,locate=getLocator(magicString.original);magicString.intro&&mappings.advance(magicString.intro),magicString.firstChunk.eachNext((chunk=>{const loc=locate(chunk.start);chunk.intro.length&&mappings.advance(chunk.intro),source.filename?chunk.edited?mappings.addEdit(sourceIndex,chunk.content,loc,chunk.storeName?names.indexOf(chunk.original):-1):mappings.addUneditedChunk(sourceIndex,chunk,magicString.original,loc,magicString.sourcemapLocations):mappings.advance(chunk.content),chunk.outro.length&&mappings.advance(chunk.outro)})),magicString.outro&&mappings.advance(magicString.outro),source.ignoreList&&-1!==sourceIndex&&(void 0===x_google_ignoreList&&(x_google_ignoreList=[]),x_google_ignoreList.push(sourceIndex))})),{file:options.file?options.file.split(/[/\\]/).pop():void 0,sources:this.uniqueSources.map((source=>options.file?getRelativePath(options.file,source.filename):source.filename)),sourcesContent:this.uniqueSources.map((source=>options.includeContent?source.content:null)),names,mappings:mappings.raw,x_google_ignoreList}}generateMap(options){return new SourceMap(this.generateDecodedMap(options))}getIndentString(){const indentStringCounts={};return this.sources.forEach((source=>{const indentStr=source.content._getRawIndentString();null!==indentStr&&(indentStringCounts[indentStr]||(indentStringCounts[indentStr]=0),indentStringCounts[indentStr]+=1)})),Object.keys(indentStringCounts).sort(((a,b)=>indentStringCounts[a]-indentStringCounts[b]))[0]||"\t"}indent(indentStr){if(arguments.length||(indentStr=this.getIndentString()),""===indentStr)return this;let trailingNewline=!this.intro||"\n"===this.intro.slice(-1);return this.sources.forEach(((source,i)=>{const separator=void 0!==source.separator?source.separator:this.separator,indentStart=trailingNewline||i>0&&/\r?\n$/.test(separator);source.content.indent(indentStr,{exclude:source.indentExclusionRanges,indentStart}),trailingNewline="\n"===source.content.lastChar()})),this.intro&&(this.intro=indentStr+this.intro.replace(/^[^\n]/gm,((match,index)=>index>0?indentStr+match:match))),this}prepend(str){return this.intro=str+this.intro,this}toString(){const body=this.sources.map(((source,i)=>{const separator=void 0!==source.separator?source.separator:this.separator;return(i>0?separator:"")+source.content.toString()})).join("");return this.intro+body}isEmpty(){return(!this.intro.length||!this.intro.trim())&&!this.sources.some((source=>!source.content.isEmpty()))}length(){return this.sources.reduce(((length,source)=>length+source.content.length()),this.intro.length)}trimLines(){return this.trim("[\\r\\n]")}trim(charType){return this.trimStart(charType).trimEnd(charType)}trimStart(charType){const rx=new RegExp("^"+(charType||"\\s")+"+");if(this.intro=this.intro.replace(rx,""),!this.intro){let source,i=0;do{if(source=this.sources[i++],!source)break}while(!source.content.trimStartAborted(charType))}return this}trimEnd(charType){const rx=new RegExp((charType||"\\s")+"+$");let source,i=this.sources.length-1;do{if(source=this.sources[i--],!source){this.intro=this.intro.replace(rx,"");break}}while(!source.content.trimEndAborted(charType));return this}}}}]);