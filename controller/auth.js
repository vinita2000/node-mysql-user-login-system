const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async(req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;

        //if user doesnot enter any data
        if(!username || !password){
            return res.status(400).render('login', {
                message: 'Please enter Email and Password'
            })
        }
        //now match the details with the actual registered users from db
        db.query('SELECT * FROM users WHERE username=?', [username], async(error, results)=>{
            //if no username matches or password doesnot match
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password) )) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            }
            else{
                const id = results[0].id;
                //for cookies
                const token = jwt.sign({ id:id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log(token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 //converted to millisec
                    ),
                    //only allow to set cookie if on http browser
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");//redirect to home one everything fine
            }

        });
    } 
    catch (error) {
        console.log(error);
    }
}


exports.register = (req, res)=>{
    console.log(req.body);

    //storing the input data to variables
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    //querying into database 
    db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            //if the user with the email already exists we do not register him twice
            if(results.length > 0){
                return res.render('register', {
                    message: 'Email is already registered'
                });
            }
            else if(password != passwordConfirm){
                return res.render('register', {
                    message: 'Passwords do not match'
                })
            }
        }


        //encrypting the passwords
        //it takes time therefor using async(await)
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //insert the data to db
        db.query('INSERT INTO users SET ?', {name:name, email:email, username:username, password:hashedPassword}, (error, results)=>{
            if(error){
                console.log(error);
            }
            else{
                return res.render('register', {
                    message:'User registered'
                });
            }
        });

    });

}

exports.profile = (req, res)=>{
    console.log(req.body);
}