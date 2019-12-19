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
                $("#users").append("<li><a>" + obj.username +  "</a></li>");

            });
        }
    });
    
});
