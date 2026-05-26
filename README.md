# Personal Portfolio — Containerized Deployment on GCP

## 🚀 Live Demo
🌐 [varadnagapurkar.me](https://varadnagapurkar.me)

## 📌 What This Project Does
Personal portfolio website deployed on Google Cloud Platform 
using containerization — not just hosted, but properly 
deployed like a production application.

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Containerization | Podman |
| Cloud Infrastructure | GCP (Virtual Machine) |
| Domain | Custom .me domain |

## 🏗️ Architecture
Browser → Custom Domain (.me) → GCP VM → Podman Container → Portfolio App

## ⚙️ Deployment Process
1. Built portfolio using HTML/CSS/JS
2. Provisioned GCP VM instance
3. Containerized app using Podman
4. Launched container on GCP VM
5. Mapped custom .me domain to VM public IP

## 💡 Key Learnings
- Cloud VM provisioning on GCP
- Container deployment using Podman
- Domain DNS configuration
- Production deployment workflow
