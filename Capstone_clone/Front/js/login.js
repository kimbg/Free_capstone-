var loginbtn = document.getElementById("loginbt");
var memberjoinbt = document.getElementById("memberjoinbtn");
loginbtn.onmouseover = function () {
    loginbtn.style.fontWeight = "bold";
    loginbtn.style.fontSize = "1.1em";
}
loginbtn.onmouseout = function () {
    loginbtn.style.fontWeight = "normal";
    loginbtn.style.fontSize = "1em";
}
memberjoinbt.onmouseover = function () {
    memberjoinbt.style.fontWeight = "bold";
    memberjoinbt.style.fontSize = "1.1em";
}
memberjoinbt.onmouseout = function () {
    memberjoinbt.style.fontWeight = "normal";
    memberjoinbt.style.fontSize = "1em";
}




$(document).ready(function () {

    alert("jQuery동작중");
    var windowSize = window.innerWidth;
    window.onresize = function () {
        windowSize = window.innerWidth;
    }

    var windowSize = window.innerWidth;
    var login_window = document.getElementById("login");
    var join_window = document.getElementById("join_window");
    var find_id_window = document.getElementById("find_id_window");
    var find_pw_window = document.getElementById("find_pw_window")

    function reset() {
        login_window.style.marginLeft = "-200px";
        join_window.style.marginLeft = "-200px";
        find_id_window.style.marginLeft = "-200px";
        find_pw_window.style.marginLeft = "-200px";

        join_window.style.opacity = 0;
        find_id_window.style.opacity = 0;
        find_pw_window.style.opacity = 0;

        join_window.style.zIndex = 0;
        find_id_window.style.zIndex = 0;
        find_pw_window.style.zIndex = 0;
    }

    $("#joinhref, #find_id, #find_pw").click(function () {
        $("#row_2").removeClass("joinhref");
        $("#row_2").removeClass("find_id");
        $("#row_2").removeClass("find_pw");
        $("#row_2").addClass($(this).attr("id"));

        var currentSide = document.getElementById("row_2").classList[1];
        login_window.style.border = "1px solid black";
        reset();

        if (windowSize > 800) {
            login_window.style.marginLeft = "-400px";

            if (currentSide == "joinhref") {
                join_window.style.marginLeft = "0px";
                join_window.style.opacity = 1;
                join_window.style.zIndex = 1;
            }
            else if (currentSide == "find_id") {
                find_id_window.style.marginLeft = "0px";
                find_id_window.style.opacity = 1;
                find_id_window.style.zIndex = 1;
            }
            else if (currentSide == "find_pw") {
                find_pw_window.style.marginLeft = "0px";
                find_pw_window.style.opacity = 1;
                find_pw_window.style.zIndex = 1;
            }
        }
        else {
            if (currentSide == "joinhref") {
                join_window.style.opacity = 1;
                join_window.style.zIndex = 3;
            }
            else if (currentSide == "find_id") {
                find_id_window.style.opacity = 1;
                find_id_window.style.zIndex = 3;
            }
            else if (currentSide == "find_pw") {
                find_pw_window.style.opacity = 1;
                find_pw_window.style.zIndex = 3;
            }
        }

    });

    var closeBtn = $(".close");
    var memberjoinbt = $("#memberjoinbtn");
    closeBtn.click(function () {
        reset();        
    });
    memberjoinbt.click(function() {
        reset();
    })    
});