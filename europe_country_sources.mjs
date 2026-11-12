// European sources catalog v1. DISCOVERY ONLY: this module never calls a provider.
// Source inclusion != permission, working API, live data, timetable coverage or booking.
// Every source requires a separate checked adapter and commercial-use/license review.
export const EUROPE_COUNTRIES=Object.freeze(
 'AL AD AT BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO SM RS SK SI ES SE CH TR UA GB VA BY GE AM AZ'.split(' ')
);
const source=(id,name,url,scope,kind='catalog',access='review_required')=>
 Object.freeze({id,name,url,scope,kind,access,status:'discovery_only'});
export const EUROPE_SOURCE_CATALOG=Object.freeze({
 RO:{transport:[
  source('ro_rail_open_data','Romanian rail timetable data via data.gov.ro','https://data.gov.ro/','national','dataset'),
  source('ro_bilo_evidence','Bilo: documented Romanian rail and bus source attribution','https://bilo.ro/surse-de-date','national','reference'),
  source('ro_rail_infofer','Infofer national rail timetable','https://mersultrenurilor.infofer.ro/','national','operator_website'),
  source('ro_nap_road','Romania transport NAP','https://nap.cnadnr.ro/','national','metadata'),
  source('ro_urban_oracle','Existing Romanian urban GTFS adapter','internal:ro_urban_gtfs','local','existing_adapter')
 ],general:[
  source('ro_open_data','Romanian government public datasets','https://data.gov.ro/','national','catalog'),
  source('ro_pharmacy_registry','Romanian Ministry of Health registered pharmacies','https://ms.gov.ro/ro/informatii-de-interes-public/registre/registrul-farmaciilor/','national','official_register'),
  source('ro_tourism_registry','Romanian authorized tourism and accommodation register','https://se.situr.gov.ro/OpenData/OpenDataMain','national','official_register')
 ]},
 GB:{transport:[
  source('gb_bus_open_data','UK bus open data','https://data.bus-data.dft.gov.uk/','national','dataset'),
  source('gb_tfl','Transport for London Unified API','https://api.tfl.gov.uk/','london','api','existing_adapter'),
  source('gb_national_rail','National Rail data','https://www.nationalrail.co.uk/','national','operator_website')
 ],general:[]},
 FR:{transport:[source('fr_nap','France national transport open-data access point','https://transport.data.gouv.fr/','national','nap')],general:[
  source('fr_open_data','France open data catalog','https://www.data.gouv.fr/','national','catalog')
 ]},
 DE:{transport:[source('de_delfi','DELFI national timetables (GTFS/NeTEx; registration)','https://www.opendata-oepnv.de/ht/en/organisation/delfi/start','national','dataset','registration_required')],general:[]},
 NL:{transport:[source('nl_ndov','NDOV public transport feed (agreement needed)','https://www2.ndovloket.nl/','national','data_feed','agreement_required')],general:[]},
 NO:{transport:[source('no_entur','Entur Journey Planner v3','https://developer.entur.no/docs/open-services/journey-planner','national','api','attribution_required')],general:[]},
 SE:{transport:[source('se_trafiklab','Trafiklab public transport open-data APIs','https://www.trafiklab.se/','national','api','registration_review')],general:[]},
 FI:{transport:[source('fi_digitransit','Digitransit Routing API','https://digitransit.fi/en/developers/apis/','national','api','api_key_required')],general:[]},
 CH:{transport:[source('ch_transportdata','Swiss national public transport GTFS','https://opentransportdata.swiss/en/cookbook/timetable-cookbook/gtfs/','national','dataset')],general:[]},
 AT:{transport:[source('at_mobility_data','Austria transport association open data','https://data.mobilitaetsverbuende.at/de/data-sets','national','dataset')],general:[]},
 ES:{transport:[source('es_transport_hermes','Spanish national transport data discovery (Hermes)','https://datos.gob.es/es/aplicaciones/hermes','national','metadata')],general:[]},
 IT:{transport:[source('it_nap_mmtis','Italian NAP for multimodal transport (NeTEx/SIRI)','https://www.cciss.it/nap/mmtis/public/en/static/multimodal','national','nap')],general:[]},
 IE:{transport:[source('ie_nta_gtfs','Ireland NTA GTFS national schedules','https://data.gov.ie/dataset/nta-gtfs','national','dataset','reuse_terms_review'),
               source('ie_nta_live','Ireland NTA realtime APIs','https://developer.nationaltransport.ie/','national','api','api_key_required')],general:[]},
 BE:{transport:[source('be_rail_open','Belgian national rail timetable data SNCB/NMBS','https://www.belgiantrain.be/en/3rd-party-services/mobility-service-providers/public-data/','national','dataset')],general:[]},
 CZ:{transport:[source('cz_prague_pid','Prague integrated transport GTFS/realtime','https://pid.cz/en/opendata/','prague_region','dataset')],general:[]}
});
export const EUROPE_COMMON_SOURCES=Object.freeze({
 general:[
  source('europeana_culture','Europeana European cultural heritage collections','https://www.europeana.eu/en/apis','europe','api','api_key_required'),
  source('geoapify','Geoapify geocoding and POIs','https://www.geoapify.com/','global','api','existing_adapter_if_configured'),
  source('photon','Photon / OpenStreetMap place search','https://photon.komoot.io/','global','api','existing_adapter'),
  source('tomtom_places','TomTom Places API v3','https://developer.tomtom.com/','global','api','explicit_opt_in')
 ],
 transport:[
  source('eu_nap_directory','European Commission National Access Points directory','https://transport.ec.europa.eu/transport-themes/smart-mobility/road/its-directive-and-action-plan/national-access-points_en','europe','metadata')
 ]
});
export function europeanCountrySources(countryCode){
 const country=String(countryCode||'').toUpperCase();
 if(!EUROPE_COUNTRIES.includes(country))return null;
 const custom=EUROPE_SOURCE_CATALOG[country]||{transport:[],general:[]};
 return {
  country,transport:[...EUROPE_COMMON_SOURCES.transport,...custom.transport],
  general:[...EUROPE_COMMON_SOURCES.general,...custom.general],
  status:'catalog_only',
  note:'Sources require integration, license and coverage validation before requests'
 };
}
export const EUROPE_SOURCE_CATALOG_VERSION=1;
