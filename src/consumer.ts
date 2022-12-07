import config from '../config'
const amqplib = require('amqplib');
const opt = { credentials: require('amqplib').credentials.plain(config.AMQP_USERNAME, config.AMQP_PASSWORD) };

const connectionChannel = async () => {
    const connection = await amqplib.connect(config.AMQP_URL, opt, "heartbeat=60");
    const channel = await connection.createChannel();
    try {
        channel.consume('attendees', (message: any) => {
            const customerId = message.content.toString();
            if (typeof customerId === "string") {
                console.log(`Invite sent to customer with id: ${customerId}`)
                channel.ack(message);
            }
        })
    } catch (error) {
        throw error
    }
}
connectionChannel();