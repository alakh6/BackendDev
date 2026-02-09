import fs from 'fs';


function loginPage(email, password) {
    try {
        if (fs.existsSync("todo.json")) {
            let data = JSON.parse(fs.readFileSync("todo.json", "utf-8"));
            let user = data.some((value) => value.email === email && value.password === password);
            if (user) {
                console.log("Login successful");
                return user;
            } else {
                console.log("Invalid email or password");
                return null;
            }
        }

    } catch (err) {
        console.log("Error in login", err);
    }
}

export default loginPage;