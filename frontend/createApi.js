const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

function fetchAndProcessOpenAPISpec() {
  const specUrl = 'http://127.0.0.1:8011/openapi.json';
  const specFilePath = './openapi_spec.json';
  const outputDir = 'src/api';

  // Step 1: Get the OpenAPI spec from localhost:8011/openapi.json
  http.get(specUrl, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Request Failed. Status Code: ${res.statusCode}`);
      res.resume(); // Consume response data to free up memory
      return;
    }

    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        // Step 2: Save it to ./openapi_spec.json
        fs.writeFileSync(specFilePath, rawData);

        // Step 3: Run
        exec(`openapi --input ${specFilePath} --output ${outputDir}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);

          // Step 4: Delete the ./openapi_spec.json file
          fs.unlinkSync(specFilePath);
          console.log('OpenAPI spec file deleted.');
        });
      } catch (e) {
        console.error(`Could not write OpenAPI spec to file: ${e}`);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

// Run the function
fetchAndProcessOpenAPISpec();