import csv

"""
Should have a final csv with the following columns

ad 11
ed 12
IN-PLAY 14
Candidate 20
Count 21

ed | Kathy C. Hochul | Jumaane Williams

only considering ed's with IN PLAY in column O

"""

tally = dict()


PROG = [
"Absentee / Military"
]

EST = [
"Public Counter",
]
candidates = PROG + EST
with open('./raw/2020/CURATED/2020-congressional.csv', newline='') as csvfile:
  reader = csv.reader(csvfile)  
  for row in reader:
    # print(row[11], row[12], row[14], row[20], row[21])
    election_district = "%s%s" % (row[11], row[12])
    is_in_play = row[14] == "IN-PLAY"
    candidate=row[20]
    count=row[21]

    if is_in_play and candidate in candidates:

      if election_district not in tally:
        tally[election_district] = dict(ed=election_district, )

      tally[election_district][candidate] = count

for ed in tally.keys():
  # print([int(tally[ed][prog]) for prog in PROG])
  progressives = sum([int(0 if prog not in tally[ed] else tally[ed][prog]) for prog in PROG])
  others = sum([int(0 if est not in tally[ed] else tally[ed][est]) for est in EST])

  total = progressives + others
  vote_share = float(progressives)/total if total > 0 else 0

  tally[ed]["total"] = total
  tally[ed]["share"] = vote_share


with open("./output-csv/2020-congressional-absentee.csv", 'w', newline='') as outcsv:
  hwrite = csv.writer(outcsv)
  header = ['ed'] + candidates + ["total", "share"]
  hwrite.writerow(header)

  writer = csv.DictWriter(outcsv, fieldnames = header)
  writer.writerows(tally.values())


print(tally.values())

  


