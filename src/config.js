module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DB_URL || "postgresql://Metty:mettypass@localhost/daily-thoughts-capstone",
    JWT_SECRET: process.env.JWT_SECRET || 'lulu-is-soft',
}
