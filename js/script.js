//used to open the side nav when the user presses the collapsed button
function openNav() {
    document.getElementById("mySidenav").style.width = "210px";
    document.getElementById("main").style.marginLeft = "210px";
    document.getElementById('name').style.display = 'none';
}

function closeNav() {
    document.getElementById('name').style.display = 'block';
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";


}

$(function () {

});
