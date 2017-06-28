//used to open the side nav when the user presses the collapsed button
function openNav() {
    document.getElementById("mySidenav").style.width = "210px";
    document.getElementById("main").style.marginleft = "210px";
    document.getElementById('name').style.display = 'none';


    if ($(window).width() > 360 && $(window).width() < 599) {
        document.getElementById('logo').style.display = 'block';

    } else if ($(window).width() > 599) {
        document.getElementById('logo').style.display = 'block';
        document.getElementById('name').style.display = 'block';
    } else {
        document.getElementById('logo').style.display = 'none';
        document.getElementById('name').style.display = 'none';

    }

}

function closeNav() {
    if ($(window).width() < 360) {
        document.getElementById('name').style.display = 'none';
        document.getElementById('logo').style.display = 'block';
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";

    } else {
        document.getElementById('name').style.display = 'block';
        document.getElementById('logo').style.display = 'block';
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }
}

window.onorientationchange = function () {
    location.reload()
};



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
                $('html, body').animate({
                    scrollTop: target.offset().top - 90
                }, 1000, function () {
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
