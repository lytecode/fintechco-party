import dotenv from 'dotenv'
dotenv.config()

export default {
    AMQP_URL: process.env.AMQP_URL,
    AMQP_USERNAME: process.env.AMQP_USERNAME,
    AMQP_PASSWORD: process.env.AMQP_PASSWORD,
}