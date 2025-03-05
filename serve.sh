#!/bin/sh
# Serve main app and Storybook simultaneously

# Serve main React app
serve -s dist -l 5000 &

# Serve Storybook
serve -s storybook-static -l 6006 &

# Keep container running
wait