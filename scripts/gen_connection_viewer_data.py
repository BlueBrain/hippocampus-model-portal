import sys
import json
import numpy as np
import coloredlogs, logging
from os.path import abspath, join
from itertools import chain

from bluepy import Circuit, Synapse
from morphio import IterType


log = logging.getLogger(__name__)
coloredlogs.install(level='DEBUG')

SEC_SHORT_TYPE_DICT = {
    'soma': 0,
    'SOMA_SIMPLE_CONTOUR': 0,
    'SOMA_SINGLE_POINT': 0,
    'axon': 1,
    'basal_dendrite': 2,
    'apical_dendrite': 3,
}

def sec_data(nm_sections, base_sec_ids=[]):
    """
    Convert neurom sections into a list with the following structure:
    [
      sec_type,      # int
      syn_path,      # int, values: 0, 1, this shows if current section or it's childrens have synapses,
      X1, Y1, Z1, D1 # int, segment coordinates and diameter
      ...,
      Xn, Yn, Zn, Dn
    ]
    """
    return [
      [
        SEC_SHORT_TYPE_DICT[section.type.name],
        1 if ((section.id if hasattr(section, 'id') else 0) in base_sec_ids) else 0
      ] + np.column_stack((section.points, section.diameters)).reshape(-1).tolist()
      for section
      in nm_sections
    ]

class NumpyAwareJSONEncoder(json.JSONEncoder):
    '''JSON encode numpy instances'''
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def main():
  """
  Generate a JSON files for the connection viewer containing a pair of morphologies, synapses and some metadata

  Arguments:
  * circuit path
  * pathway gids
  * output path

  Output format:
  <pre_mtype>_<post_mtype>.json
  """
  circuit_path = abspath(sys.argv[1])
  pathway_gids_path = abspath(sys.argv[2])
  output_path = abspath(sys.argv[3])

  circuit = Circuit(circuit_path)

  pathway_gids = json.loads(open(pathway_gids_path).read())

  for pre_mtype, post_mtype, pre_gid, post_gid in pathway_gids:
    log.info(f'Reading synapse info')
    log.info(f'PRE_MTYPE: {pre_mtype}, POST_MTYPE: {post_mtype}, PRE_GID: {pre_gid}, POST_GID: {post_gid}')
    syn_props = [
      Synapse.PRE_X_CONTOUR,
      Synapse.PRE_Y_CONTOUR,
      Synapse.PRE_Z_CONTOUR,
      Synapse.TYPE,
      Synapse.PRE_SECTION_ID,
      Synapse.POST_SECTION_ID,
      Synapse.PRE_GID,
      Synapse.POST_GID
    ]
    synapse_ids = circuit.connectome.pair_synapses(pre_gid, post_gid)
    synapses = circuit.connectome.synapse_properties(synapse_ids, syn_props).values.tolist()
    print(synapses)

    log.info(f'Reading pre {pre_mtype} with GID {pre_gid}')
    pre_cell = circuit.cells.get(pre_gid).to_dict()
    pre_morph = circuit.morph.get(pre_gid, transform=True)
    pre_base_sec_ids_raw = [
      [sec.id for sec in pre_morph.section(int(synapse[4])).iter(IterType.upstream)]
      for synapse
      in synapses
    ]
    pre_base_sec_ids = list(set(chain(*pre_base_sec_ids_raw)))
    pre_morph_sections = sec_data([pre_morph.soma]) + sec_data(pre_morph.sections, base_sec_ids=pre_base_sec_ids)

    log.info(f'Reading post {post_mtype} with GID {post_gid}')
    post_cell = circuit.cells.get(post_gid).to_dict()
    post_morph = circuit.morph.get(post_gid, transform=True)
    post_base_sec_ids_raw = [
      [sec.id for sec in post_morph.section(int(synapse[5])).iter(IterType.upstream)]
      for synapse
      in synapses
    ]
    post_base_sec_ids = list(set(chain(*post_base_sec_ids_raw)))
    post_morph_sections = sec_data([post_morph.soma]) + sec_data(post_morph.sections, base_sec_ids=post_base_sec_ids)

    output = {
      'pre': {
        **pre_cell,
        'morph': pre_morph_sections
      },
      'post': {
        **post_cell,
        'morph': post_morph_sections
      },
      'synapses': synapses
    }

    log.info(f'Writing output')
    with open(join(output_path, f'{pre_mtype}-{post_mtype}.json'), 'w') as file:
      json.dump(output, file, cls=NumpyAwareJSONEncoder)

    log.info('.' * 80)


main()
