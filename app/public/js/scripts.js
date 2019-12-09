$(document).ready(function () {
    $('#nav-monitor').click(function () {
        $('a').removeClass('active');
        $(this).find('a').addClass('active');
        $('#profile').hide();
        $('#monitor').show();
    });
    $('#nav-profile').click(function () {
        $('a').removeClass('active');
        $(this).find('a').addClass('active');
        $('#monitor').hide();
        $('#profile').show();
    });
});
