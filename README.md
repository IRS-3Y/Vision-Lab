### VisionLab

---

## SECTION 1 : PROJECT TITLE
## VisionLab

---

## SECTION 2 : EXECUTIVE SUMMARY / PAPER ABSTRACT
TODO

---

## SECTION 3 : CREDITS / PROJECT CONTRIBUTION

| Official Full Name  | Student ID (MTech Applicable)  | Work Items (Who Did What) | Email (Optional) |
| :------------ |:---------------:| :-----| :-----|
| YU Yu | A0213495A |Overall system implementation and validation, project management and documentation | e0508596@u.nus.edu |
| YANG Lu Yi | A0213477A |Overall system design, modelling, use case & algorithm design, system implementation | e0508578@u.nus.edu |
| YIN TianShi | A0213511Y |Overall system design, modelling, technical architecture design, system implementation | e0508612@u.nus.edu |

---

## SECTION 4 : VIDEO OF SYSTEM MODELLING & USE CASE DEMO
TODO

---

## SECTION 5 : USER GUIDE

`Refer to appendix <Installation & User Guide> in project report at Github Folder: ProjectReport`

### Installation on Linux (recommended)
- Make sure [docker & docker-compose](https://docs.docker.com/install/) has been installed on local system.
- Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker) (to enable GPU support for application running in Docker).
- Download [vlab-compose.yml](https://github.com/IRS-3Y/Vision-Lab/blob/master/SystemCode/vlab-compose.yml) to a local directory.
- Open a command shell, go to the local directory where vlab-compose.yml has been downloaded, and execute below command:
```
docker-compose -p vlab -f vlab-compose.yml up -d
```
VisionLab application is now running and available on http://localhost

To shutdown the application, execute below command:
```
docker-compose -p vlab -f vlab-compose.yml down -v
```

### Installation on Windows
Follow the same steps as above except that, for Windows, use a different Docker Compose file [vlab-compose-windows.yml](https://github.com/IRS-3Y/Vision-Lab/blob/master/SystemCode/vlab-compose-windows.yml).

NVIDIA Container Toolkit is not available for Windows machine. Without NVIDIA GPU support in Docker, certain features (e.g. StyleGAN models and training pipelines) will be disabled in the deployed application, while other parts of the application can still perform normally.

To have full application running on Windows, follow instructions in User Guide to start a local backend process running directly on hosting Windows machine.


---

## SECTION 6 : PROJECT REPORT / PAPER

`Refer to project report at Github Folder: ProjectReport`

---

## SECTION 7 : MISCELLANEOUS

`Refer to Github Folder: Miscellaneous`

---

