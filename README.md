# Set up

## Install express

```
npm install express
```

## Install EJS

```
npm install ejs
```

## Install body-parser

```
npm install body-parser
```

## Install Nodemon

```
npm install --save-dev nodemon
```

### test in terminal

```
./node_modules/.bin/nodemon -L express_server.js
```

### or update at pacage.json

```
"scripts": {
  "start": "./node_modules/.bin/nodemon -L express_server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### test command within pacage.json

```
npm start
```
