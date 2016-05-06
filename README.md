# shaktiman

![](https://upload.wikimedia.org/wikipedia/en/7/7e/SHAKTIMAAN.gif)

Extract [OpenStreetMap](https://www.openstreetmap.org/#map=15/3.0201/101.2487) data using the [Overpass API](http://overpass-turbo.eu/s/g2W) and create a custom [Mapbox Studio tileset](https://www.mapbox.com/mapbox-studio/) in a single action.

# Usage

1. `git clone https://github.com/geohacker/shaktiman.git`
2. `cd shaktiman`
3. `npm link`
4. `shaktiman --query path/to/query --MapboxAccessToken secret_token --mapid username.id --name layername`

* _MapboxAccessToken must be a secret token with uploads:write permission_
* _[Queries](http://wiki.openstreetmap.org/wiki/Overpass_API#Simple_usage_examples) are either Overpass XML or Overpass QL style. See examples [in utils.](https://github.com/geohacker/shaktiman/tree/master/util)_
