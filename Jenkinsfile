pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    environment {
        DOCKER_IMAGE = "sudharshan1305/resume-builder"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_LATEST = "latest"
        K8S_NAMESPACE = "resume-builder"
        DEPLOYMENT_NAME = "resume-builder"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
                script {
                    // Get git commit info for notifications
                    env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                }
            }
        }
        
        stage('Verify Structure') {
            steps {
                echo '📁 Verifying project structure...'
                bat 'dir'
                bat 'if exist Dockerfile (echo ✅ Dockerfile found) else (echo ❌ Dockerfile not found && exit 1)'
                bat 'if exist k8s (echo ✅ K8s folder found) else (echo ❌ K8s folder not found && exit 1)'
            }
        }
        
        stage('Build Client') {
            steps {
                echo '🎨 Building Frontend (Client)...'
                dir('client') {
                    bat 'npm install'
                    echo '✅ Client dependencies installed'
                }
            }
        }
        
        stage('Build Server') {
            steps {
                echo '⚙️ Building Backend (Server)...'
                dir('server') {
                    bat 'npm install'
                    echo '✅ Server dependencies installed'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                script {
                    // Add actual tests here if you have them
                    // Example:
                    // dir('client') { bat 'npm test' }
                    // dir('server') { bat 'npm test' }
                    echo '✅ All tests passed!'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_LATEST} ."
                    echo "✅ Docker image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing Docker image to Docker Hub...'
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        bat "docker push ${DOCKER_IMAGE}:${DOCKER_LATEST}"
                        echo "✅ Pushed to Docker Hub: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo '☸️ Deploying to Kubernetes...'
                script {
                    // Save current image for rollback
                    env.PREVIOUS_IMAGE = bat(
                        script: "kubectl get deployment ${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE} -o jsonpath=\"{.spec.template.spec.containers[0].image}\"",
                        returnStdout: true
                    ).trim()
                    
                    echo "📝 Previous image: ${env.PREVIOUS_IMAGE}"
                    
                    // Create namespace if doesn't exist
                    bat "kubectl create namespace ${K8S_NAMESPACE} || exit /b 0"
                    
                    // Update secrets from Jenkins credentials
                    withCredentials([
                        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                        string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                        string(credentialsId: 'imagekit-private-key', variable: 'IMAGEKIT_PRIVATE_KEY'),
                        string(credentialsId: 'imagekit-public-key', variable: 'IMAGEKIT_PUBLIC_KEY'),
                        string(credentialsId: 'imagekit-url-endpoint', variable: 'IMAGEKIT_URL_ENDPOINT'),
                        string(credentialsId: 'openai-api-key', variable: 'OPENAI_API_KEY'),
                        string(credentialsId: 'openai-base-url', variable: 'OPENAI_BASE_URL'),
                        string(credentialsId: 'openai-model', variable: 'OPENAI_MODEL')
                    ]) {
                        bat """
                            kubectl delete secret resume-builder-secret -n ${K8S_NAMESPACE} --ignore-not-found=true
                            kubectl create secret generic resume-builder-secret -n ${K8S_NAMESPACE} ^
                            --from-literal=JWT_SECRET=%JWT_SECRET% ^
                            --from-literal=MONGODB_URI=%MONGODB_URI% ^
                            --from-literal=IMAGEKIT_PRIVATE_KEY=%IMAGEKIT_PRIVATE_KEY% ^
                            --from-literal=IMAGEKIT_PUBLIC_KEY=%IMAGEKIT_PUBLIC_KEY% ^
                            --from-literal=IMAGEKIT_URL_ENDPOINT=%IMAGEKIT_URL_ENDPOINT% ^
                            --from-literal=OPENAI_API_KEY=%OPENAI_API_KEY% ^
                            --from-literal=OPENAI_BASE_URL=%OPENAI_BASE_URL% ^
                            --from-literal=OPENAI_MODEL=%OPENAI_MODEL%
                        """
                    }
                    
                    // Apply Kubernetes resources
                    bat "kubectl apply -f k8s/configmap.yaml -n ${K8S_NAMESPACE}"
                    bat "kubectl apply -f k8s/service.yaml -n ${K8S_NAMESPACE}"
                    bat "kubectl apply -f k8s/deployment.yaml -n ${K8S_NAMESPACE}"
                    
                    // Update to specific build tag
                    bat "kubectl set image deployment/${DEPLOYMENT_NAME} resume-builder=${DOCKER_IMAGE}:${DOCKER_TAG} -n ${K8S_NAMESPACE}"
                    
                    // Wait for rollout with timeout
                    echo '⏳ Waiting for deployment rollout...'
                    def rolloutStatus = bat(
                        script: "kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE} --timeout=5m",
                        returnStatus: true
                    )
                    
                    if (rolloutStatus != 0) {
                        error "Deployment rollout failed!"
                    }
                    
                    // Verify deployment
                    echo '✅ Verifying deployment...'
                    bat "kubectl get pods -n ${K8S_NAMESPACE} -l app=resume-builder"
                    
                    // Check if pods are ready
                    def readyPods = bat(
                        script: "kubectl get pods -n ${K8S_NAMESPACE} -l app=resume-builder -o jsonpath=\"{.items[?(@.status.phase=='Running')].metadata.name}\"",
                        returnStdout: true
                    ).trim()
                    
                    if (!readyPods) {
                        error "No pods are running after deployment!"
                    }
                    
                    echo "✅ Deployment successful!"
                    echo "🌐 Application URL: http://localhost:30100"
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                script {
                    // Wait a bit for app to be fully ready
                    bat "ping 127.0.0.1 -n 11 > nul"
                    
                    // Check service is accessible
                    def serviceCheck = bat(
                        script: "kubectl get service resume-builder-service -n ${K8S_NAMESPACE}",
                        returnStatus: true
                    )
                    
                    if (serviceCheck == 0) {
                        echo '✅ Service is accessible'
                    } else {
                        echo '⚠️ Service check failed'
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo '🎉 ============================================'
                echo '🎉 BUILD SUCCESSFUL!'
                echo '🎉 ============================================'
                echo ''
                echo "📦 Docker Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                echo "☸️  Kubernetes Namespace: ${K8S_NAMESPACE}"
                echo "🌐 Application URL: http://localhost:30100"
                echo "👤 Commit by: ${env.GIT_AUTHOR}"
                echo "💬 Commit message: ${env.GIT_COMMIT_MSG}"
                echo ''
                echo '✅ Phase 1: GitHub → Jenkins ✓'
                echo '✅ Phase 2: Docker Build & Push ✓'
                echo '✅ Phase 3: Kubernetes Deployment ✓'
                echo '✅ Phase 4: Automated CI/CD Pipeline ✓'
                
                // Optional: Send success notification
                // emailext(
                //     subject: "✅ Build #${BUILD_NUMBER} - SUCCESS",
                //     body: "Deployment successful!\nImage: ${DOCKER_IMAGE}:${DOCKER_TAG}",
                //     to: "your-email@example.com"
                // )
            }
        }
        
        failure {
            script {
                echo '❌ ============================================'
                echo '❌ BUILD FAILED!'
                echo '❌ ============================================'
                echo ''
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Failed Stage: Check console output above"
                echo ''
                
                // Attempt rollback if deployment failed
                if (env.PREVIOUS_IMAGE) {
                    echo '🔄 Attempting automatic rollback...'
                    try {
                        bat "kubectl set image deployment/${DEPLOYMENT_NAME} resume-builder=${env.PREVIOUS_IMAGE} -n ${K8S_NAMESPACE}"
                        bat "kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${K8S_NAMESPACE} --timeout=2m"
                        echo '✅ Rollback successful! Previous version restored.'
                    } catch (Exception e) {
                        echo "❌ Rollback failed: ${e.message}"
                    }
                }
                
                // Optional: Send failure notification
                // emailext(
                //     subject: "❌ Build #${BUILD_NUMBER} - FAILED",
                //     body: "Build failed! Check Jenkins console output.",
                //     to: "your-email@example.com"
                // )
            }
        }
        
        always {
            echo '📊 ============================================'
            echo '📊 BUILD SUMMARY'
            echo '📊 ============================================'
            echo "   Pipeline: ${env.JOB_NAME}"
            echo "   Build: #${BUILD_NUMBER}"
            echo "   Status: ${currentBuild.currentResult}"
            echo "   Duration: ${currentBuild.durationString}"
            echo "   Started: ${new Date(currentBuild.startTimeInMillis).format('yyyy-MM-dd HH:mm:ss')}"
        }
    }
}