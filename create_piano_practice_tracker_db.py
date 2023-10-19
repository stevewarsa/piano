import sqlite3, os
pathOfDb = "c:/backup/code/react-apps/piano-practice-tracking/pianopracticetracker.sqlite"
if os.path.exists(pathOfDb):
    os.remove(pathOfDb)
connection = sqlite3.connect(pathOfDb)
cursor = connection.cursor()

CREATE = "CREATE TABLE PIANO_PRACTICE (START_DATE_TIME_LONG INTEGER PRIMARY KEY NOT NULL, START_DATE_TIME_STR TEXT NOT NULL, END_DATE_TIME_LONG INTEGER NOT NULL, END_DATE_TIME_STR TEXT NOT NULL, DURATION INTEGER NOT NULL, PRACTICE_LOCATION TEXT NOT NULL, LESSON_CONTENT TEXT NOT NULL, NOTES TEXT NOT NULL);"
cursor.execute(CREATE)
cursor.close()
connection.close()




