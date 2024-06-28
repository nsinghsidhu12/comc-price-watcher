import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function loadCommands(commands) {
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    const commandsPath = path.join(dirname, '../commands');
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

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
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}
