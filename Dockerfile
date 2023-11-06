# Use the official Node.js 14 image.
FROM node:14

# Install github-csv-tools globally
RUN npm install -g github-csv-tools

# Set a working directory
WORKDIR /usr/src/app

# Copy the CSV file into the container
COPY your-issues.csv .

# Command to import issues when the container runs.
# TODO: Take the args as runtime arguments
CMD githubCsvTools -t <insert token> -o <insert username or orgname> -r <just the repo name or org/reponame no https or no .git> your-issues.csv
