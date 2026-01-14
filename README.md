
  # PantryKeeper-CWW

  This is a code bundle for PantryKeeper-CWW. The original project is available at https://www.figma.com/design/l0FmqcJTU12RrsQgqoWbze/PantryKeeper-CWW.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  


  For frontend:
  Hosted in firebase, you need access to the project.
  Then:
  firebase login
  firebase deploy --only-hosting

  This deploys the frontend

  For backend:
  Functions and database are in supabase. If you need to redeploy functions or execute migrations:

  npm install -g supabase
  supabase login
  supabase init
  supabase link --project-ref <your-project-ref>
  supabase functions deploy
  or
  supabase functions deploy <function name>

  If you need to execute migrations that have been created in the supabase/migrations folder:
  supabase db push

  Otherwise just execute the sql in supabase (migration files are preferred for traceability)
