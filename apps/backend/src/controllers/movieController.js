import database from "../services/database.js";

const movieLists = async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const min_rating = parseFloat(req.query.min_rating);
    const category = req.query.category;

    const params = [];
    const conditions = [];

    if(min_rating < 0 || min_rating > 10){
        res.status(400).json({ "message": "Rating must be between 0 and 10" })
    }

    try {
        var sql = `SELECT m.*, g.name FROM movies m
                    JOIN movie_genres mg ON m.id = mg.movie_id
                    JOIN genres g ON mg.genre_id = g.id;`;
        
        // if(min_rating){
        //     conditions.push(' rating>=? ');
        //     params.push(min_rating);
        // }

        // if(category){
        //     conditions.push('category=? ');
        //     params.push(category);
        // }

        // if(conditions.length != 0){
        //     sql += ' WHERE ' + conditions.join(" AND ");
        // }

        // if(limit){
        //     sql +=  ' LIMIT ? ';
        //     params.push(limit);
        // }
        const [movies] = await database.query(sql, params);
    
        if(movies){
            res.status(200).json(movies)
        } else {
            res.status(404).send({ "message": "No movies found" })
        }
    } catch (err) {
        // console.log(err)
        res.status(500).send({"message": "An error has occurred"})
    }

};

export { movieLists };
