$(document).ready(function () {
    $('#nav-monitor').click(function () {
        $('#profile').hide();
        $('#monitor').show();
    });
    $('#nav-profile').click(function () {
        $('#monitor').hide();
        $('#profile').show();
    });
});