import sys
import re
import json
import numpy as np
import coloredlogs, logging
from os.path import abspath, join
from itertools import combinations

from bluepy import Circuit, Cell

log = logging.getLogger(__name__)
coloredlogs.install(level='DEBUG')

def np_encoder(object):
  if isinstance(object, np.generic):
    return object.item()

def main():
  """
  Generate a JSON file containing list of gid pairs, one pair for each pathway in a circuit

  Arguments:
  * circuit path
  * output path

  Output format:
  [pre_mtype, post_mtype, pre_gid, post_gid][]
  """
  circuit_path = abspath(sys.argv[1])
  output_path = abspath(sys.argv[2])

  circuit = Circuit(circuit_path)

  mtypes = circuit.cells.mtypes

  mtype_pairs = list(combinations(mtypes, 2))

  output = []

  for pre_mtype, post_mtype in mtype_pairs:
    conn_it = circuit.connectome.iter_connections({ Cell.MTYPE: pre_mtype }, { Cell.MTYPE: post_mtype }, shuffle=True)
    try:
      pre_gid, post_gid = next(conn_it)
      log.info(f'{pre_mtype}-{post_mtype}')
      output.append([pre_mtype, post_mtype, pre_gid, post_gid])
    except:
      log.warning(f'{pre_mtype}-{post_mtype}')

  if len(output) == 0:
    log.error('No pathways found')
    exit(1)

  with open(join(output_path, 'sample_pathway_gids.json'), 'w') as file:
    json.dump(output, file, default=np_encoder)


main()
