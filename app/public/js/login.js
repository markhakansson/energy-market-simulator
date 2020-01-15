const graphqUrl = 'http://34.238.115.161:4000/graphql';

$(document).ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation { 
                    login(
                        username: "${$('#username').val()}", 
                        password: "${$('#password').val()}"
                        ) 
                    }`
            }),
            success: function (res) {
                if (res.data.login) {
                    window.location.reload();
                } else {
                    $('#loginMsg').html('Incorrect username or password!');
                }
            }
        });
    });
});
