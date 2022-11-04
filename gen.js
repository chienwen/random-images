const fs = require('fs');
const axios = require('axios');

const count = process.argv[2] || 100;
const outputDir = './images/';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.error("Genereate", count, "images in", outputDir);

const requests = [];
for (let i = 0; i < count; i++) {
  requests.push(axios({
    url: 'https://picsum.photos/1024/768',
    method: 'GET',
    responseType: 'stream'
  }).then(response => {
    const fileName = 'img_' + (new Date).toISOString().replace(/:/g, '-') + '_' + (Math.random() + '').substr(2, 4) + '.jpg';
    const writer = fs.createWriteStream(outputDir + fileName);
    console.error("Creating", outputDir + fileName);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }));
}

Promise.all(requests).then(() => {
  console.error("DONE");
});
