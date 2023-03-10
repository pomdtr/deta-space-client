#!/bin/bash

space-client get apps | jq -r '.apps[] |
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
