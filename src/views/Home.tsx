// import './Home.scss';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Title from '../components/Title';
import ImageSlider from '../components/ImageSlider';
import Button from '../components/Button';
import InfoBox1 from '../components/Home/InfoBox1';
import InfoBox2 from '../components/Home/InfoBox2';
import { Color } from '../types';
import Search from '../components/Search';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import CtaButton from '../components/CtaButton';
import { basePath } from '../config';
import SectionCard from '../components/SectionCard';


const classPrefix = 'Home__';

const Home: React.FC = () => (
  <div className={`${classPrefix}basis`}>
    <section id="section-1" className="content">
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        background:'linear-gradient(90deg, #343744 0%, #bdc7e2 100%)',
      }}></div>

      <Image
        src="/assets/images/backgrounds/home-page/hippocampus_hub-landing_banner.jpeg"
        layout="fill"
        objectFit="cover"
        unoptimized
      />

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '60px',
        color: 'grey',
      }}> ©Blue Brain Project/EPFL 2005-2021 </div>
      <div className="title">
        <Title
          title={<span>Hippocampus <br/> Model Portal</span>}
          hint="Welcome to the Hippocampus Portal created by the EPFL Blue Brain Project and CNR. <br/> Explore the datasets, models and visuals to understand how we reconstruct the rodent hippocampus in silico."
          primary
        />
        <div className="cta">
          <CtaButton width="280px" color="yellow">Explore now</CtaButton>
          <br/>
          <CtaButton width="280px" className="mt-2" color="grey">Go to hub</CtaButton>

          {/* <a href="#section-3">
            <Button primary width={140}>
              Explore
            </Button>
          </a>
          <Link href="/styleguide">
            <Button width={140}>Read paper</Button>
          </Link> */}
        </div>
        {/* <div className="search-form">
          <Search />
        </div> */}
      </div>
      {/* <img
        className="top-section-image"
        src={require('url:../assets/images/computer.svg')}
        alt="computer"
      /> */}
      {/* <div className="social-media">
        <a href="#">
          <div className="social-media-icon">
            <FaTwitter />
          </div>
        </a>
        <a href="#">
          <div className="social-media-icon">
            <FaFacebookF />
          </div>
        </a>
        <a href="#">
          <div className="social-media-icon">
            <FaLinkedinIn />
          </div>
        </a>
      </div> */}
    </section>

    {/* <section id="section-2">
      <h2>
        Select and Explore. Download.{' '}
        <span className="nowrap">
          Contribute
          <span className="accent-border" />
        </span>
      </h2>
      <div className="content">
        <div className="workflow">
          <InfoBox1
            icon="search"
            title="Select and Explore"
            teaser="Discover how the Blue Brain Project collects and organizes sparse multi-scale datasets, and extrapolates principles of organization for dense digital reconstructions of brain regions such as the SSCx."
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </InfoBox1>
          <InfoBox1
            icon="download"
            title="Download"
            teaser="The Blue Brain Project has made various models and data available for you to download."
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </InfoBox1>
          <InfoBox1
            icon="mail"
            title="Contribute"
            teaser="Please get in touch if you wish to collaborate with us on experimental datasets or computational models presented here."
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </InfoBox1>
        </div>
        <div className="image">
          <img
            id="screenshot"
            src={`${basePath}/assets/images/screenshot.png`}
            alt="screenshot"
            loading="lazy"
          />
        </div>
      </div>
    </section> */}

    <section id="section-3">
      <div className="intro">
        <h2 className="text-white">Explore</h2>
        <h3>Navigate the various datasets made available!</h3>
        <p>
          In order to address the still existing gaps in our knowledge in brain
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
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
                href: '/model/experimental-data/neuronal-morphology',
              },
              {
                label: 'Neuronal Electrophysiology',
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
