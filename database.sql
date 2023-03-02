create TABLE "users"(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) unique,
    password VARCHAR(255),
    email VARCHAR(255) unique,
    accessToken VARCHAR(255),
    refreshToken VARCHAR(255),
    salt VARCHAR(255),
    checkersColor VARCHAR(255)
);

create TABLE "cell"(
    number VARCHAR(255),
    onclick boolean,
    dame VARCHAR(255),
    color VARCHAR(255),
    markMove boolean
);