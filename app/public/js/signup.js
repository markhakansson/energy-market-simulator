const graphqUrl = 'http://34.238.115.161/graphql';

$(document).ready(function () {
    $('#signForm').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: graphqUrl,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation { 
                    signUp(
                        username: "${$('#username').val()}", 
                        password: "${$('#password').val()}"
                        ) 
                    }`
            }),
            success: function (res) {
                if (res.data.signUp) {
                    $('#signUpMsg').html('User created! Redirecting...');
                    setTimeout(function () {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    $('#signUpMsg').html('User already exists or you did something wrong!');
                }
            }
        });
    });
});
