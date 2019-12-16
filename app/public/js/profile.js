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
    $('#update').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:4000/graphql',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                query: `mutation {
                updatePassword(oldPassword: "${$(this).find('input[name="oldPassword"]').val()}", newPassword: "${$(this).find('input[name="newPassword"]').val()}" )
            }`
            }),
            success: function (res) {
                $('#updateMessage').html(res.data.updatePassword);
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
            }`
        }),
        success: function (res) {
            $('#profileImg').attr('src', res.data.image);
        }
    });
});



function readUrl (input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profileImg').attr('src', e.target.result);

            $.ajax({
                url: 'http://localhost:4000/graphql',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({
                    query: `mutation {
                    uploadImg(image:"${e.target.result}")
                  }`
                }),
                processData: false,
                success: function (res) {
                    $('#profileMessage').html(res.data.uploadImg);
                }
            });
        };
        reader.readAsDataURL(input.files[0]);
    }
}