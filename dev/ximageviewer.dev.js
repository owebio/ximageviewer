
var collection = [
]

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
  description : "Sample images to check"
}
/* CORE */

var XIV = {
  status   : undefined,
  mode     : undefined,
  elem     : undefined,
  load     : function(item) {
  },
  empty    : function() {
  },
  ratio    : function() {
    if (this.elem.height > this.elem.width) {
      return this.elem.height / source.height;
    }
    return this.elem.width / source.width; 
  },
  init     : function(item) {
    if (item) {
      var item = (typeof item == 'string') ? {url: item} : item;
      console.log(item, source);
      source = Object.create(item, sourceDefault);
      console.log(source);
      this.infoUpdate(source);
    }
    console.log(source);
    var elem = this.elem = $("#xiv-screen-image");
    elem.load(this.onload);
    elem.error(this.error);
    elem.attr(source.url);
  },
  error    : function(e) {
    console.log("ERROR!!! : ", e);
  },
  onload   : function() {
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
var isHandHeld = function() {
  var handHeld  = false;
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone|android/i.test(userAgent)) {handHeld = true}
  else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {handHeld = true}
  return handHeld;
}
if (isHandHeld()) {
  document.getElementById('xiv-root').className = "handheld";
}