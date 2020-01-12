$(document).ready(function () {
    $('#useBatteryRatioSlider').change(function () {
        const value = this.value;
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateUseBatteryRatio(useBatteryRatio: ${value / 100})
                }`
            }),
            success: function () {
                $('#useBatteryRatioValue').html(value);
            }
        });
    });
    $('#setUseBatteryRatioValue').click(function () {
        const value = $('#useBatteryRatioText').val();
        if (isNaN(value) || value < 0 || value > 100) {
            alert("You must provide positive digits (1-100)!");
            return;
        }
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateUseBatteryRatio(useBatteryRatio: ${value / 100})
                }`
            }),
            success: function () {
                $('#useBatteryRatioValue').html(value);
                $('#useBatteryRatioSlider').val(value);
            },
            error: function (e) {
                alert('Bad request, did you input digits?');
            }
        });
    });
    $('#fillBatteryRatioSlider').change(function () {
        const value = this.value;
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function () {
                $('#fillBatteryRatioValue').html(value);
            }
        });
    });
    $('#setFillBatteryRatio').click(function () {
        const value = $('#fillBatteryRatioText').val();
        if (isNaN(value) || value < 0 || value > 100) {
            alert("You must provide positive digits (1-100)!");
            return;
        }
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function () {
                $('#fillBatteryRatioValue').html(value);
                $('#fillBatteryRatioSlider').val(value);
            },
            error: function (e) {
                console.log(e);
                alert('Bad request, did you input digits?');
            }
        });
    });
    updateInformation();
    setInterval(updateInformation, 5000);
});

function updateInformation () {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                prosumer{production,consumption,currBatteryCap, market, timestamp, fillBatteryRatio, useBatteryRatio, turbineStatus}
            }`
        }),
        success: function (res) {
            const prosumer = res.data.prosumer;
            const market = String(prosumer.market);
            $('#timestamp').html(prosumer.timestamp);
            $('#production').html(prosumer.production.toFixed(2));
            $('#consumption').html(prosumer.consumption.toFixed(2));
            $('#useBatteryRatioValue').html(prosumer.useBatteryRatio.toFixed(2));
            $('#fillBatteryRatioValue').html(prosumer.fillBatteryRatio.toFixed(2));
            $('#netproduction').html((Number(prosumer.production) - Number(prosumer.consumption)).toFixed(2));
            $('#batterycap').html(prosumer.currBatteryCap.toFixed(2));
            $('#turbinestatus').html(prosumer.turbineStatus);

            //Sliders
            $('#useBatteryRatioValue').html(prosumer.useBatteryRatio * 100);
            $('#useBatteryRatioSlider').val(prosumer.useBatteryRatio * 100);
            $('#fillBatteryRatioValue').html(prosumer.fillBatteryRatio * 100);
            $('#fillBatteryRatioSlider').val(prosumer.fillBatteryRatio * 100);

            updateMarketInformation(market);
            updateWindspeed(market);
            if (productionChart !== null) {
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
                marketPrice(name:"${name}")
            }`
        }),
        success: function (res) {
            $('#marketprice').html(res.data.marketPrice.toFixed(2));
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
            $('#windspeed').html(result.data.weather.wind_speed.toFixed(2));
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteUser () {
    const password = $('#pass').val();
    if (password == null || password == '') {
        $('#deleteUserMsg').html('Please provide your password!');
        return;
    }
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `mutation {
                deleteUser(password:"${password}")
           }`
        }),
        success: function (res) {
            if (res.data.deleteUser) {
                $('#deleteUserMsg').html('User deleted! Redirecting...');
                setTimeout(function () {
                    window.location.href = 'logout'
                }, 2000);
            } else {
                $('#deleteUserMsg').html('Incorrect password!');
            }
        }
    });
}
