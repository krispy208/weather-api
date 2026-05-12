import readline from "node:readline";
import 'dotenv/config';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Enter a city code to get its weather: `, async (cityCode) => {
  try {
    const date = new Date().toISOString()
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode.trim()}/${date}?key=${process.env.WEATHER_API_KEY}&include=days&elements=tempmax,tempmin,temp`);
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    const { tempmax, tempmin, temp } = data.days[0]
    console.log(`The current tempature is ${temp}F`);
    console.log(`Today's maximum tempature is ${tempmax}F`)
    console.log(`Today's minimum tempature is ${tempmin}F\n`)
    rl.setPrompt("Enter another city code or done to exit: ");
    rl.setPrompt("Enter another city code or done to exit: ");
    rl.prompt();
    rl.on("line", async (cityCode) => {
      if (cityCode.trim() === 'done') {
        rl.close();
      }
      else {
        const date = new Date().toISOString()
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode.trim()}/${date}?key=${process.env.WEATHER_API_KEY}&include=days&elements=tempmax,tempmin,temp`);
        
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        const { tempmax, tempmin, temp } = data.days[0]
        console.log(`The current tempature is ${temp}F`);
        console.log(`Today's maximum tempature is ${tempmax}F`)
        console.log(`Today's minimum tempature is ${tempmin}F\n`)
        rl.setPrompt("Enter another city code or done to exit: ");
        rl.prompt();
      }
    });
    }
  catch (err) {
    console.error(`Invalid input`)
    rl.close()
  }
});