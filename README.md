# Customers Party Invite

## Description
Invite customers who live within 100km radius of a specific company to a party

## Setup
1. Make sure you have docker installed on your machine
2. Clone the repository
3. Create a `.env` file in the root of the repository
4. Create a db foler in the root of the repository
5. Add customers.txt file in the db folder
6. Copy the contents of `.env.examples` in the root of the repository into your `.env` file
7. Run `npm install` to install the dependencies
7. Start rabbitmq server with the `up` command in the `package.json`
8. Start the program with `start` script
9. Start the consumer with the `start:consumer` command in the `package.json`

## Environment Requirements:
- node => 16.13.1 or higher.
- npm => 9.1.2 or higher
- typescript => 4.9.3 or higher

### Credit
- Mbonu Basil

