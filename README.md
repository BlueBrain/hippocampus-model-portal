# The Hippocampus Hub Explore

The Hippocampus portal is a freely accessible resource, which provides experimental data sets on the multi-scale organization of the rat hippocampus, and resulting computational models.


## Getting started

First, install dependencies:
```bash
npm install
```

To start the portal in development mode, run:

```bash
npm run dev
```

Open [http://localhost:3000/hippocampus-portal-dev/](http://localhost:3000/hippocampus-portal-dev/) with your browser to see the result.


## Build for production

Compile the app in .next folder:

```bash
npm run build
```


### ENV variables

**NEXT_PUBLIC_NEXUS_TOKEN**: An auth token used to query the data from Nexus. By default not set.
Hippocampus project data will become publicly accessible once the corresponding scientific paper is published
and portal goes live, you can generate a token using your account with access
to the `public | hippocampus` Nexus project.

**NEXT_PUBLIC_NEXUS_URL**: The URL of the Nexus KG deployment, defaults to `https://bbp.epfl.ch/nexus/v1`.

**NEXT_PUBLIC_NEXUS_AUTH_PROXY_URL**: Internal to deployment cluster URL of the HTTP auth proxy to access Nexus images.


## Docker image

Build a Docker image with:
```bash
docker build -t hippocampus-model-portal .
```

You can then run it with:
```bash
docker run -it --rm -p 8000:8000 hippocampus-model-portal
```

## HTTP auth proxy

The purpose of the auth proxy is to enable image optimisation service (which is a part of Next.js portal deployment
and doesn't support auth headers) to fetch images from Nexus for already authenticated,
internal (to the EPFL network) clients by adding an auth token to the proxied requests.

```
            |       OpenShift cluster     |
WebClient --|-> ImageOpt ---> AuthProxy --|-> Nexus
                (Next.js)
```

Relevant code is located in `tools/http-auth-proxy`.
