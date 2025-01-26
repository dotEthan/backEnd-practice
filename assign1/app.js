const http = require('http')
const server = http.createServer((req, res) => {
    if ( req.url === '/') {

        res.setHeader('Content-Type', 'text/html');
        res.write('<html>')
        res.write('<head><title>new title</title></head>')
        res.write('<body><h1>Welcome</h1></body>')
        res.write('<body><form action="/create-user" method="POST"><input name="formMessage" type="text"><button type="submit">Add User</button></form></body>')
        res.write('</html>')
        res.end();
    }
    if ( req.url === '/users') {
        
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>')
        res.write('<head><title>new title</title></head>')
        res.write('<body><ul><li>User1</li></ul></body>')
        res.write('</html>')
        res.end();
    }
    if ( req.url === '/create-user') {
        const body = [];
        req.on('data', (chunk)=> {
            body.push(chunk);
        })
        req.on('end', () => {
            const data = Buffer.concat(body).toString();
            const msg = data.split('=')[1];
            console.log(msg);
        })
        res.end();
    }
})
server.listen(3000);