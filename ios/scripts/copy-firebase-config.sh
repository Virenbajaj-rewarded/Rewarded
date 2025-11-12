#!/bin/bash

# Script to copy the appropriate GoogleService-Info.plist based on the configuration

PLIST_DESTINATION="${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
FIREBASE_DIR="${SRCROOT}/Firebase"

# Prefer ENVFILE if provided (e.g. ENVFILE=.env.staging)
if [[ -n "${ENVFILE}" ]]; then
    case "${ENVFILE}" in
        *.env.production*|*.env.prod*)
            FIREBASE_CONFIG="Production"
            ;;
        *.env.staging*)
            FIREBASE_CONFIG="Staging"
            ;;
        *)
            FIREBASE_CONFIG="Development"
            ;;
    esac
fi

# Fallback to CONFIGURATION when ENVFILE is not set
if [[ -z "${FIREBASE_CONFIG}" ]]; then
    case "${CONFIGURATION}" in
        *Staging*|*Stage*)
            FIREBASE_CONFIG="Staging"
            ;;
        *Release*|*Production*|*Prod*)
            FIREBASE_CONFIG="Production"
            ;;
        *)
            FIREBASE_CONFIG="Development"
            ;;
    esac
fi

PLIST_SOURCE="${FIREBASE_DIR}/${FIREBASE_CONFIG}/GoogleService-Info.plist"

# Check if source file exists
if [ ! -f "$PLIST_SOURCE" ]; then
    echo "error: Firebase config file not found at ${PLIST_SOURCE}"
    exit 1
fi

echo "Using Firebase config: ${FIREBASE_CONFIG} (CONFIGURATION=${CONFIGURATION}, ENVFILE=${ENVFILE})"

# Copy to project root for build
cp "${PLIST_SOURCE}" "${SRCROOT}/GoogleService-Info.plist"

echo "Copied ${FIREBASE_CONFIG}/GoogleService-Info.plist to project root"

# Also copy to the app bundle if the directory exists
if [ -d "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app" ]; then
    cp "${PLIST_SOURCE}" "${PLIST_DESTINATION}"
    echo "Copied ${FIREBASE_CONFIG}/GoogleService-Info.plist to app bundle"
fi

