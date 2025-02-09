import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin

def extract_images(url, download_path='images', exclude_keywords=None):
    if exclude_keywords is None:
        exclude_keywords = ['icon', 'logo', 'sns_link', 'banner']
    
    # 웹 페이지 내용 가져오기
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # 이미지 태그 찾기
    img_tags = soup.find_all('img')

    # 다운로드 경로 생성 (절대 경로로 설정)
    download_path = os.path.abspath(download_path)
    if not os.path.exists(download_path):
        os.makedirs(download_path)

    # 이미지 다운로드
    for img in img_tags:
        img_url = img.get('src')
        if not img_url:
            continue

        # 절대 URL로 변환
        img_url = urljoin(url, img_url)

        # 제외할 키워드가 URL에 포함되어 있는지 확인
        if any(keyword in img_url for keyword in exclude_keywords):
            print(f'Skipped: {img_url}')
            continue

        try:
            img_response = requests.get(img_url)
            img_response.raise_for_status()  # HTTP 에러가 발생할 경우 예외 발생

            img_name = os.path.join(download_path, os.path.basename(img_url))

            with open(img_name, 'wb') as f:
                f.write(img_response.content)

            print(f'Downloaded: {img_name}')
        except requests.exceptions.RequestException as e:
            print(f'Failed to download {img_url}: {e}')

if __name__ == '__main__':
    url = 'https://news.mt.co.kr/mtview.php?no=2024052716334249960'  # 이미지 추출할 웹사이트 URL
    extract_images(url)
