$(document).ready(function () {
    $('#useBatteryRatioSlider').click(function () {
        const value = $('#useBatteryRatioValue').text();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateUseBatteryRatio(useBatteryRatio: ${value / 100})
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
                    updateFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            })
        });
    });
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
            success: function() {
                $('#useBatteryRatioValue').html(value);

            }
        });
    });
    $('#setUseBatteryRatioValue').click(function () {
        const value = $('#useBatteryRatioText').val();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateUseBatteryRatio(useBatteryRatio: ${value / 100})
                }`
            }),
            success: function() {
                $('#useBatteryRatioValue').html(value);
                $('#useBatteryRatioSlider').val(value);

            },
            error: function(e) {
                alert("Bad request, did you input digits?");
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
            success: function() {
                $('#fillBatteryRatioValue').html(value);

            }
        });
    });
    $('#setFillBatteryRatio').click(function () {
        const value = $('#fillBatteryRatioText').val();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    updateFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function() {
                $('#fillBatteryRatioValue').html(value);
                $('#fillBatteryRatioSlider').val(value);

            },
            error: function(e) {
                console.log(e);
                alert("Bad request, did you input digits?");
            }
        });

    });
 
    // mutation { updatePassword(oldPassword: "test", newPassword: "f") }
    updateInformation();

    // setInterval(updateInformation, 5000);
    // setInterval(updateInformation, 100);
    
});

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
            console.log(result.data);
            const prosumer = result.data.prosumer;
            const market = String(prosumer.market);
            $('#timestamp').html(prosumer.timestamp);
            $('#production').html(prosumer.production.toFixed(2));
            $('#consumption').html(prosumer.consumption.toFixed(2));
            $('#netproduction').html((Number(prosumer.production) - Number(prosumer.consumption)).toFixed(2));
            $('#batterycap').html(prosumer.currBatteryCap.toFixed(2));
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
            $('#windspeed').html(result.data.weather.wind_speed.toFixed(2));
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteUser() {
    const password = $('#pass').val();
    if(password == null || password == "") {
        $('#deleteUserMsg').html("Please provide your password!");
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
            if(res.data.deleteUser) {
                $('#deleteUserMsg').html("User deleted! Redirecting...");
                setTimeout(function() {
                    window.location.href = "logout"
                }, 2000);
            } else {
                $('#deleteUserMsg').html("Incorrect password!");

            }
            
        }
    });
}
