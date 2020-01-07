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
    // mutation { updatePassword(oldPassword: "test", newPassword: "f") }
    updateInformation();

    setInterval(updateInformation, 5000);
    // setInterval(updateInformation, 100);
    
});

function updateInformation (user) {
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
            console.log(result);
            $('#windspeed').html(result.data.weather.wind_speed.toFixed(2));
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteUser() {
    let password = prompt("Please enter your password");
    if(password == null || password == "") {
        $('#deleteUserMsg').html("Please provide your password");
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
