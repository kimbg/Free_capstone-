module.exports = {
    HTML : function() { 
        return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <script src = "jquery-3.6.0.min.js"></script>
        </head>
        <body>
            
            <div>
                <h1>게시글</h1>
                <div><img src = "http://placehold.it/300x300"></div>
                <h1 id = "like"></h1>
                <button id = "likebtn">좋아요</button>
            </div>
        
        
        
            <script type = "text/javascript">
        
                var likes = 10;
        
                $(function() {
        
                    $("#like").html(likes);
                    $('#likebtn').click(function() {
                        likes++;
                        $("#like").html(likes);
                    });
                })
            </script>
        </body>
        </html>`;
    }
}