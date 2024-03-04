import dotenv from 'dotenv';

dotenv.config({"path" : "../.environment/.env"})
const VariabiliAmbiente = {
    "DBNAME" : process.env.DBNAME!,
    "PORTA" : +process.env.SERVER_PORT!,
    "STR_CONN" : process.env.MONGO_STR_CONN!,
    "DURATA_TOKEN" : +process.env.DURATA_TOKEN!,
    "ENCRYPTION_KEY" : process.env.ENCRYPTION_KEY!,
    "MAILUSER" : process.env.MAILUSER!,
    "MAILPWD" : process.env.MAILPWD!,
}

export default VariabiliAmbiente;