import config from '../config'
const amqplib = require('amqplib');
const opt = { credentials: require('amqplib').credentials.plain(config.AMQP_USERNAME, config.AMQP_PASSWORD) };
const { promises: fsPromises } = require('fs');

class Customers {
    async readCustomersFromFile() {
        const content = await fsPromises.readFile('./db/customers.txt', 'utf-8');
        const entries = content.split(/\r?\n/);

        const customers = entries.map((customer: string) => {
            const cust = customer
                .replace('id:', '')
                .replace('lat:', '')
                .replace('long:', '')
                .trimStart()
                .split(',')
            return { id: cust[0], lat: Number(cust[1]), long: Number(cust[2]) }
        })

        return customers
    }

    async calculateGreatDistance() {
        const r = 100; //in kilometers
        const lat = 52.493256, long = 13.446082;
        const customersDistance = [];

        const customers = await this.readCustomersFromFile();
        for (let customer of customers) {
            const distance = r * Math.acos(Math.cos(lat) * Math.cos(customer.lat) * Math.cos(long - customer.long) + Math.sin(lat) * Math.sin(customer.lat));
            customersDistance.push({ ...customer, distance });
        }
        return customersDistance;
    }

    async inivite() {
        const customers = await this.calculateGreatDistance();
        const invitees = [];
        for (let { id, distance } of customers) {
            if (Number.isNaN(distance)) {
                console.log(`Incomplete data for customer with id: ${id}`);
            }

            if (distance <= 100) {
                invitees.push(id)
            }
        }
        const sortInvitees = invitees.sort();

        sortInvitees.forEach(id => {
            this.producer("attendees", id)
        })
    }

    async producer(queue: string, msg: string) {
        const connection = await amqplib.connect(config.AMQP_URL, opt, "heartbeat=60");
        const channel = await connection.createChannel();
        try {
            await channel.assertQueue(queue, { durable: true });
            await channel.sendToQueue(queue, Buffer.from(msg));

            setTimeout(function () {
                channel.close();
                connection.close();
            }, 500);
        } catch (error) {
            console.log('ERROR => ', error);
        }
    }
}

const customers = new Customers();

export default customers;