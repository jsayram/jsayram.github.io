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



//This allow scrolling to specified naviation to be smoother and
// it doesnt jump past the clicked link, it gives a good amount of padding on the top

jQuery(document).ready(function () {
    //this prevents the default action
    jQuery('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var target = this.hash,
            jQuerytarget = jQuery(target);

        jQuery('html,body').stop().animate({
            'scrollTop': jQuerytarget.offset().top - 90
        }, 700, 'swing', function () {
            window.location.hash = target;
        });
    });
});
