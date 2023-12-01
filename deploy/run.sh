#!/bin/sh -x

cd /app

git clone https://github.com/laczbali/crawl-ski
cd crawl-ski
npm install
npx tsc
cd ..

node crawl-ski/bin/index.js $1 #  pass 'debug' as first param to enable debug mode 

rm -rf crawl-ski
