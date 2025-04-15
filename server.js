const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  
  // If path ends with '/', append 'index.html'
  if (pathname === './') {
    pathname = './index.html';
  }

  // Get the extension of the file
  const ext = path.parse(pathname).ext;

  // Map file extension to content type
  const contentTypeMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };

  // Set the content type based on file extension
  const contentType = contentTypeMap[ext] || 'text/plain';

  // Read the file
  fs.readFile(pathname, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        fs.readFile('./index.html', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }
      // Server error
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
      return;
    }
    // Success - return the file
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});