import http from "node:http";
import 'dotenv/config';

const server = http.createServer( async (req, res) => {
  
  if (req.url === '/api' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end();
  }
  else if (req.url.startsWith('/api/weather') && req.method === 'GET') {
    try {
      const cityCode = req.url.split('/').pop();
      const date = new Date().toISOString();
      const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode.trim()}/${date}?key=${process.env.WEATHER_API_KEY}&include=days&elements=tempmax,tempmin,temp`);

      if (!response.ok) {
        if (response.status === 400) {
          res.statusCode = 400;
          throw new Error("Invalid city code, please enter a valid city code.");
        }
        else if (response.status === 500) {
          res.statusCode = 500;
          throw new Error("An internal server error occurred");
        }
        res.statusCode = 500;
        throw new Error(`An error occurred. Please try again later.`);
      }
      const data = await response.json();
      const { tempmax, tempmin, temp } = data.days[0];
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      const tempatureData = {
        tempMax: tempmax,
        tempMin: tempmin,
        temp,
        date,
      };
      res.end(JSON.stringify(tempatureData));
    }
    catch (err) {
      res.end(JSON.stringify({
        message: err.message
      }))
    }
    
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({
      message: 'The requested route does not exist'
    }));
  }
  
});

server.listen(3000, 'localhost', () => {
  console.log(`Listening for requests on PORT 3000`)
});

