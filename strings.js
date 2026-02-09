//string :- it is a sequence of characters used to represent text
let str="hello alakh";
//its types

console.log(str.length);  //length of string  //prints the length of the string 'str' to the console

console.log(str.toUpperCase());  //convert to uppercase  //prints the uppercase version of the string 'str' to the console

console.log(str.toLowerCase());  //convert to lowercase  //prints the lowercase version of the string 'str' to the console

let result=str.split(" ");  //split string into array  //splits the string 'str' into an array of substrings based on spaces and stores it in 'result'
console.log(result);  //prints the array 'result' to the console

console.log(str.charAt(0));  //character at index 0  //prints the character at index 0 of the string 'str' to the console
console.log(str.charAt(4));  //character at index 4  //prints the character at index 4 of the string 'str' to the console


let result1=str.trim();  //remove whitespace  //removes any leading or trailing whitespace from the string 'str' and stores it in 'result1'
console.log(result1);  //prints the trimmed string 'result1' to the console
console.log(result1.length);  //length after trim  //prints the length of the trimmed string 'result1' to the console

console.log(str.replace("alakh","ALAKH"));  //replace substring  //replaces the substring "alakh" with "ALAKH" in the string 'str' and prints the result to the console
console.log(str.includes("hello"));  //check substring  //checks if the substring "hello" is present in the string 'str' and prints the result (true/false) to the console
console.log(str.indexOf("o"));  //index of character  //prints the index of the first occurrence of the character "o" in the string 'str' to the console
console.log(str.lastIndexOf("l"));  //last index of character  //prints the index of the last occurrence of the character "l" in the string 'str' to the console
console.log(str.concat(" Welcome!"));  //concatenate strings  //concatenates the string " Welcome!" to the end of the string 'str' and prints the result to the console
console.log(str.startsWith("h"));  //check start  //checks if the string 'str' starts with the character "h" and prints the result (true/false) to the console
console.log(str.endsWith("n"));  //check end  //checks if the string 'str' ends with the character "n" and prints the result (true/false) to the console
console.log(str.replaceAll("l","L"));  //replace all occurrences  //replaces all occurrences of the character "l" with "L" in the string 'str' and prints the result to the console
//practice
let stri="IssAmssAmAn";
let res=stri.replace(/ss/g," ").toUpperCase();
console.log(res);

let string="";
for (let i=0;i<res.length;i++){
    if(i%2 !==0){
        string+=res[i].toUpperCase();
    }
    else{
        string+=res[i].toLowerCase();
    }

}
console.log(string);