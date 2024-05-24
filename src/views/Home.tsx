import React from 'react';

import SectionCard from '../components/SectionCard';


const classPrefix = 'Home__';

const Home: React.FC = () => (
  <div className={`${classPrefix}basis`}>
    <section id="section-3">
      <div className="intro">
        <h2 className="text-white">EXPLORE</h2>
        <h3>Explore the existing Hippocampus model and all its parts!</h3>
        <p>
          In this section, you can explore the different stages of our model build and simulation.
          We began by transforming sparse experimental datasets into the dense datasets necessary for building the model.
          Subsequently, each component of the model and the compound network model were subjected to rigorous validation,
          after which the model was used to make predictions.
          The models presented in this section are a continuation of the
          &nbsp;
          <a href="https://www.humanbrainproject.eu/en/brain-simulation/hippocampus/" target="_blank" rel="noopener noreferrer">pioneering hippocampal research</a>
          &nbsp;
          conducted during the 2014-2020 period as part of the Human Brain Project,
          which was published in add reference.
        </p>
      </div>

      <div className="row center-xs" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Experimental data"
            idx="1"
            description={<div>
              <p>
                The first step of the reconstruction of the hippocampus involves
                the collection of experimental datasets from our affiliated and collaborator's
                laboratories as well as from published literature sources worldwide.
                Available data on these brain regions are sparse and heterogeneous,
                and much of our work concerned the curation and organization of the data.
              </p>
            </div>}
            links={[
              {
                label: 'Layer Anatomy',
                href: '/experimental-data/layer-anatomy/',
              },
              {
                label: 'Neuronal Morphology',
                href: '/experimental-data/neuronal-morphology/',
              },
              {
                label: 'Neuronal Electrophysiology',
                href: '/experimental-data/neuronal-electrophysiology/',
              },
              {
                label: 'Connection Anatomy',
                href: '/experimental-data/connection-anatomy/',
              },
              {
                label: 'Connection Physiology',
                href: '/experimental-data/connection-physiology/',
              },
              {
                label: 'Schaffer Collaterals',
                href: '/experimental-data/schaffer-collaterals/',
              },
              {
                label: 'Acetylcholine',
                href: '/experimental-data/acetylcholine/',
              },
              {
                label: 'Theta',
                href: '/experimental-data/theta/',
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Reconstruction data"
            idx="2"
            description={<div>
              <p>
                The second step of the reconstruction converts the sparse experimental datasets to dense datasets, required to fully reconstruct the hippocampus model. We applied several strategies to predict the missing data: algorithms, principles, and rules.
              </p>
            </div>}
            links={[
              {
                label: 'Volume',
                href: '/reconstruction-data/volume/',
              },
              {
                label: 'Cell composition',
                href: '/reconstruction-data/cell-composition/',
              },
              {
                label: 'Morphology library',
                href: '/reconstruction-data/morphology-library/',
              },
              {
                label: 'Neuron models',
                href: '/reconstruction-data/neuron-models/',
              },
              {
                label: 'Neuron model library',
                href: '/reconstruction-data/neuron-model-library/',
              },
              {
                label: 'Connections',
                href: '/reconstruction-data/connections/',
              },
              {
                label: 'Synapses',
                href: '/reconstruction-data/synapses/',
              },
              {
                label: 'Acetylcholine',
                href: '/reconstruction-data/acetylcholine/',
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Digital reconstructions"
            idx="3"
            description={<div>
              <p>
                The third step of the reconstruction generates an instance of the hippocampus model. Most of the model parameters were sampled from the distributions defined in the dense datasets of step two. For this reason, each model instance is unique within the biological ranges and could be considered to be derived from a specific individual.

              </p>
            </div>}
            links={[
              {
                label: 'Region',
                href: '/digital-reconstructions/region/',
              },
              {
                label: 'Schaffer Collaterals',
                href: '/digital-reconstructions/schaffer-collaterals/',
              },
              {
                label: 'Connections',
                href: '/digital-reconstructions/connections/',
              },
              {
                label: 'Synapses',
                href: '/digital-reconstructions/synapses/',
              },
              {
                label: 'Neurons',
                href: '/digital-reconstructions/neurons/',
              },
              {
                label: 'Acetylcholine',
                href: '/digital-reconstructions/acetylcholine/',
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Validations"
            idx="4"
            description={<div>
              <p>
                We extensively validated each model component and the final network to assess the validity of the model. Successful validations support the idea that the model can go beyond the initial set of data and show emergent properties. Validation failures may indicate wrong model assumptions or incompatibility between model and validation datasets. Validation failures provide useful information for us to revise and improve the model.

              </p>
            </div>}
            links={[
              {
                label: 'Sub-region',
              },
              {
                label: 'Microcircuits',
              },
              {
                label: 'Synaptic Pathways',
              },
              {
                label: 'Neurons',
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Predictions"
            idx="5"
            description={<div>
              <p>
                Each model parameter or behavior that has not been described experimentally could be considered a prediction. We already mentioned that most of the predicted parameters and behaviors arise during the reconstruction data step. Here, we focus on the predictions derived from the simulation experiments we carried out.
              </p>
            </div>}
            links={[
              {
                label: 'Sub-region',
              },
              {
                label: 'Microcircuits',
              },
              {
                label: 'Synaptic Pathways',
              },
              {
                label: 'Neurons',
              }
            ]}
          />
        </div>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '0.5rem' }}>
        <small className="text-grey"><sup>*</sup> Coming soon</small>
      </div>
    </section>
  </div>
);

export default Home;
