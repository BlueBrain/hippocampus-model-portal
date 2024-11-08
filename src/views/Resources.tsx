import React from "react";
import FullPage from "../layouts/FullPage";
import Link from "next/link";

const Resources: React.FC = () => {
  return (
    <FullPage>
      <div className="iq__container">
        <h1> Resources</h1>

        <h2>Network model</h2>
        <p>
          The model of the full CA1 can be downloaded from{" "}
          <Link href="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/TN3DUI">
            {" "}
            Harvard dataverse
          </Link>
          .
        </p>

        <h2>Code</h2>
        <p>
          Github repository with the code for the figures of the manuscript{" "}
          <Link href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3002861">
            Romani et al. (2024)
          </Link>
          .
          <br />
          <Link href="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/UGOQWE">
            github.com/BlueBrain/rat_ca1_model_code/
          </Link>
        </p>

        <h2>Simulating a Hippocampus Microcircuit</h2>
        <p>
          A massive open online course (MOOC) about the CA1 microcircuit.
          <br />
          <Link href="https://www.edx.org/learn/neuroscience/ecole-polytechnique-federale-de-lausanne-simulating-a-hippocampus-microcircuit">
            edx.org/learn/neuroscience/ecole-polytechnique-federale-de-lausanne-simulating-a-hippocampus-microcircuit
          </Link>
        </p>

        <h2>Publications</h2>
        <ul>
          <li>
            Romani et al. Community-based Reconstruction and Simulation of a
            Full-scale Model of Region CA1 of Rat Hippocampus. BioRxiv.
            <br />
            <Link href="https://www.biorxiv.org/content/10.1101/2023.05.17.541167v2">
              https://www.biorxiv.org/content/10.1101/2023.05.17.541167v2
            </Link>
          </li>
          <li>
            Bologna L.L., Tocco A., Smiriglia R., Romani A., Schürmann F.,
            Migliore M. (2023). Online interoperable resources for building
            hippocampal neuron models via the Hippocampus Hub. Front
            Neuroinform. 2023 Nov 1:17:1271059. doi: 10.3389/fninf.2023.1271059.
            eCollection 2023.
          </li>
          <li>
            Romani A., Schürmann F., Markram H., and Migliore M. (2022).
            Reconstruction of the Hippocampus. Adv. Exp. Med. Biol. 1359,
            261–283. 10.1007/978-3-030-89439-9_11.
          </li>
          <li>
            Sáray S., Rössert C.A., Appukuttan S., Migliore R., Vitale P.,
            Lupascu C.A., Bologna L.L., Van Geit W., Romani A., Davison A.P., et
            al. (2021). HippoUnit: A software tool for the automated testing and
            systematic comparison of detailed models of hippocampal neurons
            based on electrophysiological data. PLoS Comput. Biol. 17, e1008114.
            10.1371/journal.pcbi.1008114.
          </li>
          <li>
            Ecker A., Romani A., Sáray S., Káli S., Migliore M., Falck J., Lange
            S., Mercer A., Thomson A.M., Muller E., Reimann M.W., Ramaswamy, S.
            (2020). Data-driven integration of hippocampal CA1 synaptic
            physiology in silico. Hippocampus. 2020 Nov;30(11):1129-1145. doi:
            10.1002/hipo.23220. Epub 2020 Jun 10.{" "}
          </li>
          <li>
            Migliore R., Lupascu C.A., Bologna L.L., Romani A., Courcol J.-D.,
            Antonel S., Van Geit W.A.H., Thomson A.M., Mercer A., Lange S., et
            al. (2018). The physiological variability of channel density in
            hippocampal CA1 pyramidal cells and interneurons explored using a
            unified data-driven modeling workflow. PLoS Comput. Biol. 14,
            e1006423. 10.1371/journal.pcbi.1006423.{" "}
          </li>
        </ul>
      </div>
    </FullPage>
  );
};

export default Resources;
