const { App } = require("@slack/bolt");
const { respondToSslCheck } = require("@slack/bolt/dist/receivers/ExpressReceiver");
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
        await say (`Let's play a quiz <@${command.user_name}>!`);
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
};
async function answer_correct(ack, say, respond)
{
    await ack();
    await respond({
        replace_original: true,
        text: "Congratulation, That's the correct answer!"
    });
    quiz_score++;
    quiz_quiestions++;
    quiz_question(ack, say);
};
async function answer_wrong(ack, say, respond)
{
    await ack();
    await respond({
        replace_original: true,
        text: "Sorry, that's the wrong answer"
    });
    quiz_quiestions++;
    quiz_question(ack, say);
};
async function quiz_question(ack, say)
{
    await ack();
    if (quiz_quiestions >= 5) { quiz_complete = true };
    if (quiz_complete == false)
    {
        let rnd = Math.floor(Math.random() * 2);
        if (rnd === 0) {question_button(ack, say);}
        else if (rnd === 1) {question_radio(ack, say);}
    }
    else {
        await say("Quiz is complete, score: " + quiz_score + "/5");
        quiz_reset();
    }
};

async function question_button(ack, say)
{
    await ack();
        await say({"blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Click answer 2"
                }
            }
        ]})
        await say({"blocks": [
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
};

async function question_radio(ack, say)
{
    await ack();
        await say({"blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Click answer 2"
                }
            }
        ]})
        await say({"blocks": [
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "radio_buttons",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Answer 1",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Answer 2",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Answer 3",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "radio_submit"
                    }
                ]
            },
        ]});
};

app.action('radio_submit', async ({action, ack, say, respond}) => {
    await ack();
    if (action.selected_option.value === "value-1") {
        answer_correct(ack, say, respond);
    }
    else {
        answer_wrong(ack, say, respond);
    }
});

app.action('button_incorrect', async ({ack, say, respond}) => {
    answer_wrong(ack, say, respond);
});

app.action('button_correct', async ({ack, say, respond}) => {
    answer_correct(ack, say, respond);
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