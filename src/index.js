import readline from "node:readline";
import 'dotenv/config';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Enter a city code to get its weather: `, async (cityCode) => {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode.trim()}?key=${process.env.WEATHER_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
    rl.setPrompt("Enter another city code or done to exit: ");
    rl.prompt();
    rl.on("line", async (cityCode) => {
      if (cityCode.trim() === 'done') {
        rl.close();
      }
      else {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode.trim()}?key=${process.env.WEATHER_API_KEY}`);
        
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        rl.setPrompt("Enter another city code or done to exit: ");
        rl.prompt();
      }
    });
    }
  catch (err) {
    console.error(`Error: ${err}`)
  }
});