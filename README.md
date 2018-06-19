# WDYWTE
What do you want to eat?


Project created to better understand API's (Google Places API), cookies and sessions.

Backend: Built using Express.js on top of Node.js server , orignially used Mocha for testing, but later it was removed from project.

Frontend: Tamplate driven using HandlebarsJS and Bootstrap 3

Work in progress, may never be finished, working on it in my spare time.

Project flaws:
Callback hell, many one-of callbacks that make the backend more confusing than it should be. It could use some refactoring, best option is to round them all up into one utility class.

Hack-y workarounds, If documentation was not at all too descriptive, hacking ensued. A good chunk of the code could be more optimised and rewritten to be more readable and funcional. Option 1, rewrite the code entirely. Option 2, leave it be.

No real error handling, my code doesn't take into account invalid character input, any error handling outside of callbacks and random if statements. Obviously more error handling is required, currently some buttons crash the app, and more!

There's probably more, but overall the main purpose of the project was served, to make this project a real service, obviously requires much more time and consideration.


Live app (current version) deployed on Heroku: https://letsgetfood.herokuapp.com/
