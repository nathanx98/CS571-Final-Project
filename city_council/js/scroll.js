// JQUERY CODE for scrolling section
$(document).scroll(function() {
var wrapper = $('#container');
var box = $('#sidebar');

var offsetTop = - wrapper.offset().top + $(window).scrollTop();
var offsetBottom = wrapper.offset().top - $(window).scrollTop() + wrapper.outerHeight() - box.outerHeight();
console.log("height:" + wrapper.outerHeight());
console.log("b:" + offsetBottom);
console.log("t:" + offsetTop);
if (offsetBottom > 0 && offsetTop <= 0) {
    box.css({
    'top': 0
    });
} else if (offsetBottom > 0 && offsetTop > 0) {
    box.css({
    'top': 0 + 'px'
    });
} else {
    box.offset({
    'top': $(window).scrollTop() + offsetBottom
    });
}

});