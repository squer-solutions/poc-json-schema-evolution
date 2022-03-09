# Kafka docker for ARM (Mac M1) machines
This is not a permanent fix. Ideally confluent/bitnami update their iamges to work on ARM based machines natively. Sadly according to this https://github.com/confluentinc/common-docker/issues/117 this could take a little time.

## Problems experienced while running AMD images on Mac M1
All AMD based images tried had similar issues. They did work sometimes but not consistent (meaning starting those containers worked 50% of the time).
All containers had occasional issues that they were stuck in an endless loop (```docker stats``` revealed that a container would utilize 100% cpu but ```docker logs``` on that container would indicate no progress)

The performance was extremely poor (Startup took 60 sec instead of 5 sec for the ARM images)

The startup order (which cannot be really controlled with docker compose ```depends_on```) was also considered as a source of issues, however after starting containers with a wait-for script I do not think this was causing issues.
