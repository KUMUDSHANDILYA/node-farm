const fs = require('fs');
const http = require('http');
const url = require('url');


const replaceTemplate = require('./modules/ReplaceTemplate');

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Bolocking, Synchronous Way
/*const txtIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(txtIn);
const txtOut = `This is what we know about avacado ${txtIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', txtOut);
console.log('File written');

const hello = "Hello World";
console.log(hello);

//Non-blocking, Asynchronous Way
fs.readFile('./txt/yyystart.txt','utf-8', (err, data1) => {

  if(err) return console.log("Error!!");

  fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt','utf-8', (err, data3) => {
      console.log(data3);
      fs.writeFile('./txt/final.txt', `${data1}\n${data2}\n${data3}\n` , 'utf-8', (err) => {
        console.log("Your file has been written");
      })
  });
  });
});


console.log("Will read file");*/

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

//Server



const templateCard = fs.readFileSync('./templates/templateCard.html', 'utf-8');
const templateOverview = fs.readFileSync('./templates/templateOverview.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/templateProduct.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
  const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //const pathname = req.url;

  //console.log(req.url);
  const {query, pathname} = url.parse(req.url, true);

  //Overview page
  if(pathname === '/' || pathname === '/overview'){
    res.writeHead(200, {
      'content-type': 'text/html'
    });

    const cardsHTML = dataObj.map(el => {
      return replaceTemplate(templateCard, el);
    }).join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

    res.end(output);
  }

  //product page
  else if(pathname === '/product'){

    res.writeHead(200, {
      'content-type': 'text/html'
    });

    const product = dataObj[query.id];

    const output = replaceTemplate(templateProduct, product);
    res.end(output);
    //console.log(query);
  }

  //api page
  else if(pathname === '/api'){

      //console.log(productData);
      res.writeHead(200, {
        'content-type': 'application/json'
      });
      res.end(data);
    }

//error page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>This page could not be found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log("Listening to request on port 8000");
});
