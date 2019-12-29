$(document).ready(function () {

    $("#signForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/graphql',
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
                    $('#signUpMsg').html("User created! Redirecting...");
                    setTimeout(function() {
                        window.location.href = "/login";
                    }, 1500);
                } else {
                    $('#signUpMsg').html("User already exists!");
                }

            }
        });

    });
});

