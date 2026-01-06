(function () {
    var layout   = document.getElementById('layout');
    var menu     = document.getElementById('menu');
    var menuLink = document.getElementById('menuLink');

    menuLink.onclick = function (e) {
        e.preventDefault();
        layout.classList.toggle('active');
    };
})();
