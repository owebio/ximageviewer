
var collection = []

var source = {
  title      : undefined,
  copyright  : undefined,
  description: undefined,  
  url        : undefined,
  width      : undefined,
  height     : undefined
}

var sourceDefault = {
  copyright   : "oneiroi",
  description : "Try to test by resizing and scrolling window. <br>" +
    "Random images for checking viewer. <br>" +
    '<a href="">Click here to view random image.</a>'
}

/* CORE */
var XIV = {
  status     : "INIT",    // "INIT" | "READY"
  mode       : "MAIN",    // "MAIN" | "ORIGINAL"
  isHandheld : undefined,
  elem       : undefined,
  backElem   : undefined,
  navElem    : undefined,
  load       : function(item) {
  },
  empty      : function() {
  },
  ratio      : function() {
    if (this.elem.height > this.elem.width) {
      return this.elem.height / source.height;
    }
    return this.elem.width / source.width; 
  },
  init     : function(item) {
    if (item) {
      var item = (typeof item == 'string') ? {url: item} : item;
      source = jQuery.extend({}, sourceDefault, item);
      this.infoUpdate(source);
    }
    var elem = this.elem = $("#xiv-screen-image");
    var backElem = this.backElem = $("#xiv-backcover-image");
    var navElem = this.navElem = $("#nav-back-image");
    var navMain = this.navMain = $("#nav-back");
    var navPort = this.navPort = $("#nav-viewport");
    var virtualImage = this.virtualImage = new Image();
    virtualImage.onload  = this.onload;
    virtualImage.onerror = this.error;
    virtualImage.src     = source.url;
    backElem.get(0).src  = source.url;
    navElem.get(0).src   = source.url;
    elem.get(0).src      = source.url;
    $("#xiv-bt-original").click(function(){
      XIV.toOriginal();
    });
    $("#xnavigator").click(function(){
      $(this).toggleClass("bottom");
    });
    //Hammer($("#xiv").get(0)).on("doubletap", XIV.toggleMode); //buggy freezing
    //$("body").dblclick(XIV.toggleMode);
    var clicked = false;
    $("#xiv").click(function(){
      if (clicked) XIV.toggleMode();
      clicked = true;
      setTimeout(function(){clicked = false}, 300);
    });
    $("body").scroll(XIV.navDraw);
    $(window).resize(XIV.navDraw);
  },
  error    : function(e) {
    console.log("ERROR!!! : ", e);
  },
  onload   : function(e) {
    virtualImage  = XIV.virtualImage;
    source.height = virtualImage.height;
    source.width  = virtualImage.width;
    var navMain   = XIV.navMain.get(0);
    navMain.style.height = source.height + "px";
    navMain.style.width  = source.width + "px";
    navMain.style.backgroundImage = "url(" + source.url + ")";
  }
}

/* INFO // SETUP  */
XIV.title  = function(title) {
  if (!title) return source.title;
  $("#xiv-title").html(title);
  return this;
}
XIV.copyright  = function(copyright) {
  if (!copyright) return source.copyright;
  $("#xiv-copyright").html(copyright);
  return this;
}
XIV.description  = function(description) {
  if (!description) return source.description;
  $("#xiv-description").html(description);
  return this;
}
XIV.infoUpdate  = function(item) {
  if (source != item) source = item;
  this.title(source.title).copyright(source.copyright);
  return this.description(source.description);
}

/* MODE  */
XIV.toReset = function() {
  $("html").removeClass("toCover toOriginal toFull");
  return this;
}
XIV.toOriginal = function() {
  if (XIV.mode == "ORIGINAL") return this;
  XIV.toReset();
  $("html").addClass("toOriginal");
  XIV.mode = "ORIGINAL";
  XIV.navDraw();
  return this;
}
XIV.toMain = function() {
  if (XIV.mode == "MAIN") return this;
  XIV.toReset();
  $("html").addClass("toMain");
  XIV.mode = "MAIN";
  return this;
}

XIV.toggleMode = function() {
  if (XIV.mode == "MAIN") {
    XIV.toOriginal();
  } else {
    XIV.toMain();
  }
  return this;
}

/* ORIGINAL MODE */
XIV.navDraw   = function() {
  if (XIV.mode != "ORIGINAL") return this;
  var rect    = XIV.navMain.get(0).getBoundingClientRect();
  var ratio   = XIV.navElem.get(0).offsetHeight / source.height;
  var top     = rect.top;
  var left    = rect.left;
  var navPort = XIV.navPort.get(0);
  navPort.style.top    = -top  * ratio + 'px';
  navPort.style.left   = -left * ratio + 'px';
  navPort.style.height = window.innerHeight * ratio + 'px';
  navPort.style.width  = window.innerWidth * ratio + 'px';
}

/* SIZE */
XIV.toCover  = function() {
}
XIV.toFull   = function() {
}
XIV.toWFull  = function() {
}
XIV.toHFull  = function() {
}
XIV.toOrigin = function() {
}

/* POSITIONING */
XIV.toMiddle = function() {
}
XIV.toCenter = function() {
}
XIV.toTop    = function() {
}
XIV.toLeft   = function() {
}



/* TRAVERSION */

XIV.next  = function() {
}
XIV.prev  = function() {
}
XIV.first = function() {
}
XIV.last  = function() {
}
XIV.index = function() {
}

var navi = {
  draw   : function() {
  },
  resize : function() {
  },
  scroll : function() {
  }
}

/* MISC */

// test if Handheld device
var isHandheld = function() {
  var handheld  = false;
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone|android/i.test(userAgent)) {handheld = true}
  else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {handheld = true}
  return handheld;
}
if (isHandheld()) {
  XIV.isHandheld = true;
  document.getElementById('xiv-root').className = "handheld";
} else {
  XIV.isHandheld = false;
}