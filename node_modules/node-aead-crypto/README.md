# node-aead-crypto
OpenSSL bindings for AEAD ciphers

## Supported ciphers
* AES-CCM
* AES-GCM

This package is based on code from https://github.com/spark/node-aes-ccm and https://github.com/xorbit/node-aes-gcm.
I've updated both to compile on Windows machines and included configuration to automatically precompile binaries for multiple platforms (Windows, Linux, OSX, ARM).

## Usage
TODO

## Changelog

### 1.0.5
* (AlCalzone) Fixed installation issues on RPi 1

### 1.0.4
* (AlCalzone) Fixed installation issues on RPi 1

### 1.0.3
* (AlCalzone) Drop Node 7 from precompilation, add Node 9

### 1.0.2
* (AlCalzone) fixed typescript definitions

### 1.0.0
* (AlCalzone) initial release
