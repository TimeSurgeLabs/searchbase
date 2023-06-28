# <h1 align="center">Searchbase</h1>

### <p align="center">Your Intelligent and Versatile FOSS ChatGPT Alternative for High-Security Environments</p>

Searchbase brings you an open-source alternative to ChatGPT that can be deployed fully locally, on a hybrid cloud, or be hosted for you, offering unparalleled flexibility and security tailored to your needs. With support for embeddings, it utilizes your company's existing resources to deliver highly relevant responses in a conversational context. Enterprise-level support is available for organizations looking to leverage our expertise for an optimized experience.

## Features

* **Fully Local or Hybrid Cloud Deployment** - With Searchbase, you can choose your preferred deployment scenario based on your business's privacy and flexibility needs. From running fully locally using open-source LLMs to employing the OpenAI API while maintaining data privacy or letting us host an LLM for you, Searchbase adapts to your requirements.

* **Embeddings Support** - Empower your Searchbase instance by uploading company documentation, code, and other relevant resources. This creates a custom LLM that truly understands your organization, enabling quick and accurate responses without having to sift through volumes of data.

* **Open Source Flexibility** - Searchbase is licensed under the [Apache 2.0 License](LICENSE), offering you the benefits of an open-source platform including transparency, flexibility, and community support.

* **Modern, Robust Tooling** - Built on a foundation of industry-leading technologies such as [Tailwind](https://tailwindcss.com/), [Next.js](https://nextjs.org/), [NextAuth](https://next-auth.js.org/), [PostgreSQL](https://www.postgresql.org/), [pgvector](https://github.com/pgvector/pgvector), and [Docker](https://www.docker.com/), Searchbase offers a modern and robust platform for your conversational AI needs.

* **Enterprise Support** - For larger organizations or those seeking a more tailored experience, [contact us](https://timesurgelabs.com/#contact) for information on enterprise support plans. Benefit from our expertise to enhance performance, maximize uptime, and facilitate rapid issue resolution.

* **Enhanced Efficiency** - By integrating with your existing resources, Searchbase boosts your efficiency by enabling quick and accurate responses, reducing the time spent on information retrieval.

* **Cost-Effective** - With two versions available, Searchbase allows you to choose a deployment that matches your business requirements and budget, ensuring a cost-effective conversational AI solution.

* **Security Focused** - Searchbase is designed with a strong focus on data privacy and security, making it a reliable choice for organizations with stringent data handling and privacy policies.

## Versions

Searchbase offers two versions for installation: **Searchbase** and **Searchbase Lite**, each designed for unique deployment scenarios.

* **Searchbase** is targeted towards enterprises prioritizing maximum data security and privacy. This version is fully local and does not require any external API calls, offering a high-security deployment. It is the heaviest version and requires at least* 250GB of SSD storage, a GPU with at least 8GB of VRAM* to run, as well as Docker Compose GPU passthrough support. Only Linux installation is supported.

* **Searchbase Lite** is suitable for scenarios where security, while important, isn't the highest priority. Ideal for businesses wanting to keep data stored locally or embedding company-specific information into an LLM-powered chatbot. It is lighter with only two containers, can run on minimal hardware (2GB RAM and a single vCore), and requires a valid OpenAI API key for OpenAI API calls. Alternatively, Searchbase Lite can be used with a remotely hosted LLM that you own and run via [FastChat](https://github.com/lm-sys/FastChat#api), or [we can host one for you](https://timesurgelabs.com/#contact). It supports installation on x86 machines running Docker Compose.

**Note: Please continue to the [installation guide](docs/install.md) for detailed instructions on setting up your Searchbase or Searchbase Lite.**

### Why Use Searchbase?

* **Independence and Flexibility** - Searchbase allows you to choose between local, hybrid, or fully hosted deployment options, ensuring the perfect balance between data privacy, security, and the flexibility of cloud services.

* **Company-Specific Contextual Understanding** - By uploading and embedding your company's documentation, code, and other resources, Searchbase develops a unique understanding of your organization, driving contextually accurate interactions.

* **Reduced Time-To-Information** - Searchbase's ability to understand and learn from your organization's resources enables it to provide quicker, more accurate responses, reducing the time spent searching for information.

* **Cost Savings** - With the option to deploy locally or in a hybrid model, you can significantly reduce ongoing costs associated with cloud services, making Searchbase a cost-effective alternative.

* **Security and Data Privacy** - As an organization, you can maintain complete control over your data with the option for fully local deployment, ensuring that all information stays within your network.

* **Tailored Support** - Our enterprise support plans offer dedicated assistance, personalized to your organization's needs. This includes priority troubleshooting, updates, custom feature development, and more, providing you with a smooth, uninterrupted experience.

<small>* Depends on the LLM model selected. </small>
