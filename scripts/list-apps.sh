#!/bin/bash

space-client get instances | jq -r '.instances[] |
{
    title: .release.app_name,
    subtitle: .release.channel,
    actions: [
        {
            type: "open",
            target: .url
        }
    ]
}
' | jq --slurp '{
    type: "list",
    items: .
}'
