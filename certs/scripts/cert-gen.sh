#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

verbose=false
while [[ "$#" > 0 ]]; do case $1 in
  -v|--verbose) verbose=true;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done


# export SECURITYC_SERVER_COMMON_NAME=localhost
# export SECURITYC_SERVER_CERT_NAME=server.crt
# export SECURITYC_SERVER_KEY_NAME=server.key
# export SECURITYC_SERVER_KEY_OUTPUT_PATH=$PWD/testo
# export SECURITYC_SERVER_CERT_OUTPUT_PATH=$PWD/testo

# get the input env vars
input=`env | grep SECURITYC`

if [ $verbose = true ]; then
    echo
    echo "input:"
    echo "$input"
fi

# split the env vars by = then split by _
# and grap the app name
awk_cmd='{ split($1,var_names,"="); split(var_names[1],app_names,"_"); print app_names[2]}'

apps=`echo "$input" | \
    awk "$awk_cmd" \
    | sort -u`

if [ $verbose = true ]; then
    echo
    echo "apps:"
    echo "$apps"
    echo
fi

function parse_env_config() {
    # string interpolate the name of the env var
    local var="SECURITYC_${1}_${2}"
    # get the value of the env var itself
    # see https://www.tldp.org/LDP/abs/html/abs-guide.html#IVR
    local result=$(eval "echo \$$(echo $var)")
    echo "$result"
}

# run gen.sh for each set of args
for app in $apps; do
    # get the environmental variable values
    arg_common_name=$(parse_env_config ${app} "COMMON_NAME")
    arg_cert_name=$(parse_env_config ${app} "CERT_NAME")
    arg_key_name=$(parse_env_config ${app} "KEY_NAME")
    arg_cert_output_path=$(parse_env_config ${app} "CERT_OUTPUT_PATH")
    arg_key_output_path=$(parse_env_config ${app} "KEY_OUTPUT_PATH")


    # be explicit and check if any of the values are not set
    if [ "$arg_common_name" == "" ] \
        || [ "$arg_cert_name" == "" ] \
        || [ "$arg_key_name" == "" ] \
        || [ "$arg_cert_output_path" == "" ] \
        || [ "$arg_key_output_path" == "" ]; then
        echo "Missing argument for $app"
        echo "cert name: $arg_cert_name"
        echo "key name: $arg_key_name"
        echo "common name: $arg_common_name"
        echo "cert output path: $arg_cert_output_path"
        echo "key output path: $arg_key_output_path"
        echo "skipping certificate generation"
        echo
    else
        # build the script arguments
        script_args="-c ${arg_cert_name} -cn ${arg_common_name} -k ${arg_key_name} \
            -oc ${arg_cert_output_path} -ok ${arg_key_output_path}"
        if [ $verbose = true ]; then
            # append verbose flag if verbose is true
            echo "successfully parsed all arguments"
            script_args="${script_args} -v"
            echo
            echo "calling $DIR/gen.sh ${script_args}"
            echo
        fi
        # invoke the script
        $DIR/gen.sh ${script_args}
    fi
done
