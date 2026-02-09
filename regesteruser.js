import fs from "fs";

function loginUser(name,password){
    try{
        if(fs.existsSync("todo.json")){
            let data = JSON.parse(fs.readFileSync("todo.json","utf-8"));
            let user = data.forEach((value)=> { 
                if(value.name===name && value.password===password){
                     return "Login Successfull";
                }
                else if(value.name!==name){
                    return "name is invalid";
                }
                else if(value.password!==password){
                    return "password invalid";
                
                }
                   
            });
        }
    }
    catch(error){
        
        console.log(error);
    }

}  
