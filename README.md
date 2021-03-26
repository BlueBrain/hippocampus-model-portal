# Hippocampus Model Portal

The Hippocampus portal is a freely accessible resource, which provides experimental data sets on the multi-scale organization of the rat hippocampus, and resulting computational models.


## Getting started

First, install dependencies:
```bash
yarn
```

To start the portal in development mode, run:

```bash
yarn dev
```

Open [http://localhost:3000/model/](http://localhost:3000/model) with your browser to see the result.


## Build for production

Compile the app in .next folder:

```bash
yarn build
```


### ENV variables

**NEXT_PUBLIC_NEXUS_TOKEN**: An auth token used to query the data from Nexus. By default not set. Hippocampus project data will become publicly accessible once the corresponding scientific paper is published and portal goes live, you can generate a token using your account with access to the `public | hippocampus` Nexus project.

**NEXT_PUBLIC_NEXUS_URL**: The URL of the Nexus KG deployment, defaults to `https://bbp.epfl.ch/nexus/v1`


## Docker image

Build a Docker image with:
```bash
docker build -t hippocampus-model-portal .
```

You can then run it with:
```bash
docker run -it --rm -p 8000:8000 hippocampus-model-portal
```