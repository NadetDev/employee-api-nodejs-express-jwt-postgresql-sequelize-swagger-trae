# Script PowerShell pour déployer sur Minikube

# Vérifier si Minikube est en cours d'exécution
try {
    $minikubeStatus = minikube status | Out-String
    if (-not $minikubeStatus.Contains("host: Running")) {
        throw "Minikube n'est pas en cours d'exécution"
    }
    Write-Host "Minikube est déjà en cours d'exécution" -ForegroundColor Green
} catch {
    Write-Host "Démarrage de Minikube..." -ForegroundColor Yellow
    minikube start
    minikube addons enable ingress
}

# Créer le namespace s'il n'existe pas
Write-Host "Création du namespace employee-api..." -ForegroundColor Yellow
kubectl create namespace employee-api --dry-run=client -o yaml | kubectl apply -f -

# Créer les secrets
Write-Host "Création des secrets..." -ForegroundColor Yellow
kubectl create secret generic employee-api-secrets `
  --namespace=employee-api `
  --from-literal=DB_PASSWORD=P@ssword0123 `
  --from-literal=JWT_SECRET=votre_secret_jwt `
  --dry-run=client -o yaml | kubectl apply -f -

# Appliquer les configurations Kubernetes
Write-Host "Application des configurations Kubernetes..." -ForegroundColor Yellow
kubectl apply -f k8s/

# Attendre que les pods soient prêts
Write-Host "Attente du déploiement de la base de données..." -ForegroundColor Yellow
kubectl rollout status deployment/postgres -n employee-api --timeout=180s

Write-Host "Attente du déploiement de l'API..." -ForegroundColor Yellow
kubectl rollout status deployment/employee-api -n employee-api --timeout=180s

# Afficher l'URL du service
Write-Host "`nURL de l'application:" -ForegroundColor Green
minikube service employee-api -n employee-api --url

# Ajouter l'entrée dans le fichier hosts pour l'ingress
$minikubeIp = minikube ip
Write-Host "`nPour utiliser l'ingress, ajoutez cette ligne à votre fichier C:\Windows\System32\drivers\etc\hosts:" -ForegroundColor Yellow
Write-Host "$minikubeIp employee-api.local" -ForegroundColor Cyan

Write-Host "`nDéploiement terminé avec succès!" -ForegroundColor Green