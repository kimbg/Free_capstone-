var dlg = document.getElementById("myDlg");
function closeDlg()  //Dlg닫는 함수
{
    dlg.close();
    document.getElementsByClassName("forDlg").style.display = "none";
}


function AddItem(data) {

    return `<h1>Title</h1>
    <img src = "http://localhost:3000/image/${data[0].num}" class = "main_photo">  
    <div class = "content_end"> 
    <div>${data[0].comment}</div>  
    <button type = "button" class = "contentbt"><img src = "http://placehold.it/45x45"></button>    
    </div>  
    <div class = "forDlg">  
    <dialog id = "myDlg">   
    <a href = "#" onclick = "closeDlg()" id = "closebtn">X</a>  
    <div id = "screen"> 
    <div id = "screen_aside_left">  
    <img src = "http://placehold.it/100x100" id = "map">    
    </div>     
    <div id = "screen_aside_right"> 
    <div>경상남도 김해시 인제로 197</div>   
    <h4>인제대학교</h4> 
    </div> </div> </dialog> </div>  
    `
}

//동적으로 생성된 버튼에도 이벤트 부여 이 이벤트를 통해 Dlg를 띄울것
$(document).on('click', '.contentbt', function () {
    $(".forDlg").css("display", "block");
    dlg.showModal();
});

var swit = true;
//let i = 1; //이 코드는 db순서대로 가져오는코드
let backNum; //이 변수는 db뒤붙 가져오는 코드
$(function () {
    $.ajax({
        url : '/receiveDbLength',
        type : 'POST',
    })
    .done(function(data){
        backNum = data;
        console.log("가져온 db길이 : ",backNum);
    })
    .fail(function(data,textStatus,errorThrown) {
            console.log("fail ajax");
            console.log(errorThrown);
    })
    
    
    $('#wrap').scroll(function () {
        var scrollT = $(this).scrollTop(); //스크롤바의 상단위치
        var scrollH = $(this).height(); //스크롤바를 갖는 div의 높이
        var contentH = $('#content_bar').height(); //문서 전체 내용을 갖는 div의 높이
        if (scrollT + scrollH + 1 >= contentH && backNum > 0 && swit) // 스크롤바가 아래 쪽에 위치할 때
        {
            swit = false;
            $.ajax({
                url : '/sendajax',
                type : 'POST',
                data : {'num' : backNum},
            })
            .done(function(data) {
                if(data != 'noData'){
                    console.log('done부분의 data : ',data);
                    $('#content_bar').append(AddItem(data));            
                    swit = true;
                    backNum--;
                }
            })           
        }
    });
});
	//여기까지 추가내용 불러오기
