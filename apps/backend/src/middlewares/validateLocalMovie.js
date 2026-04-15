import { body } from "express-validator";
import { handleValidationErrors } from "./handleValidationErrors.js";

export const validateLocalMovieCreation = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 characters long"),
    body("overview").notEmpty().withMessage("Overview is required"),
    body("poster_url")
        .optional()
        .isURL()
        .withMessage("Poster URL must be valid"),
    body("backdrop_url")
        .optional()
        .isURL()
        .withMessage("Backdrop URL must be valid"),
    body("release_date")
        .optional()
        .isDate()
        .withMessage("Release date must be a valid date"),
    body("vote_average")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Vote average must be a number between 0 and 10"),
    body("genre_ids")
        .optional()
        .isArray({ min: 0 })
        .withMessage("Genre IDs must be an array")
        .custom((value) => {
            if (!value.every(Number.isInteger)) {
                throw new Error("Each genre ID must be an integer");
            }
        }),
    handleValidationErrors,
];
