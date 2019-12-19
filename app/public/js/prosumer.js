$(document).ready(function () {
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
    // setInterval(updateInformation, 100);
    updateInformation();
});



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
