const graphqUrl = 'http://34.238.115.161/graphql';
const restOnline = 'http://34.238.115.161/online';

$(document).ready(function () {
    $('#productionSlider').change(function () {
        const value = this.value;
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketProduction(production: ${value})
                }`
            }),
            success: function () {
                console.log('Production updated to ' + value);
                $('#productionValue').html(value);
            }
        });
    });
    $('#setProductionValue').click(function () {
        const value = $('#productionValueText').val();
        if (isNaN(value) || value < 0 || value > 100) {
            alert('You must provide positive digits (1-100)!');
            return;
        }
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketProduction(production: ${value})
                }`
            }),
            success: function () {
                $('#productionValue').html(value);
                $('#productionSlider').val(value);
            },
            error: function (e) {
                alert('Bad request, did you input digits?');
            }
        });
    });
    $('#bufferRatioSlider').change(function () {
        const value = this.value;
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function (e) {
                $('#bufferRatioValue').html(value);
            }
        });
    });
    $('#setBufferRatio').click(function () {
        const value = $('#bufferValueText').val();
        if (isNaN(value) || value < 0 || value > 100) {
            alert('You must provide positive digits (1-100)!');
            return;
        }
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketFillBatteryRatio(fillBatteryRatio: ${value / 100})
                }`
            }),
            success: function () {
                $('#bufferRatioValue').html(value);
                $('#bufferRatioSlider').val(value);
            },
            error: function (e) {
                alert('Bad request, did you input digits?');
            }
        });
    });
    $('#marketPriceSlider').change(function () {
        const value = this.value;
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketPrice(price: ${value})
                }`
            }),
            success: function () {
                $('#priceRatioValue').html(value);
            }
        });
    });
    $('#setPrice').click(function () {
        const value = $('#priceValueText').val();
        if (isNaN(value) || value < 0) {
            alert('You must provide positive digits!');
            return;
        }
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                    setMarketPrice(price: ${value})
                }`
            }),
            success: function () {
                $('#priceRatioValue').html(value);
                $('#marketPriceSlider').val(value);
            },
            error: function (e) {
                alert('Bad request, did you input digits?');
            }
        });
    });
    $('#autopilot').change(function (e) {
        if (!$(this).is(':checked')) {
            $.ajax({
                url: graphqUrl,
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({
                    query: `mutation {
                        useAutopilot(enable: ${false})
                    }`
                }),
                success: function () {
                    $(this).prop('checked', false);
                }

            });
        } else {
            $.ajax({
                url: graphqUrl,
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({
                    query: `mutation {
                        useAutopilot(enable: ${true})
                    }`
                }),
                success: function () {
                    $(this).prop('checked', true);
                }

            });
        }
    });
    $('#timeBlock').change(function () {
        $('#timeBlockValue').html(this.value);
    });
    // TODO: Uncomment when moving to production!
    updateInformation();
    setInterval(updateInformation, 5000);
    getBlackOut();
    setInterval(getBlackOut, 5000);
    getUsers();
    setInterval(getUsers, 100000);
    getOnlineUsers();
    setInterval(getOnlineUsers, 10000)
});

function updateInformation () {
    $.ajax({
        url: graphqUrl,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                manager{timestamp, status, production, consumption, demand, price, fillBatteryRatio, recommendedProduction, recommendedPrice, autopilot, manualPrice, manualProduction}
            }`
        }),
        success: function (res) {
            const market = res.data.manager;
            $('#timestamp').html(market.timestamp);
            $('#status').html(market.status);
            $('#production').html(market.production);
            $('#consumption').html(market.consumption);
            $('#demand').html(market.demand);
            $('#price').html(market.price);
            $('#recPrice').html(market.recommendedPrice);

            // Sliders
            $('#productionSlider').val(market.manualProduction);
            $('#productionValue').html(market.manualProduction);
            $('#bufferRatioSlider').val(market.fillBatteryRatio * 100);
            $('#bufferRatioValue').html(market.fillBatteryRatio * 100);
            $('#marketPriceSlider').val(market.manualPrice);
            $('#priceRatioValue').html(market.manualPrice);

            $('#autopilot').prop('checked', market.autopilot);

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

function getBlackOut () {
    $.ajax({
        url: graphqUrl,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `{
                isBlocked {
                    name,
                    timestamp,
                    blackout
                }
            }`
        }),
        success: function (res) {
            res.data.isBlocked.forEach(obj => {
                $('#blackout').empty();
                if (obj.blackout) {
                    $('#blackout').append('<li><a>' + obj.name + ' at ' + obj.timestamp + '</a></li>');
                }
            });
        }
    });
}

function getUsers () {
    $.ajax({
        url: graphqUrl,
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
                $('#users').append("<li><a href='/prosumer?username=" + obj.username + "'>" + obj.username + '</a></li>');
                $('#users').append('<button type=button id=' + obj.username + ' > Block </button>');
                $('#users').on('click', '#' + obj.username, function () {
                    console.log($('#timeBlock').val());
                    $.ajax({
                        url: graphqUrl,
                        contentType: 'application/json',
                        type: 'POST',
                        data: JSON.stringify({
                            query: `mutation {
                                blockProsumer(prosumerName: "${obj.username}", timeout: ${$('#timeBlock').val()})
                            }`
                        }),
                        success: function (res) {
                            $('#blockInfo').html(res.data.blockProsumer);
                        },
                        error: function (e) {
                            $('#blockInfo').html('Error: ' + e + '\n Did you provide digits?');
                        }
                    })
                });
            });
        }
    });
}
/**
 * Only case we use REST API for simplicity
 */
function getOnlineUsers () {
    $.ajax({
        url: restOnline,
        contentType: 'application/json',
        type: 'GET',
        success: function (res) {
            $('#online').empty();
            res.users.forEach(obj => {
                $('#online').append('<li><a>' + obj + '</a></li>');
            });
        }
    });
}
