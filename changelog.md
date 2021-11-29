Liam - 17/11/21:
Created new Slack Bot.
Got got running on local server.
Implented /command and message response from bot.
Containereised bot app in docker image.

Liam - 18/11/21:
Impleneted new /Quiz command.
/Quiz asks user to play a quiz.
Impleneted simple question with "Answer" buttons are part of message.
Impleneted button response.
Impleneted basic score track (temporary).
Quiz now ends after 5 questions and gives user score.

Liam - 19/11/21:
Answer options removed once selected to prevent users from selecting answers again.
Implemented Radio Button multi-choice question option.
Quiz now chooses random question between button and radio button question options.

Liam - 22/11/21:
Setup basic quiz questions database.
Created 'questions' table with sample questions and answers.
Connected to local database with app.
Radio Button Questions and Answers now pulled from database.

Liam - 23/11/21:
Setup docker containerised database.
Replaced loacl database with containerised database in app.
Containerised app and linked app container with database container.

Liam - 25/11/21:
Updated database with actual questions for the quiz app.
Database updates with users name and their score to user_scores tabel on completing the quiz.
Added save option so user can choose to save or not save their quiz score to the database.

Liam - 26/11/21:
Implmented quiz quit functionality, quitting out of quiz and not saving score.
Updated database with more questions.
Updated database link for question grabbing to be more efficient (now only a single question is pulled from the database at random when the bot asks a question instead of pulling the entire tabel and choosing from that).

Liam 29/11/21:
Working on new development branch. Branch will be used for current unfinished or broken updates.
Working on Docker Compose file, currently creates the 2 images required but database persistance is not working so image volume link needs to be worked on.