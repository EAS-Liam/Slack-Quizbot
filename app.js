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

const mysql = require('mysql');
const con = mysql.createConnection({
    host: "host.docker.internal",
    user: "root",
    password: process.env.SQLPASS,
    database: "Quizbot"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
    // con.query("SELECT * FROM questions", function (err, result, fields) {
    //     if (err) throw err;
    //     sql_RAWResult = result;
    // });
});

app.command("/quiz", async ({ command, ack, say }) => {
    try {
        await ack();
        await say (`Let's play a quiz <@${command.user_name}>!`);
        current_user_name = command.user_name;

        con.query("SELECT * FROM questions", function (err, result, fields) {
            if (err) throw err;
            sql_RAWResult = result;
        });
        con.query("SELECT COUNT(*) AS count FROM questions", function (err, result) {
            if (err) throw err;
            question_count = result[0].count;
            //console.log(question_count);
        });

        quiz_question(ack, say);
        
    } catch (error) {
        console.log("error")
        console.error(error);
    }
});

var current_user_name;
var sql_RAWResult;
var sql_Result;
var quiz_complete = false;
var question_count = 0;
var current_question = 0;
var quiz_quiestions = 0;
var quiz_length = 5;
var quiz_score = 0;

function quiz_reset()
{
    quiz_complete = false;
    current_question = 0;
    quiz_quiestions = 0;
    quiz_score = 0; 
};

async function quiz_question(ack, say)
{
    await ack();
    if (quiz_quiestions >= quiz_length) { quiz_complete = true };
    if (quiz_complete == false)
    {
        current_question = Math.floor(Math.random() * question_count);
        await say("Question " + (quiz_quiestions+1) + ":");
        if (current_question < 10){
            await say("In the terminal which command is used to");
        }
        else if (current_question < 15){
            await say("Which command represents the specified directory")
        }
        else if (current_question < 20){
            await say("Select the command that performs the function in a file")
        }
        else if (current_question < 30){
            await say("Select the command that performs the function in a vi session")
        }
        question_radio(ack, say);
    }
    else {
        await say("Quiz is complete, score: " + quiz_score + "/" + quiz_length);

        save_score(ack, say);
    }
};

async function question_radio(ack, say)
{
    await ack();
        await say({"blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": (sql_RAWResult[current_question].question + ":")
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
                                    "text": sql_RAWResult[current_question].ans_1,
                                    "emoji": true
                                },
                                "value": "1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": sql_RAWResult[current_question].ans_2,
                                    "emoji": true
                                },
                                "value": "2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": sql_RAWResult[current_question].ans_3,
                                    "emoji": true
                                },
                                "value": "3"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": sql_RAWResult[current_question].ans_4,
                                    "emoji": true
                                },
                                "value": "4"
                            },
                        ],
                        "action_id": "radio_submit"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": " "
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Quit Quiz",
                        "emoji": true
                    },
                    "value": "quit",
                    "action_id": "quit_quiz"
                }
            },
        ]});
};

app.action('radio_submit', async ({action, ack, say, respond}) => {
    await ack();
    if (parseInt(action.selected_option.value) === sql_RAWResult[current_question].correct_ans) {
        answer_correct(ack, say, respond);
    }
    else {
        answer_wrong(ack, say, respond);
    }
});

async function save_score(ack, say)
{
    await ack();
        await say({"blocks": [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Would you like to save your results?"
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
                            "text": "Yes",
                            "emoji": true
                        },
                        "value": "0",
                        "action_id": "save"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "No",
                            "emoji": true
                        },
                        "value": "1",
                        "action_id": "dont_save"
                    }
                ]
            }
        ]});
};

app.action('save', async ({action, ack, say, respond}) => {
    await ack();
    con.query(`INSERT INTO user_scores (user_name, quiz_score) VALUES ('${current_user_name}', ${quiz_score});`, function (err, result, fields) {
        if (err) throw err;
    });
    await respond({
        replace_original: true,
        text: "your score was saved to the database"
    });

    quiz_reset();
});

app.action('dont_save', async ({action, ack, say, respond}) => {
    await ack();
    await respond({
        replace_original: true,
        text: "Your score was not saved to the database"
    });

    quiz_reset();
});

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

app.action('quit_quiz', async ({action, ack, say, respond}) => {
    await ack();
    await respond({
        replace_original: true,
        text: "Quiz Quit, score will not be saved"
    });
    quiz_reset();
});

app.message(/^(hi|hello|hey|Hi|Hello|Hey).*/, async ({ message, say}) => {
    try {
        await say(`Hello <@${message.user}>, I am QuizBot, type /quiz to start a quiz`);
    } catch (error) {
        console.log("error")
        console.error(error);
    }
});

(async () => {
    const port = 3000
    // Start App
    await app.start(process.env.PORT || port);
    //console.log(`Slack Bolt app running on port ${port}!`);
})();