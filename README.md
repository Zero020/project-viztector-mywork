# 키포인트 기반 객체 탐지 모델을 이용한 데이터 시각화 왜곡 탐지 및 교정 시스템 개발

> 2024.05-2024.06 개인 작업물 모음

## Overview

오늘날 데이터 시각화는 빅데이터 분석에서 중요한 의사결정 도구로 활용되며, 광고, 마케팅, 뉴스 보도 등 다양한 분야에서 사용되고 있다. 그러나 그래프는 제작자의 의도에 따라 쉽게 변형될 수 있어 왜곡의 위험이 존재하며, 이는 소비자나 사용자에게 잘못된 정보를 제공해 오해를 초래할 수 있다. 본 연구에서는 이러한 문제를 해결하기 위해 왜곡된 차트를 탐지하고 교정된 차트를 제공하는 시스템을 제안하였다. 제안된 시스템은 Hourglass 네트워크 기반의 keypoint 객체 탐지 모델을 활용하여 막대, 선, 원 그래프 유형에서 시각적 요소의 위치를 추출하고, 이를 바탕으로 왜곡을 탐지하고 교정하는 알고리즘을 적용하였다. 실험 결과, 그래프 탐지 검증 정확도는 98%의 우수한 성능을 보였다. 구현 결과 다양한 웹 시각 자료에서 높은 정확도로 왜곡을 탐지하고 교정된 결과를 제공하여 데이터 시각화의 신뢰성을 크게 높일 수 있을 것으로 기대한다.

<br>

## Flow

<img width="1920" height="1080" alt="" src="https://github.com/user-attachments/assets/f7288dad-e025-42cd-8cd3-8427b45edac0" />
<img width="1920" height="1080" alt="" src="https://github.com/user-attachments/assets/af18d079-9af9-4f47-b1e7-88813d4d0d90" />
<img width="1920" height="1080" alt="" src="https://github.com/user-attachments/assets/60caa2e0-d518-4ae1-bca2-abc2f2cb9de5" />
<img width="1920" height="1080" alt="" src="https://github.com/user-attachments/assets/0b4610c4-d4f5-4960-bf35-da314cdc28e6" />

<br>

 ## My task
 
 1. 크롤링
 2. 파이 그래프, 끊긴 물결 막대 그래프의 교정 알고리즘 시도
 3. 이전 데이터셋의 전처리
 4. 크롬 익스텐션 구현

<br>

## Publication

**Title:** Development of a Data Visualization Distortion Detection and Correction System using a Keypoint-based Object Detection Model

**Journal:** Journal of the Korean Institute of Information Technology (KIIT), Vol. 23, No. 1, pp. 177-190, Jan 2025

**Role:** 3rd Author (최영 / Young Choi)

**Status:** Published

#### 📄 [논문 바로가기](https://www.ki-it.com/_PR/view/?aidx=43812&bidx=3952)
