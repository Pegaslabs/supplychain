$(function() {
    $(document).ready(function(){ 
        $("#signin_email").focus();
        $('#signin').click(function(evt) {
            $($("#signin_email").parents('.control-group')[0]).removeClass('error');
            $("#signin_email").next('.help-inline').hide();
            $($("#signin_password").parents('.control-group')[0]).removeClass('error');
            $("#signin_password").next('.help-inline').hide();
            evt.preventDefault();
            var data = {};
            data['email'] = $("#signin_email").val();
            data['password'] = $("#signin_password").val();
            var json_text = JSON.stringify(data, null, 2);
            $.post('/accounts/signin/', {
                data: json_text
            }, function(data) {
                if (data && data.success) {
                    window.location = '/';
                }
                else{
                    if (data['errors']['PASSWORD']){
                        $($("#signin_password").parents('.control-group')[0]).addClass('error');
                        $("#signin_password").next('.help-inline').show();   
                    }
                    if (data['errors']['EMAIL']){
                        $($("#signin_email").parents('.control-group')[0]).addClass('error');
                        $("#signin_email").next('.help-inline').show();
                    }
                }
            });
        });
        $('#signup').click(function(evt) {
            $($("#signup_email").parents('.control-group')[0]).removeClass('error');
            $("#signup_email").next('.help-inline').hide();
            $("#signup_email").next('.help-inline').next('.help-inline').hide();
            $($("#signup_password").parents('.control-group')[0]).removeClass('error');
            $("#signup_password").next('.help-inline').hide();
            $($("#signinup_password_repeat").parents('.control-group')[0]).removeClass('error');
            $("#signinup_password_repeat").next('.help-inline').hide();
            evt.preventDefault();
            var data = {};
            data['email'] = $("#signup_email").val();
            data['password'] = $("#signup_password").val();
            data['password_repeat'] = $("#signup_password_repeat").val();
            var json_text = JSON.stringify(data, null, 2);
            $.post('/accounts/signup/', {
                data: json_text
            }, function(data) {
                if (data && data.success) {
                    window.location = '/';
                }
                else{
                    if (data['errors']['PASSWORD_REPEAT']){
                        $($("#signup_password_repeat").parents('.control-group')[0]).addClass('error');
                        $("#signup_password_repeat").next('.help-inline').show();   
                    }
                    if (data['errors']['PASSWORD']){
                        $($("#signup_password").parents('.control-group')[0]).addClass('error');
                        $("#signup_password").next('.help-inline').show();   
                    }
                    if (data['errors']['EMAIL']){
                        $($("#signup_email").parents('.control-group')[0]).addClass('error');
                        $("#signup_email").next('.help-inline').show();
                    }
                    if (data['errors']['EMAIL_EXISTS']){
                        $($("#signup_email").parents('.control-group')[0]).addClass('error');
                        $("#signup_email").next('.help-inline').next('.help-inline').show();
                    }
                }
            });
        });
    });
});