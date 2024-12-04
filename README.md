# The Hippocampus Hub

[The Hippocampus Hub](https://www.hippocampushub.eu) is a freely accessible resource which brings together free research tools and services, and learning resources for scientists and students interested in the hippocampus. It aims to provide a unique resource and bring together those interested in the hippocampus to create an active community.

## Explore Models

In this section, you can explore the different stages of our model build and simulation. We began by transforming sparse experimental datasets into the dense datasets necessary for building the model. Subsequently, each component of the model and the compound network model were subjected to rigorous validation, after which the model was used to make predictions. The models presented in this section are a continuation of the pioneering hippocampal research conducted during the 2014-2020 period as part of the Human Brain Project, which was published in Romani et al. (2024).


## Getting started

First, install dependencies:
```bash
npm install
```

To start the portal in development mode, run:

```bash
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.


## Build for production

Build an app for production and export static files:

```bash
npm run build && npm run export
```

## Docker image

Build a Docker image with:
```bash
docker build -t hippocampus-model-portal .
```

You can then run it with:
```bash
docker run -it --rm -p 8000:8000 hippocampus-model-portal
```
## Funding & Acknowledgements
This work has been partially funded by the EBRAINS research infrastructure, funded from the European Union’s Horizon 2020 Framework Programme for Research and Innovation under the Specific Grant Agreement No. 945539 (Human Brain Project SGA3).

The development of this software was supported by funding to the Blue Brain Project, a research center of the École polytechnique fédérale de Lausanne (EPFL), from the Swiss government’s ETH Board of the Swiss Federal Institutes of Technology.

For license and authors, see `LICENSE.txt` and `AUTHORS.md` respectively.

Copyright (c) 2019-2024 Blue Brain Project/EPFL
