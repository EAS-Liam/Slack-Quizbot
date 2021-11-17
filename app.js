const { App } = require("@slack/bolt");
require("dotenv").config();
// Initialise with bot tokens and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true, // Enables the use of socket mode requireing next token
    appToken: process.env.SOCKET_TOKEN
});

app.command("/test", async ({ command, ack, say }) => {
    try {
        await ack();
        say("Yaaay! updated command is working!");
    } catch (error) {
        console.log("error")
        console.error(error);
    }
});

app.message(/hello/, async ({ command, say}) => {
    try {
        say("Hello, I am QuizBot");
    } catch (error) {
        console.log("error")
        console.error(error);
    }
});

(async () => {
    const port = 3000
    // Start App
    await app.start(process.env.PORT || port);
    console.log(`Slack Bolt app running on port ${port}!`);
})();