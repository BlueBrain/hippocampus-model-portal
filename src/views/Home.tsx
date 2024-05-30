import React from 'react';

import SectionCard from '../components/SectionCard';
import { basePath } from '../config';


const classPrefix = 'Home__';

const Home: React.FC = () => (
  <div className={`${classPrefix}basis`}>
    <section id="home-section" style={{ backgroundImage: `url(${basePath}/assets/images/placeholder-bg.png)` }}>
      <div className="intro">
        <h2 className="text-white">Explore</h2>
        <h3 className='text-bbp-blue'>Explore the existing Hippocampus model and all its parts!</h3>
        <p className='text-white'>
          In this section, you can explore morphological reconstructions,
          electrophysiological recordings and models of single neurons.
          The models you find in this section are a continuation of the <a
            href="https://www.humanbrainproject.eu/en/brain-simulation/hippocampus/"
            target="_blank"
            rel="noopener noreferrer"
          >
            hippocampal research
          </a> carried out in the Human Brain Project during 2014-2020.
          Currently we are finalising a full-scale model of the rat hippocampus CA1,
          which will be available and freely accessible in due course, when the publication is released.
        </p>
      </div>

      <div className="card-container row center-xs">
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Experimental data"
            icon="public/assets/images/icons/placeholder.svg"
            idx="1"
            description={<div>
              <p>
                The first step in the reconstruction of the hippocampus involves the acquisition and
                organization of data collected from the rodent hippocampus. <br />
                Sparse data has been collected from our own laboratories and from published sources worldwide,
                both of which describe the structural and functional organization of the hippocampus
                at various anatomical levels. This ranges from individual neurons to synaptic connections and
                network activity. The data provides constraints, rules, and the principles
                to build computational models at specific levels of detail.
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
                Validations are a crucial part of the data-driven modeling workflow that reduce the risk that
                errors may lead to major inaccuracies in the reconstruction or in simulations of emergent behavior.<br />
                Successful validations not only enable the systematic exploration of the emergent properties
                of the model, but also establish predictions for future <i>in vitro</i> experiments,
                or may call into question existing experimental data. Failure in validation may also indicate errors
                in experimental data, which allow us to identify future refinements.
                Rigorous validation of a metric at one level of detail therefore also prevents error amplification
                to the next level, and triggers specific experimental refinements. <br />
                Therefore, the Blue Brain Project validation step provides a scaffold
                that enables the integration of available experimental data, identifies missing experimental data,
                and facilitates the iterative refinement of constituent models.
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
    </section>
  </div>
);

export default Home;
