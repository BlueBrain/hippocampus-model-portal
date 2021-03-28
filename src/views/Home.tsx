import React from 'react';

import SectionCard from '../components/SectionCard';


const classPrefix = 'Home__';

const Home: React.FC = () => (
  <div className={`${classPrefix}basis`}>
    <section id="section-3">
      <div className="intro">
        <h2 className="text-white">Explore</h2>
        <h3>Explore the existing Hippocampus model and all its components</h3>
        <p>
          In this section, you can navigate through the different components of the hippocampus CA1 model. The Hub is under ongoing development, so new content will be added periodically. The full model will be completely accessible once the associated publications are released.
        </p>
      </div>

      <div className="row center-xs" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Experimental data"
            idx="1"
            description={<div>
              <p>
                The first step in the reconstruction of the hippocampus involves the acquisition and organization of data from the rodent hippocampus. <br/>
                Sparse data has been collected both from our own laboratories and from published sources worldwide, which describes the structural and functional organization of the hippocampus at various anatomical levels. This ranges from individual neurons to synaptic connections and network activity. The data provides constraints, rules, and the principles to build computational models at specific levels of detail.
              </p>
            </div>}
            links={[
              {
                label: 'Layer Anatomy',
              },
              {
                label: 'Neuronal Morphology',
                href: '/experimental-data/neuronal-morphology',
              },
              {
                label: 'Neuronal Electrophysiology',
                href: '/experimental-data/neuronal-electrophysiology/',
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Reconstruction data"
            idx="2"
            description={<div>
              <p>Step two in the hippocampus reconstruction is the extraction of as much information as possible from the previously collected sparse data and the exploitation of interdependencies to build detailed and dense models of individual cells and cell-circuits. From sparse experimental data sets, rules and principles of organization are identified and missing information is extrapolated to fill knowledge gaps, which enable a dense data-driven digital reconstruction of the hippocampus region.</p>
            </div>}
            links={[
              {
                label: 'Sub-regions',
              },
              {
                label: 'Microcircuit',
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
            title="Digital reconstructions"
            idx="3"
            description={<div>
              <p>In the third step of our reconstruction workflow, digital reconstructions are built and based on experimental datasets taken from specimens at a specific stage of development. They are therefore, digital snapshots of the structure and physiology of the brain at a specific age range. These digital reconstructions integrate data and knowledge of molecular, cellular and circuit anatomy, as well as their physiology.</p>
              <p>Starting from individually reconstructed cell morphologies and corresponding electrophysiological behaviors, they can be assembled into specific brain region circuits along with their individual synaptic and connectivity models. Circuit reconstructions are based on a standardized workflow enabled by Blue Brain Project software tools and supercomputing infrastructure. The parameterization of the tissue model is strictly based on biological data: directly, where available, generalized from data obtained in other similar systems; or, where unavailable, predicted from multi-constraints imposed by sparse data.</p>
            </div>}
            links={[
              {
                label: 'Sub-regions',
              },
              {
                label: 'Microcircuit',
              },
              {
                label: 'Synaptic Pathways',
              },
              {
                label: 'Neurons',
                href: '/digital-reconstructions/neurons/'
              }
            ]}
          />
        </div>
        <div className="col-xs-12 col-sm-4 col-lg mb-2">
          <SectionCard
            title="Validations"
            idx="4"
            description={<div>
              <p>Validations are a crucial part of the data-driven modeling workflows that reduce the risk that errors may lead to major inaccuracies in the reconstruction or in simulations of emergent behavior. Successful validations not only enable the systematic exploration of the emergent properties of the model, but also establish predictions for future in vitro experiments, or may call into question existing experimental data. Failure in validation may also indicate errors in experimental data, permitting the identification of future refinements. Rigorous validation of a metric at one level of detail therefore also prevents error amplification to the next level, and triggers specific experimental refinements. The Blue Brain Project Validation step provides a scaffold that enables the integration of available experimental data, identifies missing experimental data, and facilitates the iterative refinement of constituent models.</p>
            </div>}
            links={[
              {
                label: 'Sub-regions',
              },
              {
                label: 'Microcircuit',
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
              <p>The digital reconstruction of the hippocampus provides an array of predictions across its many levels of organization. These predictions provide insights to link underlying structure with function. In addition, predictions are also a means to validate the component models of the hippocampus model and identify missing data that could guide targeted experiments.In particular, we provide predictions on the propagation of activity across the different sub-regions of the hippocampus.</p>
            </div>}
            links={[
              {
                label: 'Sub-regions',
              },
              {
                label: 'Microcircuit',
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
