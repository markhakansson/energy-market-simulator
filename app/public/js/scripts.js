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
    $('#useBatteryRatioSlider').click(function () {
        let value = $('#useBatteryRatioValue').text();
        console.log("Use ratio: " + value);
    });
    $('#fillBatteryRatioSlider').click(function () {
        let value = $('#fillBatteryRatioValue').text();
        console.log("Fill ratio: " + value.toString());
    });
    setInterval(updateInformation, 100);
});

// should be run server-side to get session data
function updateInformation () {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                weather(name:"Rain"){wind_speed}
            }`
        }),
        success: function (result) {
            $('#windspeed').html(result.data.weather.wind_speed);
        }
    });
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                prosumer(name:"Test"){production,consumption,currBatteryCap}
            }`
        }),
        success: function (result) {
            $('#production').html(result.data.prosumer.production);
            $('#consumption').html(result.data.prosumer.consumption);
            $('#netproduction').html(Number(result.data.prosumer.production) - Number(result.data.prosumer.consumption));
            $('#batterycap').html(result.data.prosumer.currBatteryCap);
        }
    });
}
