#!/bin/bash

MainDir='/var/www/html/apps/'

cd "$MainDir/partyApp" && ng serve &
cd "$MainDir/partyAppBackend" && npm run dev &

wait
echo "All 2 complete"