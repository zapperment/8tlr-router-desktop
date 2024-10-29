![Eight Track LR Logo](./src/images/8tlr-logo.png)

# Eight Track LR Router

_Routes MIDI messages from Ableton Live to Reason_

This is the desktop app version. There is also a
[command line client version](https://github.com/zapperment/8tlr-router).

**Note:** This is an app exclusively for Macs, there is no Windows version!

## Getting started

### MIDI setup

The idea of this project is to use eight tracks in the Ableton Live session view to control up to 64 devices in the
Reason rack independently.

To make this work, you have to use the macOS app _Audio MIDI Setup_ to configure five new IAC ports. One port is used to
send MIDI messages from Live to _8tlr-router_, four ports are used to send MIDI messages from _8tl-router_ to Reason.

![Screenshot: MIDI Studio with MIDI ports set up](docs/midi-studio.png)

### Configuration file

After adding the ports using the _MIDI Studio_ in the _Audio MIDI Setup_ app, create a configuration file called
_8tlr-router.config.yaml_, either in your home directory, or whereever you are planning to run the _8tlr-router_.

The config file should define your MIDI ports like so:

```
---
portName:
  input: IAC Live to Router
  output:
    - IAC Router to Reason 1
    - IAC Router to Reason 2
    - IAC Router to Reason 3
    - IAC Router to Reason 4
```

### Download and installation

Download the latest version on the [release page](https://github.com/zapperment/8tlr-router-desktop/releases/).

Unzip and move the app contained in the zip file to your applications folder.
