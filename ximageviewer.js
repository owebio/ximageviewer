
var imageCollection = [
  {title: 'Cuba', src: "sample/sample_cuba.jpg"},
  {title: 'Thailand', src: "sample/sample_thailand.jpg"},
  {title: 'HongKong', src: "sample/hongkong.jpg"},
  {title: 'Seoul', src: "sample/sample_mask.jpg"},
  {title: 'Casa Milà', src: "sample/sample_barcelona.jpg"},
  {title: 'La Grande Arche', src: "sample/sample_paris.jpg"},
  {title: 'Tokyo Metropolitan Government', src: "sample/sample_tokyo.jpg"}
]

$(document).ready(function(){


$("#image-refresh-bt").click(function(){
  location.reload();
});

var imageBackCover = $('#image-backcover');
var imageItem = imageCollection[Math.floor(Math.random() * imageCollection.length)];
imageSRC = imageItem.src;
if (imageItem.title) {
  $("#img-tt").html(imageItem.title);
}

var imageViewFull = false;

var viewportSize = function() {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return {w:w, h:h, r:w/h};
}

var resizeFunc = function() {
  var _viewportSize = viewportSize();
  if (_imageSize.w < _viewportSize.w && _imageSize.h < _viewportSize.h) {
    imageElem.className = "small";
    imageElem.style.marginLeft = -parseInt(_imageSize.w/2) + "px";
    imageElem.style.marginTop  = -parseInt(_imageSize.h/2) + "px";
  } else {
    if (_imageSize.r < 0.5) {
      if (_imageSize.w < _viewportSize.w) {
        imageElem.className = "smallTop";
        imageElem.style.marginLeft = -parseInt(_imageSize.w/2) + "px";
        imageElem.style.marginTop  = "0";
      } else {
        var height = parseInt((_imageSize.h*(_viewportSize.w/_imageSize.w))/2);
        imageElem.style.marginLeft = "0";
        imageElem.style.marginTop  = "0";
        imageElem.className = "ratioFullW";
      }
    } else if (_imageSize.r > 3) {
      if (_imageSize.h < _viewportSize.h) {
        imageElem.className = "smallLeft";
        imageElem.style.marginTop = -parseInt(_imageSize.h/2) + "px";
        imageElem.style.marginLeft  = "0";
      } else {
        var width = parseInt(_imageSize.w*_viewportSize.h/_imageSize.h);
        if (width < _viewportSize.w) {
          imageElem.style.marginTop  = "0";
          imageElem.style.marginLeft = - parseInt(width/2) + "px";
          imageElem.className = "fullH";
        } else {
          imageElem.style.marginTop  = "0";
          imageElem.style.marginLeft = "0";
          imageElem.className = "ratioFullH";
        }
      }
    } else if (_imageSize.r > _viewportSize.r) {
      var height = parseInt((_imageSize.h*(_viewportSize.w/_imageSize.w))/2);
      imageElem.style.marginLeft = "0";
      imageElem.style.marginTop  = - height + "px";
      imageElem.className = "fullW";
    } else {
      var width = parseInt((_imageSize.w*(_viewportSize.h/_imageSize.h))/2);
      imageElem.style.marginTop  = "0";
      imageElem.style.marginLeft = - width + "px";
      imageElem.className = "fullH";
    }
  }
}

var  imageElem = new Image();
var screen = document.getElementById('image-screen');
//var _imageSize;
imageElem.id  = "image-source";
screen.appendChild(imageElem);
imageElem.src = imageSRC;
imageElem.onload = function() {
  _imageSize = {w:this.width, h: this.height, r:this.width/this.height};
  imageElem.removeAttribute('width');imageElem.removeAttribute('height');
  setTimeout(function() {
    // FIX IE BUGGY : AUTO ADDED PROPERTIES
    imageElem.removeAttribute('width');imageElem.removeAttribute('height');
    resizeFunc();
    $('html').addClass('ready');
  },200);
  imageBackCover.css("background-image", "url('"+imageSRC+"')");
};

window.onresize = resizeFunc;

var minimizeFull = function(){
  imageViewFull = false;
  $("body").removeClass('imageFull');
}
$('#image-source, #image-size-bt').on('click', function(){
  imageViewFull = true;
  $("body").addClass('imageFull');
  if ($("#imageViewFull").length) {
  } else {
    var imageFullElem = $("<img>");
    imageFullElem.attr('id', 'imageViewFull');
    imageFullElem.attr('width', _imageSize.w);
    imageFullElem.attr('height', _imageSize.h);
    imageFullElem.get(0).src = imageSRC;
    imageFullElem.appendTo($("body"));
    imageFullElem.click(minimizeFull);
    var imageNavElem = $("<img>");
    imageNavElem.get(0).src = imageSRC;
    imageNavElem.attr('id', 'nav-image');
    imageNavElem.attr('draggable', false);
    imageNavElem.appendTo($("#navigator"));
    $("#navigator").click(function(){
      $(this).toggleClass('down');
    });
    navViewport.init(imageFullElem, imageNavElem);
  }
  var imageViewFullResize = function () {
    var elem = $("#imageViewFull");
    if (elem.width() < $(window).width()) {
      elem.addClass('middle');
      elem.css('margin-left', '-' + (elem.width() / 2) +'px');
    } else {
      elem.removeClass('middle');
      elem.css('margin-left', '0');
    }
    if (elem.height() < $(window).height()) {
      elem.addClass('center');
      elem.css('margin-top', '-' + (elem.height() / 2) +'px');
    } else {
      elem.removeClass('center');
      elem.css('margin-top', '0');
    }
  }

  $(window).resize(function(){
    imageViewFullResize();
  });
  imageViewFullResize();
});

$("#full-close-bt, #imageViewFull").on('click', minimizeFull);

var navViewport = {
  source      : undefined,
  navImage    : undefined,
  navViewElem : $("#nav-viewport"),
  zoomRatio   : function() {
    return this.navImage.width() / this.source.width();
  },
  position    : function() {
    var zoomRatio = this.zoomRatio();
    navViewport.navViewElem.css('top', $(window).scrollTop() * zoomRatio + 'px');
    navViewport.navViewElem.css('left', $(window).scrollLeft() * zoomRatio + 'px');
  },
  draw        : function(ratioCal) {
    var zoomRatio = this.zoomRatio();
    navViewport.navViewElem.width($(window).width() * zoomRatio - 4);
    navViewport.navViewElem.height($(window).height() * zoomRatio - 4);
  },
  init : function(imageFullElem, imageNavElem) {
    this.source    = imageFullElem;
    this.navImage  = imageNavElem;
    $(window).scroll(navViewport.adjust.scroll);
    $(window).resize(navViewport.adjust.resize);
    this.draw();
  },
  adjust : {
    scroll : function() {
      if (!imageViewFull) return;
      navViewport.position();
    },
    resize : function() {
      navViewport.draw();
      navViewport.position();
    }
  }
}

});