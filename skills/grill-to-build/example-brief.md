# Brief
Build ADSS as blog.daana.dev describes it.

## Stack
- landing zone: Azure blob, bfdatalake/raw/adss/das
- platform: Snowflake, bf_sandbox
- destination: Snowsight, role ADSS_SANDBOX_ROLE
- auth: local and interactive — az cli and snow cli, device code. There is
  no non-interactive credential, so CI cannot reach either. Snowflake's own
  read access to the blob is a separate credential again, and I do not have
  it yet.

## Sources
- https://blog.daana.dev/blog/design-of-analytical-systems
- https://blog.daana.dev/blog/from-business-question-to-prototype-in-hours
- https://blog.daana.dev/blog/contract-driven-data-transformation
- https://blog.daana.dev/blog/anatomy-of-business-question

Those four in full, yourself. The rest of the blog, one post each.

## Layers
- DAS: dlt, one pipeline per contract, parquet in the landing zone,
  unpacked into the target platform as views. Schemas: das__raw,
  das__staged.
- DAB: daana-cli focal model, dab/model.yaml the only place the data is
  explained. Schemas: dab, dab__stage, dab__meta.
- DAR: Puppini's Unified Star Schema, generated. Schema: dar__uss.

daana-cli is on this repository's binaries branch. Copy it into the tree.

A folder per layer, plus one for the destinations.

## Slices
A slice answers one business question, in the sense the blog defines
one. Destinations read dar only.

Every slice ends in a destination that presents its question and the
answer. It is the prototype, not a report generated afterwards.

## Deliverables
- The domain model, which does not restate dab/model.yaml.
- A skill per layer, a skill per destination, and one for the whole.
