#!/bin/bash

tsc --target ES2015 ts/main.ts
node ts/main.js
rm ts/main.js