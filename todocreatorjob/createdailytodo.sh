#!/bin/bash

RANDOM_WIKIPAGE=$(curl  -w "%{redirect_url}" -o /dev/null -s "https://en.wikipedia.org/wiki/Special:Random")



JSON_STRING=$( jq -n \
                  --arg wikipageurl "Read $RANDOM_WIKIPAGE" \
                  '{"description": $wikipageurl }' )

echo $JSON_STRING

curl --header "Content-Type: application/json" --request POST --data "$JSON_STRING" $TODO_BACKEND_URL