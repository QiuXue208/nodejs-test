var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var queryString = ''
  if(path.indexOf('?') >= 0){
     queryString = path.substring(path.indexOf('?'))
  }
  var pathNoQuery = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('HTTP 路径为\n' + path)
  if(path === '/'){
      var string = fs.readFileSync('./index.html','utf8')
      var amount = fs.readFileSync('./db_price','utf8') //amount的类型是string
      string = string.replace('&&&amount&&&',amount)
      response.setHeader('Content-Type','text/html;charset=utf-8')
      response.write(string)
      response.end()
  }else if(path === '/style.css'){
      var string = fs.readFileSync('./style.css','utf8')
    response.setHeader('Content-Type','text/css')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){
    var string = fs.readFileSync('./main.js','utf8')
    response.setHeader('Content-Type','application/javascript')
    response.write(string)
    response.end()
  }else if(path === '/pay'){
    var amount = fs.readFileSync('./db_price','utf8')//100
    var newAmount = parseInt(amount) - 1
    response.setHeader('Content-Type','application/javascript')
    if(Math.random() > 0.5){
      fs.writeFileSync('./db_price',newAmount)
      response.statusCode = 200 //成功
      response.write(`
      ${query.callback}.call(undefined,'success') 
      `)//会被当做JS处理
    }else{
      response.statusCode = 400 //失败
      response.write(`付款失败`)//会被当做JS处理
    }
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.write('找不到对应路径')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
  console.log(method + ' ' +request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)