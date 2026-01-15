========================================================
  SSH SETUP - NO PASSWORD NEEDED
========================================================

QUICK START:
-----------

Run this file:
   START-HERE.bat

Enter password ONE TIME:
   12345678

Done! All commands now work without password!


AFTER SETUP:
-----------

These scripts work WITHOUT password:

✓ obnovit-sayt.bat     - update site
✓ vps-logs.bat         - show logs
✓ vps-connect.bat      - connect to VPS
✓ proverit-sayt.bat    - check status


FILES CREATED:
-------------

1. START-HERE.bat           - Main file (English)
2. ZAPUSTIT-SEYCHAS.bat     - Main file (Russian)
3. setup-ssh-simple.bat     - Simple setup
4. setup-ssh-auto.bat       - Auto setup (PowerShell)


MANUAL SETUP (if needed):
-------------------------

Open PowerShell and run these 3 commands:

1. Create key:
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa_vps" -N '""'

2. Copy to VPS (enter password: 12345678):
type "$env:USERPROFILE\.ssh\id_rsa_vps.pub" | ssh root@130.49.213.197 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

3. Test:
ssh -i "$env:USERPROFILE\.ssh\id_rsa_vps" root@130.49.213.197 "echo 'Works!'"


VPS INFO:
--------

IP:       130.49.213.197
Password: 12345678
User:     root


========================================================
  RUN: START-HERE.bat
========================================================
