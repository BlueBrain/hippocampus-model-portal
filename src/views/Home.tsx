import React from 'react';
import SectionCard from '../components/SectionCard';
import { basePath } from '../config';

const Home: React.FC = () => (
  <div className="flex flex-col">
    <section
      id="home-section"
      className="bg-cover bg-center"
      style={{ backgroundImage: `url(${basePath}/resources/media/backgrounds/bg.png)` }}
    >
      <div className="p-8 mt-24 mw-full max-w-screen-xl mx-auto xl:px-0 xs:px-8">
        <h2 className="text-white text-2xl mb-2 text-center">EXPLORE</h2>
        <h3 className="text-bbp text-l mb-2 text-center">Explore the existing Hippocampus model and all its parts!</h3>
        <p className="text-white text-base text-center md:w-2/3 md:mx-auto leading-loose">
          In this section, you can explore morphological reconstructions,
          electrophysiological recordings and models of single neurons.
          The models you find in this section are a continuation of the <a
            href="https://www.humanbrainproject.eu/en/brain-simulation/hippocampus/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            hippocampal research
          </a> carried out in the Human Brain Project during 2014-2020.
          Currently we are finalising a full-scale model of the rat hippocampus CA1,
          which will be available and freely accessible in due course, when the publication is released.
        </p>
      </div>
      <div className="mw-full max-w-screen-xl mx-auto xl:px-0 xs:px-8 my-12 flex flex-wrap justify-center">
        <div className="w-full lg:w-1/5 md:w-1/3 md:px-2 xs:mb-4">
          <SectionCard
            title="Experimental data"
            icon="public/assets/images/icons/placeholder.svg"
            idx="1"
            description={
              <div>
                <p>
                  The first step of the reconstruction of the hippocampus involves the collection of experimental datasets from our affiliated and collaborators’ laboratories as well as from published literature sources worldwide. Available data on these brain regions are sparse and heterogeneous, and much of our work concerned the curation and organization of the data.
                </p>
              </div>
            }
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
                label: 'Cell Density',
                href: '/experimental-data/cell-density/',
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
                label: 'Minis',
                href: '/experimental-data/minis/',
              },
              {
                label: 'Theta',
                href: '/experimental-data/theta/',
              }
            ]}
          />
        </div>
        <div className="w-full lg:w-1/5 md:w-1/3 md:px-2 xs:mb-4">
          <SectionCard
            title="Reconstruction data"
            idx="2"
            description={
              <div>
                <p>
                  The second step of the reconstruction converts the sparse experimental datasets to dense datasets, required to fully reconstruct the hippocampus model. We applied several strategies to predict the missing data: algorithms, principles, and rules.
                </p>
              </div>
            }
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
                label: 'Connection anatomy',
                href: '/reconstruction-data/connection/',
              },
              {
                label: 'Connection Physiology',
                href: '/reconstruction-data/connection-physiology/',
              },
              {
                label: 'Schaffer Collaterals',
                href: '/reconstruction-data/schaffer-collaterals/',
              },
              {
                label: 'Acetylcholine',
                href: '/reconstruction-data/acetylcholine/',
              }
            ]}
          />
        </div>
        <div className="w-full lg:w-1/5 md:w-1/3 md:px-2 xs:mb-4">
          <SectionCard
            title="Digital reconstructions"
            idx="3"
            description={
              <div>
                <p>
                  The third step of the reconstruction generates an instance of the hippocampus model. Most of the model parameters were sampled from the distributions defined in the dense datasets of step two. For this reason, each model instance is unique within the biological ranges and could be considered to be derived from a specific individual.
                </p>
              </div>
            }
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
                label: 'Connection Anatomy',
                href: '/digital-reconstructions/connection-anatomy/',
              },
              {
                label: 'Connecton Physiology',
                href: '/digital-reconstructions/connection-physiology/',
              },
              {
                label: 'Neurons',
                href: '/digital-reconstructions/neurons/',
              },
              {
                label: 'Synapses',
                href: '/digital-reconstructions/synapses/',
              },
              {
                label: 'Acetylcholine - Effects on Cells',
                href: '/digital-reconstructions/acetylcholine-effects-on-cells/',
              },
              {
                label: 'Acetylcholine - Effects on Synapses',
                href: '/digital-reconstructions/acetylcholine-effects-on-synapses/',
              }
            ]}
          />
        </div>
        <div className="w-full lg:w-1/5 md:w-1/3 md:px-2 xs:mb-4">
          <SectionCard
            title="Validations"
            idx="4"
            description={
              <div>
                <p>
                  We extensively validated each model component and the final network to assess the validity of the model. Successful validations support the idea that the model can go beyond the initial set of data and show emergent properties. Validation failures may indicate wrong model assumptions or incompatibility between model and validation datasets. Validation failures provide useful information for us to revise and improve the model.
                </p>
              </div>
            }
            links={[
              {
                label: 'Neurons',
                href: '/validations/neurons/'
              },
              {
                label: 'Connection Anatomy',
                href: '/validations/connection-anatomy/'
              },
              {
                label: 'Connection Physiology',
                href: '/validations/connection-physiology/'
              },
              {
                label: 'Schaffer collaterals 1',
                href: '/validations/schaffer-collaterals-1/'
              },
              {
                label: 'Schaffer collaterals 2',
                href: '/validations/schaffer-collaterals-2/'
              },
              {
                label: 'Acetylcholine',
                href: '/validations/acetylcholine/'
              }
            ]}
          />
        </div>
        <div className="w-full lg:w-1/5 md:w-1/3 md:px-2 xs:mb-4">
          <SectionCard
            title="Predictions"
            idx="5"
            description={
              <div>
                <p>
                  Each model parameter or behavior that has not been described experimentally could be considered a prediction. We already mentioned that most of the predicted parameters and behaviors arise during the reconstruction data step. Here, we focus on the predictions derived from the simulation experiments we carried out.
                </p>
              </div>
            }
            links={[
              {
                label: 'Spontaneous Activity',
                href: '/predictions/spontaneouns-activity',
              },
              {
                label: 'Voltage - Calcium Scan',
                href: '/predictions/voltage',
              },
              {
                label: 'Theta - Oscillatory input',
                href: '/predictions/theta-oscillatory-input',
              },
              {
                label: 'Theta - MS input',
                href: '/predictions/theta-ms-input',
              }
            ]}
          />
        </div>
      </div>
    </section >
  </div >
);

export default Home;