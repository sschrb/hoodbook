let http = require("http"),
    fs = require("fs"),
    mime = require("mime");

/*
 * Erzeugt Liste mit Links zu allen Ordnern/Datein in gegebenem Pfad.
 */
function fileList(path){
    let list = fs.readdirSync(path)
    path = path.substring(1) + ((path[path.length - 1] === "/")? "" : "/");
    let str = "<ul>";
    for(let file of list){
        str += `<li><a href="${path+file}">${file}</a></li>`;
    }
    return str + "</ul>"

}

let server = http.createServer((req, res) => {
    if(req.method.toUpperCase() === "GET"){
        let path = `.${req.url}`;
        fs.stat(path, (err, stat) => {
            let status, 
                mimetype = "text/plain", 
                body = "";
            if(err){
                status = 404;
            }
            else{ 
                status = 200;
                if(stat.isDirectory()){
                    mimetype = "text/html";
                    body = fileList(path)
                }
                else if(stat.isFile()){
                    mimetype = mime.getType(path);
                    body = fs.readFileSync(path)
                }
            }
                res.writeHead(status, {"Content-Type" : mimetype});
                res.write(body);
                res.end();
        })
    }
    else{
        res.writeHead(405)
        res.end()
    }
})

server.listen(8000) // process.env.PORT