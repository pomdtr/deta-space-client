#!/bin/bash

DIRNAME=$(dirname "$0")

space-client get apps | jq -r --arg dirname "$DIRNAME" '.apps[] |
{
    title: .name,
    subtitle: .id,
    actions: [
        {
            type: "open",
            target: "https://deta.space/builder/\(.id)"
        }
    ]
}
' | jq --slurp '{
    type: "list",
    items: .
}'
