# shaktiman

Extract OSM data from Overpass and create Mapbox Tilesets

# Usage

1. `git clone https://github.com/geohacker/shaktiman.git`
2. `cd shaktiman`
3. `npm link`
4. `shaktiman --query path/to/query --MapboxAccessToken secret_token --mapid username.id`

* _MapboxAccessToken must be a secret token with uploads:write permission_
* _[Queries](http://wiki.openstreetmap.org/wiki/Overpass_API#Simple_usage_examples) are either Overpass XML or Overpass QL style. See examples [in utils.](https://github.com/geohacker/shaktiman/tree/master/util)_