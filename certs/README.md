# resources

https://www.linuxhelp.com/how-to-install-and-update-openssl-on-ubuntu-16-04/

# Usage

securityc is configured with environmental variables. To properly generate a cert, 4
environmental variables are required. An arbitrary number of certs can be generated,
to properly bundle the inputs per cert, the environmental variables must follow the schema:

```bash
SECURITYC_{APP_NAME}_{ARG_NAME}
```

The prefix `SECURITYC` ensures that there are no collisions with other environmental variables.
The `{APP_NAME}` refers to an application that a cert/private key should be generated for.
The `{ARG_NAME}` refers to an argument that the script needs to generate the cert/private key pair.
The script will be invoked once for each `{APP_NAME}` that has all of the appropriate arguments.

The `{ARG_NAME}`s that must be provided are:

- `COMMON_NAME`
- `CERT_NAME`
- `KEY_NAME`
- `KEY_OUTPUT_PATH`
- `CERT_OUTPUT_PATH`

An example would look like:

```bash
export SECURITYC_SERVER_COMMON_NAME=localhost
export SECURITYC_SERVER_CERT_NAME=server.crt
export SECURITYC_SERVER_KEY_NAME=server.key
export SECURITYC_SERVER_KEY_OUTPUT_PATH=/certs
export SECURITYC_SERVER_CERT_OUTPUT_PATH=/usr/local/share/ca-certificates
```

