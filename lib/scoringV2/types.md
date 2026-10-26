# Scoring v2 answers

All scoring APIs accept a complete answer object and reject invalid inputs without coercion.

```js
{
  route: "old", // "old" or "new"
  interests: { "INT-01": "A", /* every INT-01..INT-08: A..D */ },
  skills: { "SKL-01": 1, /* every SKL-01..SKL-15: integer 1..5 */ },
  certificates: [], // 0..3 distinct CER-01..CER-13; [] = None yet
  gwa: 74.99, // finite number 0..100 inclusive; never rounded
  old: { strand: "STR-04", subjects: ["ACA-01"] },
  // Required instead of old when route === "new":
  // new: { electives: [], bestSubjects: ["COR-01"] }
}
```

Old subjects: 1..3 distinct ACA IDs. All ten STR IDs are accepted, including
STR-04 (Academic GAS, unlinked). New electives: 0..3 distinct scored ELE IDs;
[] means Not sure yet / None. Core subjects (internal bestSubjects): 1..3
 distinct COR-01..COR-04 IDs only. Elective cards are not core choices.
Work Immersion and display sentinel IDs are not canonical answers. There is
no cluster field or award. New academic maximum is 21 (total 43); old remains
16 (total 38). New academic = 4 per matched elective + 3 for the linked core
subject + GWA bonus once if an elective or core subject matches.

Only the active route block is required. If the inactive block is supplied it
must also be valid, but does not affect scores or the hash. Root metadata
(including name, avatar, grade level, school) is ignored, never hashed or
returned by canonicalization. Unknown keys inside scoring blocks/maps are
rejected; the root permits metadata. Inputs are never mutated.

validateAnswers returns { valid, errors: [{ code, path, message }] }.
assertValidAnswers throws AnswerValidationError with code INVALID_ANSWERS and
the same errors. Codes: REQUIRED, TYPE, UNKNOWN_ID, UNKNOWN_KEY, RANGE,
INTEGER, COUNT, DUPLICATE. Invalid route values use RANGE.

Canonical hashing projects only route, complete interests/skills, certificates,
GWA tier bonus, and the active route block. The rubric specifies the GWA tier
in the seed, so raw grades in the same tier share a seed. All object keys and
all selection arrays are sorted by Unicode code units before JSON.stringify;
UTF-8 encoding and lowercase hexadecimal SHA-256 are used. Hash ordering is
ascending SHA-256(seedHex + courseId); no delimiter. Metadata and inactive
route answers cannot change the seed. Numeric GWA is retained in witnesses.
