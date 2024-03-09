Step 1: Initialize Node.js project

```
mkdir todo-backend
cd todo-backend
npm init -y
npm install express sequelize pg pg-hstore body-parser cors socket.io
npm install -D typescript @types/node @types/express @types/sequelize @types/cors @types/socket.io
tsc --init
```

Step 2: Initialize React project

```
npx create-react-app todo-frontend --template typescript
cd todo-frontend
npm install socket.io-client
```