import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export async function loadCommands(commands) {
    const commandsPath = path.join(dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = `${commandsPath}/${file}`;
        const fileUrl = pathToFileURL(filePath);
        const command = (await import(fileUrl)).default;

        if ('data' in command && 'execute' in command) {
            if (Array.isArray(commands)) {
                commands.push(command.data.toJSON());
            } else {
                commands.set(command.data.name, command);
            }
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

export async function loadEvents(client) {
    const eventsPath = path.join(dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = `${eventsPath}/${file}`;
        const fileUrl = pathToFileURL(filePath);
        const event = (await import(fileUrl)).default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
