$(document).ready(function () {

    $("#loginForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/graphql',
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
                    $('#loginMsg').html("Incorrect username or password!");
                }

            }
        });

    });
});

