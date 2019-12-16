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
        const value = $('#useBatteryRatioValue').text();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateUseBatteryRatio(useBatteryRatio: ${value})
                }`
            })
        });
    });
    $('#fillBatteryRatioSlider').click(function () {
        const value = $('#fillBatteryRatioValue').text();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateFillBatteryRatio(fillBatteryRatio: ${value})
                }`
            })
        });
    });
    setInterval(updateInformation, 5000);
    $('#update').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/update',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({ updatePassword: $(this).find('input[name="updatePassword"]').val(), password: $(this).find('input[name="password"]').val() }),
            success: function (res) {
                $('#updateMessage').html(res);
            }
        });
    });
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                image
            }`
        }),
        success: function (res) {
            $('#profileImg').attr('src', res.data.image);
        }
    });

    // setInterval(updateInformation, 100);
    updateInformation();
});

function readUrl (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profileImg').attr('src', e.target.result);

            $.ajax({
                url: 'http://localhost:4000/graphql',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({
                    query: `mutation {
                    uploadImg(image:"${e.target.result}")
                  }`
                }),
                processData: false,
                success: function (res) {
                    $('#profileMessage').html(res.data.uploadImg);
                }
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateInformation () {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                prosumer{production,consumption,currBatteryCap, market, timestamp}
            }`
        }),
        success: function (result) {
            const prosumer = result.data.prosumer;
            const market = String(prosumer.market);
            $('#timestamp').html(prosumer.timestamp);
            $('#production').html(prosumer.production.toFixed(2));
            $('#consumption').html(prosumer.consumption.toFixed(2));
            $('#netproduction').html((Number(prosumer.production) - Number(prosumer.consumption)).toFixed(2));
            $('#batterycap').html(prosumer.currBatteryCap.toFixed(2));
            updateMarketInformation(market);
            updateWindspeed(market);
            if(productionChart !== null) {
                productionChart.addData(prosumer.production.toFixed(2), prosumer.timestamp);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function updateMarketInformation (name) {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                market(name:"${name}"){price}
            }`
        }),
        success: function (result) {
            console.log(result);
            $('#marketprice').html(result.data.market.price.toFixed(2));
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function updateWindspeed (location) {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                weather(location:"${location}"){wind_speed}
            }`
        }),
        success: function (result) {
            console.log(result);
            $('#windspeed').html(result.data.weather.wind_speed.toFixed(2));
        },
        error: function (err) {
            console.log(err);
        }
    });
}
