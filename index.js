const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tval,oval) =>{
    let temp = tval.replace("{%tempval%}",oval.main.temp-273.15);
    temp = temp.replace("{%tempmin%}",oval.main.temp_min-273.15);
    temp = temp.replace("{%tempmax%}",oval.main.temp_max-273.15);
    temp = temp.replace("{%location%}",oval.name);
    temp = temp.replace("{%country%}",oval.sys.country);
    temp = temp.replace("{%status%}",oval.weather[0].main);
    return temp;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?lat=20.2602964&lon=85.8394521&appid=c0a97f5097c1bcd61b20cec4be6e875a')
            .on('data', (chunk) => {
                const arrData = [JSON.parse(chunk)]
                const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
    else{
        res.end("File not found.");
    }
})

server.listen(8000,"127.0.0.1");