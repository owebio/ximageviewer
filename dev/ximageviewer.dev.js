

var collection = []

var source = {
  title      : undefined,
  copyright  : undefined,
  description: undefined,  
  url        : undefined,
  width      : undefined,
  height     : undefined
}

var XIVSourceDefault = {
  copyright   : "oneiroi",
  description : "Try to test by resizing and scrolling window. <br>" +
    "Random images for checking viewer. <br>" +
    '<a href="">Click here to view random image.</a>'
}

/* CORE */
var XIV = {
  status       : "INIT",    // "INIT" | "READY" | "COMPLETE"
  mode         : "MAIN",    // "MAIN" | "ORIGINAL"
  isHandheld   : undefined,
  elem         : undefined,
  backElem     : undefined,
  navElem      : undefined,
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
      source = jQuery.extend({}, XIVSourceDefault, item);
      XIV.infoUpdate(source);
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
    $("#xiv-bt-original").click(XIV.toOriginal);
    $("#xnav").mousedown(function(){
      $(this).toggleClass("bottom");
    });
    var clicked = false;
    $("#xiv-screen-image").click(function(){
      clicked = false;
      XIV.toggleMode();
    })
    navMain.click(function(){
      if (clicked) XIV.toggleMode();
      clicked = true;
      setTimeout(function(){clicked = false}, 300);
    });;
    $("#original-close-bt").click(XIV.toMain);
    $("#xiv-bt-screen").click(XIV.toToggleFullScreen);
    $(window).scroll(XIV.navDraw); /* DESKTOP */
    $("body").scroll(XIV.navDraw); /* HANDHELD */
    $(window).resize(XIV.navDraw);
    $(window).resize(XIV.adjustCover);
    mouseScroll.init();
    XIV.status = "READY";
    $("body").removeClass('status-init').addClass("status-ready");
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
    XIV.adjustCover();
    XIV.status = 'COMPLETE';
    $("body").removeClass('status-ready').addClass("status-complete");
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
  $("html").removeClass("toMain toCover toOriginal toFull");
  return this;
};
XIV.toOriginal = function() {
  if (XIV.mode == "ORIGINAL") return this;
  XIV.toReset();
  $("html").addClass("toOriginal");
  XIV.mode = "ORIGINAL";
  XIV.navDraw();
  return this;
};
XIV.toMain = function() {
  if (XIV.mode == "MAIN") return this;
  XIV.toReset();
  $("html").addClass("toMain");
  XIV.mode = "MAIN";
  return this;
};
XIV.isFullScreen = function() {
  return (window.innerWidth == screen.width && window.innerHeight == screen.height);
};
XIV.toToggleFullScreen = function() {
  var elem = document.documentElement;
  var isFullScreen = XIV.isFullScreen();
  if (isFullScreen) {
    var toExitFullScreen = document.exitFullscreen || document.webkitExitFullscreen
      || document.mozExitFullscreen || document.msExitFullscreen;
    if (toExitFullScreen) {
      toExitFullScreen.call(document); 
    }
    return this;
  } else {
    var toFullScreen = elem.requestFullScreen || elem.webkitRequestFullScreen
      || elem.mozRequestFullScreen   || elem.msRequestFullscreen;
    if (toFullScreen) {
      toFullScreen.call(elem);
    }
  }
};

XIV.toggleMode = function() {
  if (XIV.mode == "ORIGINAL") XIV.toMain();
  else XIV.toOriginal();
  return this;
}

/* ADJUST AGAIN AND WELL */
XIV.adjustCover = function() {
  var winRatio = window.innerHeight / window.innerWidth;
  var sourceRatio = source.height / source.width;
  if (sourceRatio > winRatio) { /* HAVING WIDTH MARGIN */
  } else {  /* HAVING HEIGHT MARGIN */
  }
}

/* ORIGINAL MODE */
XIV.navDraw   = function() {
  if (XIV.mode != "ORIGINAL") return this;
  // element.getBoundingClientRect().height
  var rect    = XIV.navMain.get(0).getBoundingClientRect();
  var ratio   = Math.max( //it works after transform's scaling.
    XIV.navElem.get(0).offsetHeight / rect.height,
    XIV.navElem.get(0).offsetWidth  / rect.width
  );
  var top     = rect.top;
  var left    = rect.left;
  var navPort = XIV.navPort.get(0);
  navPort.style.top    = -top  * ratio + 'px';
  navPort.style.left   = -left * ratio + 'px';
  navPort.style.height = window.innerHeight * ratio + 'px';
  navPort.style.width  = window.innerWidth * ratio + 'px';
}

/* DESKTOP MOUSE SCROLL */

var _DESKSCROLL = {
  using : false, _x : undefined, _y : undefined, x : undefined, y : undefined
}
var mouseScroll = {
  update : function(e) {
    if (XIV.mode != 'ORIGINAL') return;
    var current = _DESKSCROLL;
    current.using = true;
    current.x  = e.clientX;
    current.y  = e.clientY;
    current._x = document.body.scrollLeft || document.documentElement.scrollLeft;
    current._y = document.body.scrollTop || document.documentElement.scrollTop;
    return this;
  },
  reset   : function() {
    if (XIV.mode != 'ORIGINAL') return;
    var current = _DESKSCROLL;
    current.using = false;
    current.x = undefined;
    current.y = undefined;
    current._x = undefined;
    current._y = undefined;
    return this;
  },
  move : function(x, y, time) {
    // MS Edge, Other
    //$('body').animate({scrollLeft:x, scrollTop:y},{queue:false,duration:50,easing:'linear'})
    document.body.scrollLeft = x;
    document.body.scrollTop  = y;
    // IE9~11 
    document.documentElement.scrollLeft = x;
    document.documentElement.scrollTop  = y;
    XIV.navDraw();
  },
  init : function() {
    var navBack = $("#nav-back");
    navBack.mousedown(this.update);
    navBack.mouseup(this.reset);
    navBack.mouseleave(this.reset);
    navBack.mousemove(function(e) {
      if (!_DESKSCROLL.using) return;
      if (XIV.mode != 'ORIGINAL') return;
      var current = _DESKSCROLL;
      mouseScroll.move(current._x + current.x - e.clientX, current._y + current.y - e.clientY);
    });
  }
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
  $('#xiv-root').addClass("handheld");
} else {
  XIV.isHandheld = false;
}

$("body").addClass("status-init");

