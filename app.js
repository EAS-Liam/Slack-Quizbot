const { App } = require("@slack/bolt");
require("dotenv").config();
// Initialise with bot tokens and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true, // Enables the use of socket mode requireing next token
    appToken: process.env.SOCKET_TOKEN
});

app.command("/quiz", async ({ command, ack, say }) => {
    try {
        await ack();
        await say (`Let's play a quiz <@${command.user_name}>!`)
        quiz_question(ack, say);
        
    } catch (error) {
        console.log("error")
        console.error(error);
    }
});

var quiz_complete = false;
var quiz_quiestions = 0;
var quiz_score = 0;

function quiz_reset()
{
    quiz_complete = false;
    quiz_quiestions = 0;
    quiz_score = 0; 
}
async function quiz_question(ack, say)
{
    await ack();
    if (quiz_quiestions >= 5) { quiz_complete = true };
    if (quiz_complete == false)
    {
        await say({"blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Click answer 2`
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Answer 1",
                            "emoji": true
                        },
                        "value": "0",
                        "action_id": "button_incorrect"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Answer 2",
                            "emoji": true
                        },
                        "value": "1",
                        "action_id": "button_correct"
                    }
                ]
            }
        ]});
    }
    else {
        await say("Quiz is complete, score: " + quiz_score + "/5");
        quiz_reset();
    }
}

app.action('button_incorrect', async ({ack, say}) => {
    await ack();
    await say("Sorry, that's the wrong answer");
    quiz_quiestions++;
    quiz_question(ack, say);
});

app.action('button_correct', async ({ack, say}) => {
    await ack();
    await say("Congratulations, that's correct!");
    quiz_quiestions++;
    quiz_score++;
    quiz_question(ack, say);

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

app.message(/^(hi|hello|hey|Hi|Hello|Hey).*/, async ({ message, say}) => {
    try {
        await say(`Hello <@${message.user}>, I am QuizBot`);
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