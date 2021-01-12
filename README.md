# ID Assignment 2
## Chow
This website's purpose is to let users store recipes and edit them.
Additionally, users can look at the nutritional values of the recipe's ingredients.
I had the idea to make this website because I was interested in meal-prep.
Hence, I hoped that by being able to see the different nutrients and their amounts present in a recipe, users will be able to make wiser decisions regarding their food.

## Design
The design was fairly simple, I went with a matcha green and dark grey colour scheme.
The grey is easy on the eyes and the green adds more 'pop' to the website.
To me, green also symbolises health, and that was one of the goals of the website too.

## Technologies used
1. HTML
    - The mark-up language used to structure content
2. SASS
    - A CSS preprocessor used to style HTML content. I used SASS as it was neater and more compact than CSS, hence easier to work with.
3. Adobe Xd
    - The tool I used to make wireframes for the website
4. Visual Studio Code
    - VS Code is the code editor I wrote HTML, SASS, JS, and the Readme file in. Plugins such as live server helped speed up the development process for me.
5. Git & Github
    - Git is a version control system and Github is where I hosted the files for the website. I used Git Bash in VS Code to add, commit and push files to this Github repository, which was quite convenient.
6. jQuery
    - For easier manipulation of the DOM
7. Supabase
    - Supabase is an open-source alternative to Google's firebase. It uses an SQL database and Netlify's Gotrue library for authentication.
8. Netlify
    - Netlify is a platform for hosting static websites, and I have found it to be wayyy faster than Github pages. Additionally, they provide serverless functions, similar to AWS Lambda. I used the serverless functions to communicate with the database and API, without exposing secrets.
9. Calorie Ninjas
    - This is the API I used for retrieving nutritional information of ingredients.
## Resources
1. [W3Schools](https://w3schools.com)
    - I used this website to learn more about HTML, CSS and JS. The code I used for the navigation bar is from [here](https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp) too.
2. [CSS Tricks](https://css-tricks.com/)
    - I learnt CSS from this website.
3. [Stack Overflow](https://stackoverflow.com/)
    - Which developer doesn't use Stack Overflow? I found solutions to various bugs through this website

## What I learned
Through this assignment, I have learnt some things:
1. Event listeners
    - I learnt that event listeners should NOT be nested, and I learnt that the hard way - whenever I added or updated a recipe, a few more were created!
2. Serverless functions
    - I was interested in the JAMStack before, and I finally got to use it for this assignment. Although daunting at first, it wasn't really as hard as I imagined it to be. I tried Vercel's serverless functions first, but they didn't work, so I switched to Netlifty and it did the job.
3. Database
    - I learnt how to connect my front-end website to a database at the back-end. I had a lot of trouble with FaunaDB at first, even though it seemed cool - it uses multiple database paradigms. It was slower and more complex than Supabase, so I eventually used Supabase instead.
4. GraphQL
    - Although I didn't use GraphQL to query Supabase's database, I learnt some of it while trying out FaunaDB, and it has some advantages over the usual REST, because it only has one endpoint and you request only for the data you need, which is more efficient at times.
