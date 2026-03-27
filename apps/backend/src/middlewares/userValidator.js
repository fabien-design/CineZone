import { body } from "express-validator";
import { handleValidationErrors } from "./handleValidationErrors.js";

export async function checkEmailNotTaken(req, res, next) {
 try {
    const { email } = req.body;

    const [users] = await database.query(
"SELECT id FROM users WHERE email = ?", [email]);

    if (users.length > 0) {
      return res.status(409).json({ error: "Email already used" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function hashPassword(req, res, next){
    try{
        const { password } = req.body

        req.body.hashedPassword = await bcrypt.hash(password, 12);

        delete req.body.password;

        next();
    } catch (err) {
        console.error(err),
        res.sendStatus(500);
    }
}

export const validateUser = [
  body("name")
    .notEmpty().withMessage("Le nom est requis")
    .isLength({ min: 2 }).withMessage("2 caractères minimum"),
  body("email")
    .notEmpty().withMessage("Email requis")
    .isEmail().withMessage("Format email invalide"),
  body("password")
    .notEmpty().withMessage("Mot de passe requis")
  . isLength({ min: 10 }).withMessage("10 caractères minimum"),
  handleValidationErrors
]; 
