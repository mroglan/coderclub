declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FAUNA_SECRET_KEY: string;
            JWT_TOKEN_SIGNATURE: string;
            NEW_USER_PASSWORD: string;
        }
    }
}

export {}