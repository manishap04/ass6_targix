Environment variables and .env support

You can configure database and server settings via environment variables. The application reads these variables and falls back to sensible defaults if they are not set:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SERVER_PORT`

For local development you should create a `.env` file in the project root (make sure to add it to `.gitignore`). Do not commit secrets — instead commit an `.env.example` with placeholders so other developers know what variables are required. The application will load `.env` automatically at startup but will not override existing OS-level environment variables or system properties.

Example `.env.example` (commit this to repo, but keep `.env` secret):

```
DB_URL=jdbc:mysql://localhost:3306/productdb
DB_USERNAME=your_username_here
DB_PASSWORD=your_password_here
SERVER_PORT=3000
```

To apply changes after editing `.env` or environment variables, rebuild and run the application (e.g., `mvn spring-boot:run` or `mvn -DskipTests package`).
