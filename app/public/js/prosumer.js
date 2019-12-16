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
    // mutation { updatePassword(oldPassword: "test", newPassword: "f") }
    setInterval(updateInformation, 5000);
    $('#update').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                updatePassword(oldPassword: "${$(this).find('input[name="oldPassword"]').val()}", newPassword: "${$(this).find('input[name="newPassword"]').val()}" )
            }`
            }),
            success: function (res) {
                $('#updateMessage').html(res.data.updatePassword);
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
                weather {wind_speed}
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
                prosumer{production,consumption,currBatteryCap, market}
            }`
        }),
        success: function (result) {
            const market = String(result.data.prosumer.market);
            $('#timestamp').html(result.data.prosumer.timestamp);
            $('#production').html(result.data.prosumer.production);
            $('#consumption').html(result.data.prosumer.consumption);
            $('#netproduction').html(Number(result.data.prosumer.production) - Number(result.data.prosumer.consumption));
            $('#batterycap').html(result.data.prosumer.currBatteryCap);
            updateMarketInformation(market);
            updateWindspeed(market);
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
            $('#marketprice').html(result.data.market.price);
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
            $('#windspeed').html(result.data.weather.wind_speed);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
