//used to open the side nav when the user presses the collapsed button
var navOpenBig = '100px';
var navOpenSmall = '90px';
var navOpenXSmall = '50px';
var overlayLight = 'rgba(0, 0, 0, .1)';
var overlayDark = 'rgba(0, 0, 0, .6)';

function openNav() {
    if ($(window).width() <= 321) {

        document.getElementById("mySidenav").style.width = navOpenSmall;
        document.getElementById('main').style.marginLeft = navOpenSmall;
        document.getElementById('headerText').style.marginLeft = navOpenSmall;
        document.getElementById('name').style.display = 'none';
        document.getElementById('logo').style.display = 'block';
        document.getElementById('overlay').style.backgroundColor = overlayLight;

    } else if ($(window).width() > 321 && $(window).width() <= 360) {
        document.getElementById("mySidenav").style.width = navOpenBig;
        document.getElementById('main').style.marginLeft = navOpenBig;
        document.getElementById('headerText').style.marginLeft = navOpenSmall;
        document.getElementById('name').style.display = 'block';
        document.getElementById('logo').style.display = 'block';
        document.getElementById('overlay').style.backgroundColor = overlayLight;

    } else if ($(window).width() > 360 && $(window).width() <= 599) {
        document.getElementById('logo').style.display = 'block';
        document.getElementById('name').style.display = 'block';
        document.getElementById("mySidenav").style.width = navOpenBig;
        document.getElementById("main").style.marginLeft = navOpenBig;
        document.getElementById('headerText').style.marginLeft = navOpenXSmall;
        document.getElementById('overlay').style.backgroundColor = overlayLight;

    } else if ($(window).width() > 599) {
        document.getElementById('logo').style.display = 'block';
        document.getElementById('name').style.display = 'block';
        document.getElementById("mySidenav").style.width = navOpenBig;
        document.getElementById('main').style.marginLeft = navOpenBig;
        document.getElementById('overlay').style.backgroundColor = overlayLight;
    }

}

function closeNav() {
    if ($(window).width() <= 320) {
        document.getElementById('name').style.display = 'block';
        document.getElementById('logo').style.display = 'block';
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById('main').style.marginLeft = "0";
        document.getElementById('headerText').style.marginLeft = "0";
        document.getElementById('overlay').style.backgroundColor = overlayDark;

    } else {
        document.getElementById('name').style.display = 'block';
        document.getElementById('logo').style.display = 'block';
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById('headerText').style.marginLeft = "0";
        document.getElementById('overlay').style.backgroundColor = overlayDark;
    }
}

window.onorientationchange = function () {
    location.reload()
};

//refreshes the page when its being resized
//$(window).resize(function () {
//    location.reload();
//});


//This allow scrolling to specified # to be smoother
// it doesnt jump past the clicked link, it gives a good amount of padding on the top
// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body, footer').animate({
                    scrollTop: target.offset().top - 20
                }, 500, function () {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });




// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.navbar-fixed-bottom, .navbar-fixed-top').outerHeight();

$(window).scroll(function (event) {
    didScroll = true;
});

setInterval(function () {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('.navbar-fixed-bottom, .navbar-fixed-top').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('.navbar-fixed-bottom, .navbar-fixed-top').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}

//closes navigation when clicking anywhere in the screen after opening the sidenav

$("#closeButton").click(function (e) {
    e.stopPropagation();
    $(".sidenav").toggleClass("active");
});
$("#buttonNav").click(function (e) {
    e.stopPropagation();
    if ($("#mySidenav").hasClass("active")) {
        document.getElementById("mySidenav").style.width = "0";
        closeNav();

    } else {
        document.getElementById("mySidenav").style.width = navOpenBig;
        openNav();
    }

    $('.sidenav').toggleClass("active");
});

$(document).click(function () {
    if ($("#mySidenav").hasClass("active")) {
        document.getElementById("mySidenav").style.width = "0";
        closeNav();
        $(".sidenav").removeClass("active");
    }
});
