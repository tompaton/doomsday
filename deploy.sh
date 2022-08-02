#!/bin/bash

npm run build

cp dist/index.html ~/dev/www/sites/tompaton.com/html/pages/doomsday.html
rm ~/dev/www/sites/tompaton.com/html/pages/doomsday/index.*
cp -r dist/doomsday ~/dev/www/sites/tompaton.com/html/pages/

cp dist/index.html ~/dev/www/sites/tompaton.com/updates/pages/doomsday.html
rm ~/dev/www/sites/tompaton.com/updates/pages/doomsday/index.*
cp -r dist/doomsday ~/dev/www/sites/tompaton.com/updates/pages/
