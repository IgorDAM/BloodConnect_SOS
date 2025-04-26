-- Índices espaciales
INSERT INTO USER_SDO_GEOM_METADATA VALUES (
  'DONORS',
  'GEO_LOCATION',
  SDO_DIM_ARRAY(
    SDO_DIM_ELEMENT('X', -180, 180, 0.005),
    SDO_DIM_ELEMENT('Y', -90, 90, 0.005)
  ),
  4326
);

CREATE INDEX donors_geo_idx ON donors(geo_location) INDEXTYPE IS MDSYS.SPATIAL_INDEX;