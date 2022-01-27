# TinyApp

## Clients Order

> As an avid twitter poster,
> I want to be able to shorten links
> so that I can fit more non-link text in my tweets.

> As a twitter reader,
> I want to be able to visit sites via shortened links,
> so that I can read interesting content.

## Products

1. Home page

- Lists all short URL
  ![Home](/images/index.png)

2. Register page

- New User make account
  ![Register](/images/register.png)

3. Login page

- User login page
  ![Login](/images/login.png)

4. Create New URL page

- Create new short URL
  ![New](/images/new.png)

5. Edit URL page

- Edit URL
  ![Edit](/images/edit.png)

## Set up

1. Install express

```
npm install express
```

2. Install EJS

```
npm install ejs
```

3. Install body-parser

```
npm install body-parser
```

4. Install Nodemon

```
npm install --save-dev nodemon
```

- Nodemon test in terminal

```
./node_modules/.bin/nodemon -L express_server.js
```

- Nodemon test short code in pacage.json

```
"scripts": {
  "start": "./node_modules/.bin/nodemon -L express_server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

- Nodemon test short command

```
npm start
```

5. Install cookie-parser

```
npm install cookie-parser
```

6. Install Morgan

```
npm install morgan
```

7. Install bcrypt

```
npm install bcryptjs
```

8. Install cookie-session

```
npm install cookie-session
```

- if you don't have uuid key for cookie-session key

  - uuid can make random keyword

```
npm i uuid -g
```

- You can make a random keyword

```
uuid
```

9. Install Mocha and Chai

```
npm install mocha chai --save-dev
```

- Mocha and Chai test short code in pacage.json

```
"scripts": {
  "test": "./node_modules/mocha/bin/mocha"

}
```

```
npm test
```
