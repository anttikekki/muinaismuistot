CREATE TABLE feature_details (
  source_layer TEXT NOT NULL,
  feature_id INTEGER NOT NULL,
  logical_layer_id TEXT NOT NULL,
  registry_id TEXT,
  name TEXT,
  municipality TEXT,
  properties_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (source_layer, feature_id)
) WITHOUT ROWID;

CREATE INDEX feature_details_registry ON feature_details(logical_layer_id, registry_id);
