const {
    Client,
    GatewayIntentBits,
    AttachmentBuilder,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

const { createCanvas } = require("canvas");

const TOKEN = "a6cbb42551ac51e7d786aae1256f5dee2c2a0163dd72d39abd283511574f5402";
const CLIENT_ID = "1512933893165154486";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "pfp") {

        const text = interaction.options.getString("text");
        const color1 = interaction.options.getString("farbe1");
        const color2 = interaction.options.getString("farbe2");
        const glow = interaction.options.getBoolean("glow");

        const letter = text.charAt(0).toUpperCase();

        const canvas = createCanvas(1024, 1024);
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(
            0,
            0,
            1024,
            1024
        );

        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.fillStyle = "#000000";

        ctx.beginPath();
        ctx.arc(512, 512, 450, 0, Math.PI * 2);
        ctx.fill();

        if (glow) {
            ctx.shadowBlur = 60;
            ctx.shadowColor = "#ffffff";
        }

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 18;

        ctx.font = "700 520px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeText(letter, 512, 540);

        const buffer = canvas.toBuffer("image/png");

        const attachment = new AttachmentBuilder(buffer, {
            name: "logo.png"
        });

        await interaction.reply({
            files: [attachment]
        });
    }
});

client.login(TOKEN);

(async () => {

    const commands = [
        new SlashCommandBuilder()
            .setName("pfp")
            .setDescription("Erstellt ein Logo")
            .addStringOption(option =>
                option
                    .setName("text")
                    .setDescription("Name oder Buchstabe")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("farbe1")
                    .setDescription("z.B. #ff00ff")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("farbe2")
                    .setDescription("z.B. #00ffff")
                    .setRequired(true)
            )
            .addBooleanOption(option =>
                option
                    .setName("glow")
                    .setDescription("Glow aktivieren")
                    .setRequired(true)
            )
            .toJSON()
    ];

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands
            }
        );

        console.log("Slash Commands registriert");
    } catch (err) {
        console.error(err);
    }

})();