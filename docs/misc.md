## Timezone
please set TZ envirment "UTC", becase Mysql times all is UTC.

the server timezone alse UTC.

for example

the api response is below:
``` json
{
    "time": "2020-01-31T17:00:00.000Z"
}
```

the `Z` mean UTC time.

then frontend use this utc time to parse local time.