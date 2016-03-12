import re
import sys
import codecs
import csv
import json

fieldnames = ['entry', 'defid', 'word', 'author', 'definition', 'example', 'thumbs_up', 'thumbs_down']

db_file = sys.argv[1]
db_processed_file = db_file + '.processed'
csv_file = sys.argv[2]

# Make sure readline will work properly by removing unicode line breaks
with codecs.open(db_file, 'r', encoding='utf-8') as f:
    with codecs.open(db_processed_file, 'w', encoding='utf8') as out:
        for line in f:
            if line[-1] != '\n':
                out.write(line[:-1].strip())
            else:
                out.write(line.strip() + '\n')


with codecs.open(db_processed_file, 'r', encoding='utf-8') as f:
    with codecs.open(csv_file, 'w', encoding='utf8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for line in f:
            data = json.loads(line)
            if not 'entry' in data:
                continue
            entry = data['entry']
            for d in data['definitions']:
                writer.writerow({
                    'entry': entry,
                    'defid': d['defid'],
                    'word': d['word'],
                    'author': d['author'],
                    'definition': d['definition'],
                    'example': d['example'],
                    'thumbs_up': d['thumbs_up'],
                    'thumbs_down': d['thumbs_down'],
                })
