const authConfig = {
    secret: process.env.JWT_SECRET,
    secret_expires_in: process.env.JWT_EXPIRES_IN || "60m", 
    refresh_secret: process.env.JWT_REFRESH_SECRET, 
    refresh_secret_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
}

export default authConfig;
