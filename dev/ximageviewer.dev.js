
var collection = [];

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

    // Messy Things : IOS SAFARI's touchmove
    if (XIV.isHandheld && XIV.isMobileSafari) {
      $("#xiv-mode-main").bind('touchmove',function(e) {e.preventDefault();});
    }

    // PRE LOADER : VIRTUAL IMAGE 
    var virtualImage = this.virtualImage = new Image();
    virtualImage.onload  = this.onload;
    virtualImage.onerror = this.error;
    virtualImage.src     = source.url;

    $("#xiv-bt-original").hammer().bind("tap", XIV.toOriginal);
    //elem.hammer().bind("doubletap", XIV.toOriginal);
    //navMain.hammer().bind("doubletap", XIV.toMain);
    //$("#xiv-bt-original").click(XIV.toOriginal);
    
    $("#xnav").mousedown(function(){
      $(this).toggleClass("bottom");
    });
    var clicked = false;
    elem.click(function(){
      clicked = false;
      XIV.toOriginal();
    })
    navMain.click(function(){
      if (clicked) XIV.toMain();
      clicked = true;
      setTimeout(function(){clicked = false}, 300);
    });//*/

    $("#original-close-bt").hammer().bind('tap', XIV.toMain);
    $("#xiv-bt-screen").hammer().bind('tap', XIV.toToggleFullScreen);
    //$(window).scroll(XIV.navDraw); /* DESKTOP */
    //$("body").scroll(XIV.navDraw); /* HANDHELD */
    $(window).resize(XIV.navDraw);
    //$(window).resize(XIV.adjustCover);
    //mouseScroll.init();
    XIV.status = "READY";
    $("body").removeClass('status-init').addClass("status-ready");
  },
  error    : function(e) {
    console.log("ERROR!!! : ", e);
  },
  onload   : function(e) {

    XIV.backElem.get(0).src  = source.url;
    XIV.navElem.get(0).src   = source.url;
    XIV.elem.get(0).src      = source.url;

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
	  var iScroll = XIV.iScroll = new IScroll('#viewmode', { 
      zoom: true,
      mouseWheel: true,
      scrollX: true,
      scrollY: true,
      //startZoom: 1.0005,
      //zoomMin: 1.0005, 
      freeScroll: true,
      wheelAction: 'zoom'});
    iScroll.on('scroll', XIV.navDraw);
    iScroll.on('scrollStart',XIV.navDrawInterval);
    iScroll.on('scrollEnd', XIV.navDraw);
    iScroll.on('zoomEnd', function(){
      $('#nav-back').css('transition-duration', '100ms')
    }); 
    iScroll.on('zoomEnd', XIV.navDraw); // transition-duratio
    $("#viewmode").mousemove(XIV.navDraw);
  }
  /*
  iScroll.on('zoomEnd', function(){
    return true
  });
  /*
  iScroll.on('scrollEnd', function(){
    XIV.navDraw();
  });
  iScroll.on('scrollStart', function(){
    XIV.navDraw();
  });*/
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
var _drawIntervalId;

XIV.navDrawInterval = function() {
  if (_drawIntervalId) clearInterval(_drawIntervalId);
  _drawIntervalId = setInterval(function(){
    XIV.navDraw ();
  }, 100);
  return this;
};

XIV.navDraw   = function() {
  if (XIV.mode != "ORIGINAL") return this;
  // element.getBoundingClientRect().height  
  var _RATIO_SCALE = XIV.iScroll.scale;
  var body = $("body");

  if (source.height*_RATIO_SCALE < window.innerHeight && source.width*_RATIO_SCALE < window.innerWidth) {
    if (body.hasClass('xiv-con-sourceSmall')) return true;
    body.addClass('xiv-con-sourceSmall');
    return true;
  }
  if (body.hasClass('xiv-con-sourceSmall')) body.removeClass('xiv-con-sourceSmall');


  var _NAV_IMG = XIV.navElem[0];
  var _INFO = (XIV.navMain[0]).getBoundingClientRect(); // VIEWERIMAGE INFO
  var _TOP = _INFO.top, _LEFT = _INFO.left, _WIDTH = _INFO.width, _HEIGHT = _INFO.height;
  var _RATIO_IMAGE = _NAV_IMG.width / source.width;
  var _RATIO_BOX   = (_NAV_IMG.width / source.width ) / _RATIO_SCALE;
  var TOP, LEFT, WIDTH, HEIGHT, TOPSTART, LEFTSTART;
  if (source.height < window.innerHeight) {
    TOPSTART = (( ( window.innerHeight - source.height ) / 2 ) * _RATIO_IMAGE ) / _RATIO_SCALE;
    HEIGHT  = window.innerHeight * _RATIO_IMAGE / _RATIO_SCALE;
  } else {
    TOPSTART = 0;
    HEIGHT = window.innerHeight * _RATIO_BOX;
  }
  if (source.width < window.innerWidth) {
    LEFTSTART = (( ( window.innerWidth - source.width ) / 2 ) * _RATIO_IMAGE ) / _RATIO_SCALE;
    WIDTH  = window.innerWidth * _RATIO_IMAGE / _RATIO_SCALE;
  } else {
    LEFTSTART = 0;
    WIDTH  = window.innerWidth * _RATIO_BOX;
  }

  var TOP = - (_TOP / _RATIO_SCALE ) * _RATIO_IMAGE;
  var LEFT = - (_LEFT / _RATIO_SCALE ) * _RATIO_IMAGE;

/*
  var targetWidth  = Math.max(source.width, window.innerWidth);
  var targetHeight = Math.max(source.height, window.innerHeight);


  var ratio = XIV.navElem.get(0).offsetWidth / (source.width * XIV.iScroll.scale);
  topStart = (source.height < window.innerHeight) ? (window.innerHeight - source.height)/2 : 0;
  leftStart = (source.width < window.innerWidth) ? (source.width - window.innerWidth) : 0;

  /*
  var navPort = XIV.navPort.get(0);
  var navBackImage = XIV.navElem.get(0); // "#nav-back-image"
  //var width = window.innerWidth * ratio + 'px';
  var __RATIO = navBackImage.width/source.width/XIV.iScroll.scale;
  var width  = window.innerWidth * __RATIO ;
  // window.innerHeight * ratio 
  var height = window.innerHeight * __RATIO ;

  /* SCALE 적용이 원본보다 큰 경우에는 적용이 잘된다. */

  /*
  var ratio   = Math.max(
    XIV.navElem.get(0).offsetHeight / (source.height * XIV.iScroll.scale),
    XIV.navElem.get(0).offsetWidth  / (source.width * XIV.iScroll.scale)
  );*/
  //var top     = rect.top  ;
  //var left    = rect.left ;
  
  var navPort = XIV.navPort.get(0);
  navPort.style.top    = -TOPSTART  + TOP  + 'px';
  navPort.style.left   = -LEFTSTART + LEFT + 'px';
  navPort.style.height = HEIGHT + 'px';
  navPort.style.width  = WIDTH  + 'px';
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
      //mouseScroll.move(current._x + current.x - e.clientX, current._y + current.y - e.clientY);
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

window.addEventListener("load", function() { window. scrollTo(0, 0); });
$("body").addClass("status-init");


function isMobileSafari() {
  var ua = window.navigator.userAgent
  var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  var webkit = !!ua.match(/WebKit/i);
  var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
  return iOSSafari
}

XIV.isMobileSafari = isMobileSafari(); 

