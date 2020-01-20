var graphqUrl = window.location.origin + '/graphql';
var restOnline = window.location.origin + '/online';

$(document).ready(function () {
    $('#setProductionValue').click(function () {
        const value = $('#productionValueText').val();
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
                    setMarketProduction(production: ${value})
                }`
            }),
            success: function () {
                $('#productionValue').html(value);
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
                manager{timestamp, status, production, consumption, demand, price, fillBatteryRatio, recommendedProduction, recommendedPrice, autopilot, manualPrice, manualProduction, currBatteryCap}
            }`
        }),
        success: function (res) {
            const market = res.data.manager;
            $('#timestamp').html(market.timestamp);
            $('#status').html(market.status);
            $('#production').html(market.production.toFixed(2));
            $('#consumption').html(market.consumption.toFixed(2));
            $('#demand').html(market.demand.toFixed(2));
            $('#price').html(market.price.toFixed(2));
            $('#recPrice').html(market.recommendedPrice.toFixed(2));
            $('#recProduction').html(market.recommendedProduction.toFixed(2));
            $('#batterycap').html(market.currBatteryCap.toFixed(2));

            // Sliders
            $('#productionValue').html(market.manualProduction.toFixed(2));
            $('#bufferRatioSlider').val(market.fillBatteryRatio * 100);
            $('#bufferRatioValue').html(market.fillBatteryRatio * 100);
            $('#marketPriceSlider').val(market.manualPrice.toFixed(2));
            $('#priceRatioValue').html(market.manualPrice.toFixed(2));

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
            $('#blackout').empty();
            res.data.isBlocked.forEach(obj => {
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
            $('#users').empty();
            $('#deleteProsumers').empty();
            res.data.users.forEach(obj => {
                $('#deleteProsumers').append(`<option value="${obj.username}">${obj.username}</option>`);
                $('#users').append("<li><a href='/prosumer?username=" + obj.username + "'>" + obj.username + '</a></li>');
                $('#users').append('<button type=button id=' + obj.username + ' > Block </button>');
                $('#users').on('click', '#' + obj.username, function () {
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
                            alert("User " + obj.username + " is " + res.data.blockProsumer + " for " + $('#timeBlock').val() + "s");
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

function deleteProsumer() {
    let prosumer = $("#deleteProsumers").val();
    $.ajax({
        url: graphqUrl,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            query: `mutation {
                deleteProsumer(prosumer:"${prosumer}")
           }`
        }),
        success: function (res) {
            if (res.data.deleteProsumer) {
                $("#deleteProsumers option[value=" + prosumer + "]").remove();
                alert("Prosumer " + prosumer + " deleted!");
            } else {
                $('#deleteProsumerMsg').html('Something went wrong...');
            }
        }
    });

}
