# CTF Admin Platform - GDSC EEC

This is the Admin Panel site for [GDSC EEC CTF Website](https://github.com/bhaaratkrishnan/gdsc-eec-ctf). The platform helps the administrator to add new domains and challenges along with the flags for respective solutions. It also gives update and delete feature for domain and challenges.

## Technologies Used
- Sveltekit
- TailwindCSS 
- Svelte ShadcnUI 
- Firebase
- Google Cloud Run

## Preview
#### Login Page
![Login page](/static/images/loginPage.png)

#### Admin Page
![Admin page](/static/images/homePage.png)

## Development
Use the `.env.example` file for creating `.env` containing the firebase configuration for the application.

Start the development server
```bash
npm run dev
```
Production build
```bash
npm run build
```
## Deployment to Google Cloud Run

Make sure to define the environment variables in Dockerfile
```bash
export $project_id=<your-project-id-here>

export DOCKER_URL=us-central1-docker.pkg.dev/${project_id}/gdsc-eec-ctf/gdsc-eec-ctf-admin-website

docker build -t $DOCKER_URL .

docker push $DOCKER_URL

gcloud run deploy gdsc-eec-ctf-admin-website --image=$DOCKER_URL --allow-unauthenticated --port=3000 --platform=managed --max-instances=10 --region=us-central1
```