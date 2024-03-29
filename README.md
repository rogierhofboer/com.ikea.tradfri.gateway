# IKEA Tradfri Gateway

Homey App for the IKEA Tradfri Gateway


**Important:** When running from source, first issue an:

`npm install --target_arch=arm --target_platform=linux`

to retrieve all dependent modules and build them for ARM linux if needed.



Thanks to AlCalzone for creating node-tradfri-client 
https://github.com/AlCalzone/node-tradfri-client

Thanks to Robert Klep for answering my questions on slack and making homey-app-upload
https://github.com/robertklep/homey-app-upload

Thanks to Espen Ljosland for adding group support and migrating to SDK v3

Thanks to Sven ten Raa for adding wall socket support

Thanks to lvhv91 for adding blinds support

Thanks to Vegard Fladby for adding Norwegian translations

Thanks to Anders Jansson for fixing a restart / reconnect bug

Thanks to Johan Bendz for adding Swedish translations

Thanks to Kjetil Haugland for adding the new scene support



## TODO 
- Support renaming of devices (so Tradfri Gateway device names and Homey device names stay in sync)
- Translation of texts (at least EN and NL)

## License
The MIT License (MIT)

Copyright 2018-2023 Rogier Hofboer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
