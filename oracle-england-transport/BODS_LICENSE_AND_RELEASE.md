# England BODS GTFS: licensing and no-copy activation gate

The current nine BODS regional feeds have been compacted, fully compared and tested with isolated Node/HTTP route planning. As of 2026-11-16, the live England container has **not** been switched to the compact data. This is local bus timetable coverage only, not proof of cross-region, all-route, rail or real-time journeys.

The public DfT transport-data catalogue identifies BODS downloadable timetable data as Open Government Licence (OGL) and updated daily. The DfT guide requires consumer attribution to BODS, and the application must not imply DfT endorsement.

Suggested text for the app's Sources / About pane:

> Orarul autobuzelor din Anglia utilizează date publicate prin Bus Open Data Service (BODS), Department for Transport, disponibile sub Open Government Licence v3.0. Orele sunt programate, nu garantate în timp real. Eva nu este aprobată sau afiliată oficial cu Department for Transport.

Official sources: https://findtransportdata.dft.gov.uk/dataset/bus-open-data---download-all-timetable-data--18335fb19c4 ; https://www.gov.uk/government/publications/bus-open-data-implementation-guide/bus-open-data-implementation-guide ; https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/.

Candidate staging: the shell tool stage-england-zero-copy-candidate.sh uses hardlinks to put all nine compact pairs in /home/ubuntu/pocketai-england-candidate/feeds, without duplicating the 8.44 GiB or modifying /home/ubuntu/pocketai-england/feeds. It changes only COMPACT PILOT file group to 10001 and mode to 0640; the original 11.19 GiB audit remains unchanged. The candidate directory is private to UID 10001, and a non-networked disposable Docker image tests the same UID's real read access to all nine SQLite files and indexes. Hardlinks share inodes: never write to or replace them in place. On a failed staging, do not erase partial data automatically; inspect before resuming.

Further production gates: actual source age per region and calendar span, visible attribution in app, private test of the actual runtime image, authorisation and rollback, regional boundary journey checks and test from Cloudflare Worker + APK. Changing the active England container or any credentials is outside this staging script.
