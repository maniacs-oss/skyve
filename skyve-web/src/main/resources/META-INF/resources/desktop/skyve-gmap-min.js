isc.ClassFactory.defineClass("BizMap","Canvas");isc.BizMap.addClassMethods({loadingGMap:false,loadGMap:function(a){if(isc.BizMap.loadingGMap){setTimeout(function(){isc.BizMap.loadGMap(a)},100)}else{if(window.google&&window.google.maps){a()}else{isc.BizMap.loadingGMap=true;SKYVE.Util.loadJS("wicket/wicket.js?v="+SKYVE.Util.v,function(){SKYVE.Util.loadJS("wicket/wicket-gmap3.js?v="+SKYVE.Util.v,function(){var b="https://maps.googleapis.com/maps/api/js?v=3&libraries=drawing";if(SKYVE.Util.googleMapsV3ApiKey){b+="&key="+SKYVE.Util.googleMapsV3ApiKey}SKYVE.Util.loadJS(b,function(){isc.BizMap.loadingGMap=false;a()})})})}}},v:0,initialise:function(){eval(isc.BizMap.id+".build()")}});isc.BizMap.addMethods({init:function(a){this._refreshTime=10;this._refreshRequired=true;this._refreshing=false;this.width="100%";this.height="100%";this.styleName="googleMapDivParent",this.ID="bizMap"+isc.BizMap.v++;this.redrawOnResize=false;this.Super("init",arguments);this._objects={}},getInnerHTML:function(){return'<div id="'+this.ID+'_map" style="margin:0;padding:0;height:100%">Loading Map...</div>'},draw:function(){if(window.google&&window.google.maps){if(!this.isDrawn()){this.build();return this.Super("draw",arguments)}}else{isc.BizMap.id=this.ID;isc.BizMap.loadGMap(isc.BizMap.initialise);return this.Super("draw",arguments)}},setDataSource:function(b){if(window.google&&window.google.maps&&this.webmap){if(this._view){this._modelName=b;this._moduleName=null;this._queryName=null;this._geometryBinding=null;var c=this._view._grids[b];if(c){}else{c={};this._view._grids[b]=c}c[this.getID()]=this}else{var a=b.indexOf("_");this._moduleName=b.substring(0,a);this._queryName=b.substring(a+1);a=this._queryName.indexOf("_");this._geometryBinding=this._queryName.substring(a+1);this._queryName=this._queryName.substring(0,a);this._modelName=null}this._refresh(true,false)}else{this.delayCall("setDataSource",arguments,100)}},build:function(){if(this.isDrawn()){var a={zoom:1,center:new google.maps.LatLng(0,0),mapTypeId:google.maps.MapTypeId.ROADMAP};if(this.webmap){a.zoom=this.webmap.getZoom();a.center=this.webmap.getCenter();a.mapTypeId=this.webmap.getMapTypeId()}this.infoWindow=new google.maps.InfoWindow({content:""});this.webmap=new google.maps.Map(document.getElementById(this.ID+"_map"),a);if(this.loading=="lazy"){var b=this;google.maps.event.addListener(this.webmap,"zoom_changed",function(){console.log(this.getBounds());b._refresh(false,false)});google.maps.event.addListener(this.webmap,"dragend",function(){console.log(this.getBounds());b._refresh(false,false)})}this._refresh(true,false);this.delayCall("_addForm",null,1000)}else{this.delayCall("build",null,100)}},_addForm:function(){},rerender:function(){this._refresh(false,false)},resume:function(){this._zoomed=false},_refresh:function(c,f){if(!this._refreshRequired){return}if(this._zoomed){return}if(this._refreshing){return}if(!this.isDrawn()){return}if(!this.isVisible()){return}var e=new Wkt.Wkt();var b=SKYVE.Util.CONTEXT_URL+"map?";if(this._view){if(this._modelName){var a=this._view.gather(false);b+="_c="+a._c+"&_m="+this._modelName}else{return}}else{if(this._queryName){b+="_mod="+this._moduleName+"&_q="+this._queryName+"&_geo="+this._geometryBinding}else{return}}this._refreshing=true;var d=this;isc.RPCManager.sendRequest({showPrompt:true,evalResult:true,actionURL:b,httpMethod:"GET",callback:function(i,h,g){SKYVE.Util.scatterGMap(d,h,c,f)}})},click:function(h,b){var e=h.infoMarkup;e+='<br/><br/><input type="button" value="Zoom" onclick="'+this.ID+".zoom(";if(h.getPosition){var c=h.getPosition();e+=c.lat()+","+c.lng()+","+c.lat()+","+c.lng()+",'";e+=h.mod+"','"+h.doc+"','"+h.bizId+"')\"/>";this.infoWindow.open(this.webmap,h);this.infoWindow.setContent(e)}else{if(h.getPath){var a=new google.maps.LatLngBounds();var j=h.getPath();for(var g=0,d=j.getLength();g<d;g++){a.extend(j.getAt(g))}var f=a.getNorthEast();var i=a.getSouthWest();e+=f.lat()+","+i.lng()+","+i.lat()+","+f.lng()+",'";e+=this.mod+"','"+this.doc+"','"+this.bizId+"')\"/>";this.infoWindow.setPosition(b.latLng);this.infoWindow.open(this.webmap);this.infoWindow.setContent(e)}}},zoom:function(l,d,n,f,q,c,g){this._zoomed=true;var t=Math.pow(2,this.webmap.getZoom());var r=new google.maps.LatLng(this.webmap.getBounds().getNorthEast().lat(),this.webmap.getBounds().getSouthWest().lng());var p=this.webmap.getProjection().fromLatLngToPoint(r);var a=new google.maps.LatLng(l,d);var e=this.webmap.getProjection().fromLatLngToPoint(a);var h=new google.maps.LatLng(n,f);var b=this.webmap.getProjection().fromLatLngToPoint(h);var i=this.getPageRect();var k=Math.floor((e.x-p.x)*t)+i[0];var j=Math.floor((e.y-p.y)*t)+i[1];var o=Math.floor((b.x-p.x)*t)+i[0]-k;var m=Math.floor((b.y-p.y)*t)+i[1]-j;var s=this;isc.BizUtil.getEditView(q,c,function(u){isc.WindowStack.popup([k,j,o,m],"Edit",true,[u]);u.editInstance(g,null,null);s.infoWindow.close()})}});isc.ClassFactory.defineClass("BizMapPicker","HTMLFlow");isc.BizMapPicker.addClassMethods({v:0,initialise:function(){eval(isc.BizMapPicker.id+".build()")}});isc.BizMapPicker.addMethods({init:function(a){this.width="100%";this.height="100%";this.styleName="googleMapDivParent";this.ID="bizMapPicker"+isc.BizMapPicker.v++;this.contents='<div id="'+this.ID+'_map" style="margin:0;padding:0;height:100%">Loading Map...</div>';this.Super("init",arguments);this._overlays=[];this.field=a.field;this.drawingTools=a.drawingTools;if(window.google&&window.google.maps){this.build()}else{isc.BizMapPicker.id=this.ID;isc.BizMap.loadGMap(isc.BizMapPicker.initialise)}},mapIt:function(){var a=this.field.getValue();SKYVE.Util.scatterGMapValue(this,a)},clearIt:function(){SKYVE.Util.clearGMap(this)},build:function(){if(this.isDrawn()){var a={zoom:4,center:new google.maps.LatLng(-26,133.5),mapTypeId:google.maps.MapTypeId.ROADMAP,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU}};this.webmap=new google.maps.Map(document.getElementById(this.ID+"_map"),a);if(!this.field.isDisabled()){var c={editable:true,strokeColor:"#990000",fillColor:"#EEFFCC",fillOpacity:0.6};this.webmap.drawingManager=new google.maps.drawing.DrawingManager({drawingControlOptions:{position:google.maps.ControlPosition.LEFT_BOTTOM,defaults:c,drawingModes:SKYVE.Util.gmapDrawingModes(this.drawingTools)},markerOptions:c,polygonOptions:c,polylineOptions:c,rectangleOptions:c});this.webmap.drawingManager.setMap(this.webmap);var b=this;google.maps.event.addListener(this.webmap.drawingManager,"overlaycomplete",function(f){b.clearIt();this.setDrawingMode(null);b._overlays.push(f.overlay);var e=new Wkt.Wkt();e.fromObject(f.overlay);var d=e.write();b.field.setValueFromPicker(d)})}this.clearIt();this.delayCall("mapIt",null,100)}else{this.delayCall("build",null,100)}}});