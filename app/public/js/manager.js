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

function deleteAdmin() {
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
                deleteAdmin(password:"${password}")
           }`
        }),
        success: function (res) {
            $('#deleteUserMsg').html(res.data.deleteAdmin);
            if(res.data.deleteAdmin == "User deleted!") {
                setTimeout(function() {
                    window.location.href = "logout"
                }, 2000);
            }
        }
    });
}