### VisionLab

---

## SECTION 1 : PROJECT TITLE
## VisionLab

---

## SECTION 2 : EXECUTIVE SUMMARY / PAPER ABSTRACT
In the early stage of overall system design, we did a lot investigation and practical trials on model trainings with different deep learning algorithms. In order to make learnt technical knowledge into practice well, we designed an intelligent we system named “VisionLab”, which including Images Generator and Images Detector. 
One the one hand, with adoption of unsupervised learning methods with GANs, we integrated two our own trained models (DCGAN & StyleGAN2) and one pre-trained StyleGAN2 into image generator. The DCGAN model can produce virtual human face for internet celebrities and cute cartoon faces. Although the StyleGAN2 model has been trained for 2,120,000 steps, its performance is still not good, this model will be an experiment for users to try. After integration, the pre-trained model is able to generate 4 types of virtual faces, such as Asian face, celebrity face, online celebrity faces and cartoon faces. 

On the other hand, many kinds of supervised learning with Deep CNN algorithms have been used ensemble in model training for image detector to identify the authenticity of real/ virtual human and cartoon faces, just like VGG16/19, ResNet50/101/152, Xception, InceptionResNet-v2, MobileNet-v2, DenseNet and NASNet.

While interact with VisionLab system, users can revise system settings flexibly to change the no. of generated images per batch (range of values 0-20), single or mixed model types for generating fake faces and detecting uploaded photos. On Image Generator page, users are allowed to get more virtual faces via click “+” button, mark and download any favorite faces. When a photo is uploaded in Image Generator page, a cute robot responds to users whether that photo is real or fake, and now users are allowed to choose correct categorization through click “Agree” and “Disagree” buttons. 

Furthermore, our system not only provides face detection and generation, but also offers more valuable features, such as the ability to upload new weight files if users train their own dataset with our proposed models, and users are also able to train detector models online as we have formed a model auto-training pipeline in our system.

If you want to learn more about the system VisionLab, please access to our GitHub link via clicking the project Site icon on system home page. 

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

