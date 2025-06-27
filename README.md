# ChangelogGenerator

## Overview
This changelog generator serves as a CLI tool for developers to quickly generate a changelog for a project and publish it to a website or a local file. 
It includes:

- **AI-generated changelogs** from commit logs.
- **CLI tool** to generate and optionally publish changelogs.
- **Database storage** via Supabase.
- **Frontend website** to browse changelogs by repository.

## How to run
Clone the repo and install the dependencies. Then within the cli folder, run `pnpm link --global`. Now you will be able to run `changelogger` in any repo. run `changelogger init` and set up your API key. From there, you can run `changelogger generate` to create your changelogs. 

## Technical Decisions

I decided on a CLI tool because I believe it'd be the easiest and most convenient tool for developers to quickly generate their changelogs for a repo they are working on. I brainstormed the base features that would be required for a tool that I would use as a developer and I wanted the behavior to be as seamless as possible. For a quick, lightweight CLI project like this, I decided that using git logs from commits rather than calling a GitHub/GitLab API would be simpler and quicker. These logs are then passed into an LLM where it generates a markdown string which is stored into a PostgreSQL database in Supabase. NextJS then renders the frontend using the information stored in the database for a simple and easy to read format. 

## Future Plans
This app was quickly created in a short time frame. There are many things that I would like to add to this project

- Integrate GitHub/GitLab API for more detailed information about changes
- Separate databases for local and production environments or for different users so users can have their own page where they post their changelogs
- Account creation for users and some OAuth
- Spend some more time on the frontend and make it look a bit nicer
- Allow developers to provide additional prompts for the LLM if they want to modify their changelog outputs
