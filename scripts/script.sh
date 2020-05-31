#!/bin/bash

num=5
if [ ! -z $1 ] ; then
  num=$1
fi

theAuthor="NodeConf"

counter=1
while [ $counter -le $num ] ; do
  Data="{\"author\":\"$theAuthor\",\"task\": \"Task $counter\"}"
  curl -X POST -H 'Content-Type: application/json' -d "$Data" http://localhost:30555/api
  ((counter++))
done
