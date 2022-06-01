import sys
import re
import json
import coloredlogs, logging
from os.path import abspath, join, isfile
from os import listdir

import msgpack


log = logging.getLogger(__name__)
coloredlogs.install(level='DEBUG')


def encode_file(file_path):
  log.info(f'Encoding {file_path}')
  with open(file_path, 'r') as f:
    data = json.load(f)

  encoded_data = msgpack.packb(data, use_single_float=True)

  encoded_file_path = re.match('(.*)\.json', file_path).groups()[0] + '.msgpack'

  with open(encoded_file_path, 'w+b') as f:
    f.write(encoded_data)

def main():
  """
  Encode JSON file(s) with Msgpack

  Arguments:
  * Path for a JSON file or a folder containing JSON files
  """
  input_path = abspath(sys.argv[1])

  if isfile(input_path):
    return encode_file(input_path)

  for file_name in listdir(input_path):
    if not re.match('.*\.json$', file_name):
      continue

    encode_file(join(input_path, file_name))

if __name__ == '__main__':
  main()
