FROM node:18
WORKDIR /app

RUN apt-get update
RUN apt-get -y install cron

# cron runs scripts in a minimal environment, so we need to set PATH and LD_LIBRARY_PATH, otherwise it won't find the binaries of node, etc.
RUN crontab -l | { cat; echo "PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin"; } | crontab -
RUN crontab -l | { cat; echo "LD_LIBRARY_PATH=/usr/local/lib"; } | crontab -

COPY run.sh ./
# make sure the script is executable
RUN chmod +x /app/run.sh

# run the script (daily), and redirect stdout and stderr (to the docker log)
RUN crontab -l | { cat; echo "0 0 */1 * * bash /app/run.sh > /proc/1/fd/1 2>/proc/1/fd/2"; } | crontab -
CMD ["cron", "-f"]
