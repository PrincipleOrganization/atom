# Atom
REST API app for our IoT platform.

### First time setup

In first time run:

```
npm i
npm run mkdb
```

Then to start mongoDB run:

```
npm run mongo
```

And in another console run:

```
npm run test
```

For production run:

```
npm run start
```

### REST API

##### Get all ports

```
/api/all
```

##### Gel all only opened ports

```
/api/all?onlyOpened=true
```

##### Open port

```
/api/open?port=COM3
```

##### Open port with option

```
/api/open?port=COM3&baudRate=9600&stopBits=1
```

Port configuration options.

* `baudRate` Baud Rate, defaults to 9600. Should be one of: 115200, 57600, 38400, 19200, 9600, 4800, 2400, 1800, 1200, 600, 300, 200, 150, 134, 110, 75, or 50. Custom rates as allowed by hardware is supported. Windows doesn't support custom baud rates.
* `dataBits` Data Bits, defaults to 8. Must be one of: 8, 7, 6, or 5.
* `stopBits` Stop Bits, defaults to 1. Must be one of: 1 or 2.
* `parity` Parity, defaults to 'none'. Must be one of: 'none', 'even', 'mark', 'odd', 'space'
* `rtscts` defaults to false
* `xon` defaults to false
* `xoff` defaults to false
* `xany` defaults to false
* `flowControl` `true` for `rtscts` or an array with one or more of the following strings to enable them `xon`, `xoff`, `xany`, `rtscts`. Overwrites any individual settings.
* `bufferSize` Size of read buffer, defaults to 65536. Must be an integer value.
* `parser` The parser engine to use with read data, defaults to rawPacket strategy which just emits the raw buffer as a "data" event. Can be any function that accepts EventEmitter as first parameter and the raw buffer as the second parameter.
* `platformOptions` - sets platform specific options, see below.

##### Close port

```
/api/close?port=COM2
```

##### Write to port

```
./api/cmd?port=COM3?cmd={specific command}
```

##### Get weight

```
/api/weight?port=COM1&Y=2016&M=5&D=12&h=21&m=35&s=46
```

where:
* 'Y' year
* 'M' month
* 'D' day
* 'h' hour
* 'm' minute
* 's' second
