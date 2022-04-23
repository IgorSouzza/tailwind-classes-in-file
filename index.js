import got from 'got';
import fs from 'fs';
import readline from 'readline';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchAndGenerate() {
  readlineInterface.question('What is the CSS property to get in tailwindcss.com? ', async (property) => {
    const finalObject = [];
    const response = await got(`https://tailwindcss.com/docs/${property}`);
    const dom = new JSDOM(response.body);
    const tableBody = dom.window.document.querySelector('tbody');

    tableBody.childNodes.forEach(element => {
      const value = element.firstChild.textContent;
      const label = element.firstChild.textContent.replace('-', ' ');
      finalObject.push({ value, label  });
    });

    fs.writeFileSync(`properties/${property}.txt`, JSON.stringify(finalObject));
    readlineInterface.close();
  });
};

fetchAndGenerate();
