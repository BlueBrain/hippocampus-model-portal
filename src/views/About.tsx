import React from 'react';
import Title from '../components/Title';
import FullPage from '../layouts/FullPage';
import { accentColors } from '../config';
import { Color } from '../types';
// import './Glossary.scss';


const colorName: Color = 'lavender';
const color = accentColors[colorName];

const About: React.FC = () => {

  return (
    <FullPage>
      <Title title="About" primaryColor={colorName} />

      <div className="glossary__container">

        <Title subtitle="A quick guide to navigating the portal" primaryColor={colorName} />

        <p>
          <strong>Navigating the microcircuit:</strong>
          <span>the user selects the microcircuit tab on the home page, where the left window represents connectivity between layers, and the thickness of the connecting ribbons represents the number of connection types between source and destination layers. The right window provides a microcircuit fact sheet showing key microcircuit properties (volume, number of neurons, number of layers etc.). A text window allows users to add annotations.</span>
        </p>

        <p>
          <strong>Information on a layer:</strong>
          <span>the user clicks on the layer name. The portal then displays a left window showing the efferent connections of neurons in the layer, classified by m-type and a right window providing a layer fact sheet, showing the distribution of m-types, e-types and other layer properties, together with a graphical representation of the mapping between the m-types in the layer and the calcium-binding proteins and neuropeptides they commonly express. A text window allows users to annotate the sheet.</span>
        </p>

        <p>
          <strong>Information on an intra- or inter-laminar connection:</strong>
          <span>the user clicks on the ribbon representing the connection. The portal then displays a detailed representation of the connections between neurons of different m-types in the source and destination layers-</span>
        </p>

        <p>
          <strong>Efferent connectivity and properties of an m-type:</strong>
          <span>the user clicks on the name of the m-type. The portal displays a left window showing the connectivity, and a right window showing the morphometric properties of the m-type together with data on its constituent me-types. A More Details button allows users to obtain detailed statistical distributions for the morphometric properties of axons and dendrites.</span>
        </p>

        <p>
          <strong>Properties of an me-type.</strong>
          <span>The me-type data in the m-type fact sheet contains links to separate fact sheets for each me-type. The fact sheet provides anatomical and physiological data for five exemplars of neurons belonging to the me-type, including data for the distribution of ion channels on axons, dendrites and the soma, traces of the response to step currents at 3 different intensities, an interactive 3D display of the neuron morphology, and movies showing the attenuation of post-synaptic potentials as they propagate from their dendritic location to the soma and the attenuation of action potentials as they back propagate from the soma to the dendrites. Users can download a NEURON model package for each exemplar. Again, text windows allow users to annotate the data.</span>
        </p>

        <p>
          <strong>Connection type data:</strong>
          <span>the user clicks on the ribbon connecting source and destination m-types. The portal changes the right window to display a fact sheet for the connection-type, describing its anatomical and physiological properties. A More Details button allows users to obtain statistical distributions for these properties.</span>
        </p>

        {/* {sectionLabels.map(sectionLabel => (
          <section key={sectionLabel}>
            {sectionLabel !== 'About' && (
              <Title subtitle={sectionLabel} primaryColor={colorName} />
            )}

            {glossaryContent[sectionLabel].map(([term, description]) => (
              <div className="row mt-2" key={term}>
                <div className="col-xs-4 col-md-3">
                  <strong dangerouslySetInnerHTML={{ __html: term }} />
                </div>
                <div className="col-xs-8 col-md-9">
                  <span dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>
            ))}
          </section>
        ))} */}

      </div>
    </FullPage>
  );
};


export default About;
