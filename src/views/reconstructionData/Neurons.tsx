import React from 'react';
import Image from 'next/image';

import { Row, Col } from 'antd';

import Filters from '../../layouts/Filters';
import Collapsible from '../../components/Collapsible';
import Title from '../../components/Title';
import { colorName, sectionTitle } from './config';
import { basePath } from '../../config';

import styles from './neurons.module.scss';

const RecNeuronsView = () => (
  <div className={styles.container}>
    <Title
      primaryColor={colorName}
      title="Neurons"
      subtitle={sectionTitle}
      hint="We labeled single neurons with biocytin to stain their axonal and dendritic morphologies to enable their 3D reconstruction and their objective classification into morphological types (m-types). In addition, we also characterized the electrical firing patterns of these neurons to different intensities of step currents injected in the soma to group their response into electrical types (e-types). We then mapped the e-types expressed in each m-type to account for the observed diversity of morpho-electrical subtypes (me-types)"
    />

    <div className={styles.data}>
      <Collapsible title="Morphology-type" className="mt-4 dark-collapsible">
        <div className="text-center">
          <p className={styles.title}>Neuron morphology generalization</p>
        </div>
        <div className={styles.divider} />


        <div className={styles.desktop}>
          <div className={styles.infoContainerD}>
            <div className={styles.infoCellD}>
              <div className={styles.infoHeadD}>Cloning</div>
            </div>
            <div className={styles.infoCellD}>
              <div className={styles.infoHeadD}>Axon grafting</div>
            </div>
            <div className={styles.infoCellD}>
              <div className={styles.infoHeadD}>Substitution</div>
            </div>
          </div>

          <div className={styles.infoContainerD}>
            <div className={styles.infoCellD}>
              <div className={styles.infoContentD}>
                Due to lack of variety in neuron morphologies collected from extrapolated data, morphology reconstruction variants/clones are obtained by programmatically jittering branch angles and/or slightly modifying the length of segments.
              </div>
            </div>
            <div className={styles.infoCellD}>
              <div className={styles.infoContentD}>
                Reconstructions are mainly performed on dendrites, there are only a few axons. To address this challenge, axons from one m-type are combined to the soma and dendrites of cells with the same morphology, as we assume they are compatible. This in turn generates new complete m-type models, increasing the diversity of neuron reconstructions.
              </div>
            </div>
            <div className={styles.infoCellD}>
              <div className={styles.infoContentD}>
                Certain known m-types lack an extrapolated reconstruction morphology. In order to favour variability of cell types (as observed in vivo), the lacking m-type morphologies are substituted with other reconstructed models.
              </div>
            </div>
          </div>

          <div className={styles.infoContainerD}>
            <div className={styles.infoCellD}>
              <div className={styles.infoImgD}>
                <Image
                  width="220"
                  height="150"
                  src={`${basePath}/assets/images/morph-generalization/1.png`}
                  layout="responsive"
                />
              </div>
            </div>

            <div className={styles.infoCellD}>
              <div className={styles.infoImgD}>
                <Image
                  width="220"
                  height="150"
                  src={`${basePath}/assets/images/morph-generalization/2.png`}
                  layout="responsive"
                />
              </div>
            </div>

            <div className={styles.infoCellD}>
              <div className={styles.infoImgD}>
                <Image
                  width="220"
                  height="150"
                  src={`${basePath}/assets/images/morph-generalization/3.png`}
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </div>


        <div className={styles.mobile}>
          <Row gutter={16}>
            <Col span={24} className="mt-2">
              <div className={styles.infoM}>
                <div className={styles.infoHeadM}>
                  Cloning
                </div>
                <div className={styles.infoContentM}>
                  <span>
                    Due to lack of variety in neuron morphologies collected from extrapolated data, morphology reconstruction variants/clones are obtained by programmatically jittering branch angles and/or slightly modifying the length of segments.
                  </span>
                </div>
                <div className={styles.infoImgM}>
                  <Image
                    width="220"
                    height="150"
                    src={`${basePath}/assets/images/morph-generalization/1.png`}
                    layout="responsive"
                  />
                </div>
              </div>
            </Col>

            <Col span={24} className="mt-2">
              <div className={styles.infoM}>
                <div className={styles.infoHeadM}>
                  Axon grafting
                </div>
                <div className={styles.infoContentM}>
                  <span>
                    Reconstructions are mainly performed on dendrites, there are only a few axons. To address this challenge, axons from one m-type are combined to the soma and dendrites of cells with the same morphology, as we assume they are compatible. This in turn generates new complete m-type models, increasing the diversity of neuron reconstructions.
                  </span>
                </div>
                <div className={styles.infoImgM}>
                  <Image
                    width="220"
                    height="150"
                    src={`${basePath}/assets/images/morph-generalization/2.png`}
                    layout="responsive"
                  />
                </div>
              </div>
            </Col>

            <Col span={24} className="mt-2">
              <div className={styles.infoM}>
                <div className={styles.infoHeadM}>
                  Substitution
                </div>
                <div className={styles.infoContentM}>
                  <span>
                    Certain known m-types lack an extrapolated reconstruction morphology. In order to favour variability of cell types (as observed in vivo), the lacking m-type morphologies are substituted with other reconstructed models.
                  </span>
                </div>
                <div className={styles.infoImgM}>
                  <Image
                    width="220"
                    height="150"
                    src={`${basePath}/assets/images/morph-generalization/3.png`}
                    layout="responsive"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>

      </Collapsible>

      <Collapsible title="Electrophysiology-type" className="mt-4 dark-collapsible">
        <div className="text-center">
          <p className={styles.title}>Neuron eletrophysiology generalization</p>
        </div>
        <div className={styles.divider} />
        <Row gutter={16}>
          <Col xs={{span: 24}} md={{span: 7}} span={7} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Cloning */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Due to lack of variety in neuron morphologies collected from extrapolated data, morphology reconstruction variants/clones are obtained by programmatically jittering branch angles and/or slightly modifying the length of segments. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/1.png" /> */}
              </div>
            </div>
          </Col>

          <Col xs={{span: 24}} md={{span: 9}} span={9} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Axon grafting */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Reconstructions are mainly performed on dendrites, there are only a few axons. To address this challenge, axons from one m-type are combined to the soma and dendrites of cells with the same morphology, as we assume they are compatible. This in turn generates new complete m-type models, increasing the diversity of neuron reconstructions. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/2.png" /> */}
              </div>
            </div>
          </Col>

          <Col xs={{span: 24}} md={{span: 7}} span={7} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Substitution */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Certain known m-types lack an extrapolated reconstruction morphology. In order to favour variability of cell types (as observed in vivo), the lacking m-type morphologies are substituted with other reconstructed models. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/3.png" /> */}
              </div>
            </div>
          </Col>
        </Row>
      </Collapsible>

      <Collapsible title="Morpho-electrophyliological-instance" className="mt-4 dark-collapsible">
        <div className="text-center">
          <p className={styles.title}>Neuron morpholo-electrophysiological generalization</p>
        </div>
        <div className={styles.divider} />
        <Row gutter={16}>
          <Col xs={{span: 24}} md={{span: 7}} span={7} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Cloning */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Due to lack of variety in neuron morphologies collected from extrapolated data, morphology reconstruction variants/clones are obtained by programmatically jittering branch angles and/or slightly modifying the length of segments. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/1.png" /> */}
              </div>
            </div>
          </Col>

          <Col xs={{span: 24}} md={{span: 9}} span={9} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Axon grafting */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Reconstructions are mainly performed on dendrites, there are only a few axons. To address this challenge, axons from one m-type are combined to the soma and dendrites of cells with the same morphology, as we assume they are compatible. This in turn generates new complete m-type models, increasing the diversity of neuron reconstructions. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/2.png" /> */}
              </div>
            </div>
          </Col>

          <Col xs={{span: 24}} md={{span: 7}} span={7} className="mt-2">
            <div className={styles.info}>
              <div className={styles.infoHead}>
                {/* Substitution */}
              </div>
              <div className={styles.infoContent}>
                <span>
                  {/* Certain known m-types lack an extrapolated reconstruction morphology. In order to favour variability of cell types (as observed in vivo), the lacking m-type morphologies are substituted with other reconstructed models. */}
                </span>
              </div>
              <div className={styles.infoImg}>
                {/* <img src="/assets/images/morph-generalization/3.png" /> */}
              </div>
            </div>
          </Col>
        </Row>
      </Collapsible>
    </div>
  </div>
);

export default RecNeuronsView;
