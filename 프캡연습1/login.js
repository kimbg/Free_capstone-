module.exports = {    
    html : function(data) {
        var i = 0;
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>${data}</h1>
            
        </body>
        </html>`;
    },
    list : function(data) {
        var list = '<ul>';
        
        for(var i = 0 ; i < data.length; i++)
        {
            list += `<li><a href = "/?id=${data[i].id}">${data[i].title}</a></li>`;
        }
        list += '<ul>';
        return list;
    }
}