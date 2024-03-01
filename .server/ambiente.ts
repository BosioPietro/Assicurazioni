import dotenv from 'dotenv';

dotenv.config({"path" : "../.environment/.env"})
const VariabiliAmbiente = {
    "DBNAME" : process.env.DBNAME!,
    "PORTA" : +process.env.SERVER_PORT!,
    "STR_CONN" : process.env.MONGO_STR_CONN!
}

export default VariabiliAmbiente;