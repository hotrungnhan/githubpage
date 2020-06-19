count = 0
function makeCourseParram(coursearr, token, mssv) {
    let ob = {};
    ob["op"] = "Đăng ký";
    ob["txtmasv"] = mssv;
    ob["form_token"] = token;
    ob["form_id"] = "uit_dkhp_dangky_form";
    for (let i = 0; i < coursearr.length; i++) {
        ob["table_lophoc" + "[" + coursearr[i] + "]"] = coursearr[i];
    }
    return ob;
}
function showpassword() {
    var x = document.getElementById("pass");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function appendnof(str) {
    $('#notify').empty();
    $('#notify').append(str);
}
$(document).ready(function () {
    if (localStorage.getItem("pass") && localStorage.getItem("id")) {
        $("#name").val(localStorage.getItem("id"));
        $("#pass").val(localStorage.getItem("pass"));

    }
    if (localStorage.getItem("course")) {
        $("#course").val(localStorage.getItem("course"));
    }
})
$(document).ready(function () {

    $("#login-form .submit").on('click', e => {
        if ($("#name").val() != "" && $("#pass").val() != "") {
            localStorage.setItem('id', $("#name").val());
            localStorage.setItem('pass', $("#pass").val());
            localStorage.setItem('course', $("#course").val().trim());
            let data = {
                name: $("#name").val(),
                pass: $("#pass").val(),
                form_id: "user_login",
                op: "Log in"
            }
            console.log(data);

            axios({
                method: 'get',
                url: 'https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data
            }).then(res => {
                appendnof("đăng nhập thành công ")
                let formtoken = $(res.data).find("input[name='form_token']").val()
                if ($("#course").val() != "" && formtoken != "") {
                    let coursearr = $("#course").val().split("\n");
                    let mssv = $("#name").val()
                    let data = makeCourseParram(coursearr, formtoken, mssv);
                    axios({
                        method: 'get',
                        url: 'https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        data: data
                    }
                    ).then(res => {
                        if (res.status == 302) {
                            appendnof("thành công sau " + count + "lần");
                            count = 0;
                        }
                    }).catch(err => {
                        if (err.response.status == 503)
                            appendnof("thất bại " + ++count + "lần");
                        else {
                            appendnof(" trang đăng kí chưa mở")
                            console.log(err);
                        }
                    });
                }
            }).catch(err => {
                appendnof("đăng nhập thất bại hoặc trang đăng kí chưa mở")
                console.log(err);
            });
        }
    });
});
// $("#course").keyup(function () {
//     $('#notify').empty();
//     $('#notify').append($(this).val());
//     console.log($(this).val());
//     let res = $(this).val().trim().split("\n");
//     let data = makeCourseParram(res, "yk62MkdN_pCwhLz3ounxzu1zuNjieKe7I4sc", 19520797);
//     console.log(data);
// })