import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "../database.js";

export async function createUser(req, res){
    const { name, email, hashedPassword } = req.body;

    try{
        const [result] = await database.query(
            "INSERT INTO users (name, email, password) VALUES (?,?,?)", 
            [name, email, hashedPassword]
        );

        if(result){
            res.status(201).json({
                'message': 'User created successfully',
                'id': result.insertId
            });
        }
    } catch (err) { 
        console.error(err);
        res.sendStatus(500);
    }
}

export async function login(req, res){
    const { email, password } = req.body;

    try{
        //check email
        const [users] = await database.query(
            "SELECT * FROM users WHERE email =?", 
            [email]
        );

        if(users.length === 0){
            return res.status(401).send({
                "message": "Wrong credentials1"
            });
        }

        const user = users[0];

        //check le mdp
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
             return res.status(401).send({
                "message": "Wrong credentials2"
            });
        }

        //generer le jwt
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.status(200).json({
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            "message": "an error has occured"
        })
    }
}
