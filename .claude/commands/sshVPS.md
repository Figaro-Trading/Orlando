# SSH VPS

Exécute des commandes sur le VPS Contabo via SSH.

## Configuration SSH
- **Host alias:** `contabo`
- **IP:** 185.190.140.7
- **Port:** 58080
- **User:** root
- **Key:** ~/.ssh/Figaro-Contabo
- **Hostname:** vmi2972159.contaboserver.net

## Répertoire de déploiement
- **Application:** `/opt/orlando`

## Commandes utiles

### Logs des containers
```bash
# Logs d'un container (dernières 5 min)
ssh contabo "docker logs orlando-app-1 --since 5m 2>&1"

# Logs avec filtre erreurs
ssh contabo "docker logs orlando-app-1 --since 1h 2>&1 | grep -i 'ERROR\|WARN'"
```

### Status containers
```bash
ssh contabo "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.RunningFor}}' | grep orlando"
```

### Espace disque
```bash
ssh contabo "df -h"
```

### Restart services
```bash
ssh contabo "cd /opt/orlando && docker compose restart"
```

## Argument $ARGUMENTS

Si l'utilisateur fournit une commande spécifique, l'exécuter directement :
```bash
ssh contabo "$ARGUMENTS"
```

Si aucun argument, demander quelle commande exécuter ou proposer les options courantes.
