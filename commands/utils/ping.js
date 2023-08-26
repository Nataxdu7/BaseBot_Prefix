module.exports = {
    name: 'ping',
    description: 'Répondre avec Pong!',
    execute(message, args) {
        message.channel.send(`Ma latence est de \`${message.client.ws.ping}ms\` !`);
    },
};