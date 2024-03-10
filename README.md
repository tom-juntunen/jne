Step 1: Initialize Backend Node JS Express Server (port: 3000)

```
cd todo-backend
npm install
npm run dev
```

Step 2: Initialize Frontend React project (port: 3001)

```
cd todo-frontend
npm install
npm start
```

Step 3: View site at http://localhost:3001




## Development


#### Database Migrations
1. Update a Sequelize model.
2. Use the Sequelize CLI to generate a new migration file.
    - `npx sequelize-cli migration:generate --name <migration_file_name>`
3. Write the migration logic.
4. Execute the migration. 
`npx sequelize-cli db:migrate` 
    - If no config/config.json exists you will need to run `npx sequelize-cli init` first and then configure your desired setup.
    Example 1: Local sqlite with `development` environment:
    ```
    {
        "development": {
            "storage": "./database.sqlite",
            "dialect": "sqlite",
            "logging": false
        }
    }

    ```

