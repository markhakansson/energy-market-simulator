$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                users {
                    username
                }
            }`
        }),
        success: function (res) {
            
            res.data.users.forEach(obj => {
                $("#users").append("<li><a href='/prosumer?username=" + obj.username + "'>" + obj.username + "</a></li>");
            
            });
        }
    });
    $.ajax({
        url: 'http://localhost:4000/online',
        contentType: 'application/json',
        type: 'GET',
        success: function(res) {
            res.users.forEach(obj => {
                $("#online").append("<li><a>" + obj +  "</a></li>");

            });
        }
    });
    $('#bufferRatioSlider').change(function () {
        const value = this.value;
        $('#bufferRatioValue').html(value);
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function() {
                console.log("BufferRatio updated to " + value + "%");
            }
        });
    });
    $('#marketPriceSlider').change(function () {
        const value = this.value;
        $('#priceRatioValue').html(value);
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketPrice(price: ${value})
                }`
            }),
            success: function() {
                console.log("Price updated to " + value);
            }
        });
    });
    
    updateInformation();

    // setInterval(updateInformation, 5000);
    
});


function updateInformation () {
    $.ajax({
        url: 'http://localhost:4000/graphql',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                market{timestamp, status,production, consumption, demand, price, fillBatteryRatio, recommendedPrice}
            }`
        }),
        success: function (res) {
            const market = res.data.market;
            $('#timestamp').html(market.timestamp);
            $('#status').html(market.status);
            $('#production').html(market.production);
            $('#consumption').html(market.consumption);
            $('#demand').html(market.demand);
            $('#price').html(market.price);
            $('#recPrice').html(market.recommendedPrice);
            
            // Sliders
            $('#bufferRatioSlider').val(market.fillBatteryRatio * 100);
            $('#bufferRatioValue').html(market.fillBatteryRatio * 100);
            $('#marketPriceSlider').val(market.price);
            $('#priceRatioValue').html(market.price);

            // Chart
            if (marketChart !== null) {
                marketChart.addData(market.demand, market.timestamp);
            }
        
        },
        error: function (err) {
            console.log(err);
        }
    });
    
}