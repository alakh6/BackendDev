const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname , 'input.txt');
const outputFile = path.join(__dirname , 'output.txt');

fs.readFile(inputFile , 'utf-8' , (err , data) => {
    if (err){
        console.error('Error occured in reading the file:', err.message);
        return;
    }
    const words = data.trim().split(/\s+/);
    const count = words.length;

    fs.writeFile(outputFile , `Word Count: ${count}` , (err) => {
        if (err){
            console.error('Error occired in writing the file:', err.message);
            return;
        }
        console.log('Word count in output.txt');
    });
});