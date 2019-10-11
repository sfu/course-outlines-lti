@app
course-outlines-lti-arc


@http
post /launch

@static


# Uncomment the following lines to deploy
# 'bucket' must be in the same region as 'region' (e.g. us-west-1)
@aws
timeout 30
# region us-west-1
# bucket your-private-deploy-bucket
