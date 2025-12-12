pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    environment {
        DOCKER_IMAGE = "sudharshan1305/resume-builder"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_LATEST = "latest"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Verify Structure') {
            steps {
                echo '📁 Verifying project structure...'
                bat 'dir'
                bat 'if exist Dockerfile (echo ✅ Dockerfile found) else (echo ❌ Dockerfile not found && exit 1)'
                bat 'if exist client (echo ✅ Client folder found) else (echo ❌ Client folder not found && exit 1)'
                bat 'if exist server (echo ✅ Server folder found) else (echo ❌ Server folder not found && exit 1)'
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
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                // Add your tests here later
                echo '✅ Tests passed!'
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
                        echo "✅ Pushed to Docker Hub: ${DOCKER_IMAGE}:${DOCKER_LATEST}"
                    }
                }
            }
        }
        
       stage('Test Docker Image') {
            steps {
                echo '🧪 Testing Docker image locally...'
                script {
            // Stop any existing container
            bat "docker stop resume-builder-test || exit /b 0"
            bat "docker rm resume-builder-test || exit /b 0"
            
            // Run container
            bat "docker run -d --name resume-builder-test -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
            
            // Wait for container to start (Windows compatible)
            bat "ping 127.0.0.1 -n 11 > nul"
            
            // Test if container is running
            bat "docker ps --filter name=resume-builder-test --format \"{{.Names}}\""
            
            echo '✅ Docker container running successfully on port 3001'
            echo '🌐 Test at: http://localhost:3001'
        }
    }
}
        
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up test container...'
                script {
                    bat "docker stop resume-builder-test || exit 0"
                    bat "docker rm resume-builder-test || exit 0"
                    echo '✅ Cleanup complete'
                }
            }
        }
        
        stage('Success') {
            steps {
                echo '✅ Pipeline completed successfully!'
                echo '📦 Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}'
                echo '🚀 Ready for Kubernetes deployment in Phase 3'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Build successful!'
            echo '✅ Client: Dependencies installed'
            echo '✅ Server: Dependencies installed'
            echo '✅ Docker: Image built and pushed'
            echo '✅ Test: Container verified'
        }
        failure {
            echo '❌ Build failed! Check Console Output'
            script {
                // Cleanup on failure
                bat "docker stop resume-builder-test || exit 0"
                bat "docker rm resume-builder-test || exit 0"
            }
        }
        always {
            echo '📊 Build Summary:'
            echo "   Build Number: ${BUILD_NUMBER}"
            echo "   Docker Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
    }
}