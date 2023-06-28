# <h1 align="center">Searchbase</h1>

### <p align="center"> Fully local or hybrid cloud FOSS ChatGPT alternative with embeddings support.</p>

## Features

* **Fully local or hybrid cloud** - You can run Searchbase fully locally via open source LLMs, use the OpenAI API while keeping data private, or we can [host an LLM for you](https://timesurgelabs.com/#contact)! Searchbase is as flexible and secure as you need it to be.

* **Embeddings Support** - Upload company documentation, code, and more to create a custom LLM that understands your company. Never have to sift through irrelevant docs to find the answers you're looking for!

* **Open Source** - Licensed under the [Apache 2.0 License](LICENSE).

* **Modern Tooling** - Built with Tailwind, Next.js, NextAuth, PostgreSQL, pgvector, and Docker.

* **Enterprise Support** - [Contact Us](https://timesurgelabs.com/#contact) for 
information on enterprise support plans.

## Versions

There are two versions available for installation: **Searchbase** and **Searchbase Lite**.

* **Searchbase** is intended to be the most secure and private version for enterprises where security is at the forefront. It is fully local and does not require any external API calls. However because of this, its by far the heaviest version and requires at least* 250GB of SSD storage, a GPU with at least 8GB of VRAM* to run, as well as Docker Compose GPU passthrough support. Only Linux installation is supported.

* **Searchbase Lite** is intended for use cases where security isn't at the forefront, but you either still want to keep your data stored locally, or want company information or documentation automatically embedded into an LLM-powered Chatbot. It only has two containers and can run on as little as 2GB of RAM and a single vCore, with 4GB of RAM and 2 vCores recommended. It utilizes the OpenAI API for calls to the LLM and does require a valid API key. Searchbase Lite can also be used with a remotely hosted LLM that you own and run via [FastChat](https://github.com/lm-sys/FastChat#api), or [we can run one for your company](https://timesurgelabs.com/#contact). Installation is supported on x86 machines running Docker Compose.

## Installation

Currently we only support installation via [Docker Compose](https://docs.docker.com/compose/). More installation methods will be added in the future. The installation process for the two versions is the same, the only difference is the Docker Compose file used. 

* For **Searchbase**, use the `docker/docker-compose.yml` file.
* For **Searchbase Lite**, use the `docker/docker-compose-lite.yml` file.

```sh
git clone https://github.com/TimeSurgeLabs/searchbase-llm.git
cd searchbase-llm
docker compose -f docker/docker-compose.yml build # or docker compose -f docker/docker-compose-lite.yml build
cp .env.example .env
nano .env # or open in your favorite text editor
```

### Configuration

For both versions:
* `NEXTAUTH_URL` - The URL of your Searchbase instance. This is used for authentication and should be set to the URL you will be accessing Searchbase from. If you are not sure what this is going to be yet, you can set it to `http://localhost:3000` for now.
* `NEXTAUTH_SECRET` - A random string used to encrypt cookies. Generate one with `openssl rand -hex 32`.
* `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` - Your Discord OAuth2 client ID and secret. You can create a new application [here](https://discord.com/developers/applications).
* `GITHUB_ID` and `GITHUB_SECRET` - Your GitHub OAuth2 client ID and secret. You can create a new application [here](https://github.com/settings/developers).

For **Searchbase**:
* `AI_MODE` - Set to the AI model that in configured in `docker/docker-compose.yml`. By default this is `fastchat-t5-3b-v1.0`.

For **Searchbase Lite** with OpenAI API:
* `AI_MODE` - Set this to any AI model that your OpenAI account has access to. We recommend `gpt-3.5-turbo-16k` for the best balance of performance and cost.
* `AI_BASE_URL` - Leave blank.
* `AI_API_KEY` - Your OpenAI API key. You can find this [here](https://platform.openai.com/account/api-keys).

For **Searchbase Lite** with a remote LLM:
* `AI_MODE` - Set this to the configured AI model on the remote machine.
* `AI_BASE_URL` - Set this to the base URL of the remote machine. For example, if the remote machine is at `https://example.com`, set this to `https://example.com/v1`.
* `AI_API_KEY` - Leave blank. FastChat does not support setting an API key for remote LLMs yet. If there is some form of proxy in front of the remote LLM that requires an API key, you can set it here.

### Running

Once your `.env` is configured, you can start Searchbase with:

```sh
docker compose -f docker/docker-compose.yml up -d # or docker compose -f docker/docker-compose-lite.yml up -d
```

### Accessing

Searchbase will be available at the URL you set in `NEXTAUTH_URL` . If you set it to `http://localhost:3000` , you can access it at `http://localhost:3000` . 

### Creating the First User

Go to the app and log in via the button in the top right of the screen. The first user can make themselves and admin by going to `http://localhost:3000/users` (or whatever your URL is) and clicking the green button next to the username that says `USER` . This will make them an admin which will allow them to manage users, upload data, and manage data. The button will be greyed out so that you can't accidentally demote yourself. Refresh the page to see the new "Admin" menu. Once this is complete you can use the admin menu to manage and see users, upload documents, and manage documents.

### Caveats and Warnings

* If you switch AI models when using **Searchbase** or **Searchbase Lite** with remote LLM, you will need to re-upload your documents. This is because the AI model is used to generate the embeddings for the documents, and if you switch models, the embeddings will be different. This is not an issue with Searchbase Lite with OpenAI API, as the embeddings are generated by the OpenAI API and are all the same.

<small> * Depending on LLM model selected. </small>
