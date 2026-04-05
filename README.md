# PantryKeeper-CWW

This is a code bundle for PantryKeeper-CWW. The original project is available at https://www.figma.com/design/l0FmqcJTU12RrsQgqoWbze/PantryKeeper-CWW.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment

### Frontend

#### Create target for Hosting site

```sh
firebase target:apply hosting <target-name> <site-id>
```

Hosted in firebase, you need access to the project.
Then:
```sh
firebase login
firebase deploy --only-hosting
```

This deploys the frontend

### Backend

Functions and database are in supabase. If you need to redeploy functions or execute migrations:

```sh
npm install -g supabase
supabase login
supabase init
supabase link --project-ref <your-project-ref>
supabase functions deploy
# or
supabase functions deploy <function name>
```

If you need to execute migrations that have been created in the supabase/migrations folder:
```sh
supabase db push
```

Otherwise just execute the sql in supabase (migration files are preferred for traceability).

#### DB Migrations

* For schema changes, update the necessary DDL sql file in `src/supabase/schemas`
* Create a new migration:
```sh
supabase db diff -f <migration_name>
```
* On PR approval and merge to `staging/production`, schema changes will be pushed to the appropriate remote DB.
