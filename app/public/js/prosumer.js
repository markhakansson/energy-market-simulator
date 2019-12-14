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
    $('#update').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/update',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify( { updatePassword: $(this).find('input[name="updatePassword"]').val(), password: $(this).find('input[name="password"]').val() } ),
            success: function(res) {
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
                }`,
            }),
            success: function(res) {
                $('#profileImg').attr('src', res.data.image);
            }
        });

 
    // setInterval(updateInformation, 100);
    updateInformation();
});

function readUrl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profileImg').attr('src', e.target.result);

            $.ajax({
                url: 'http://localhost:4000/graphql',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({ query: `mutation {
                    uploadImg(image:"${e.target.result}")
                  }` } ),
                processData: false,
                success: function(res) {
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
                prosumer {timeMultiplier,timestamp,production,consumption,currBatteryCap,maxBatteryCap,bought,blackout,turbineStatus}
            }`
        }),
        success: function (result) {
            $('#timestamp').html(result.data.prosumer.timestamp);
            $('#production').html(result.data.prosumer.production);
            $('#consumption').html(result.data.prosumer.consumption);
            $('#netproduction').html(Number(result.data.prosumer.production) - Number(result.data.prosumer.consumption));
            $('#batterycap').html(result.data.prosumer.currBatteryCap);
        },
        error: function (err) {
            console.log(err);
        }
    });
}



// name: String,
// wind: Number,
// market: Object,
// timeMultiplier: Number,
// timestamp: { type: Date, default: new Date() },
// production: Number,
// consumption: Number,
// currBatteryCap: Number,
// maxBatteryCap: Number,
// fillBatteryRatio: Number,
// useBatteryRatio: Number,
// bought: Number,
// blackout: Boolean,
// turbineStatus: String,
// turbineWorking: Boolean,
// turbineBreakPercent: Number,
